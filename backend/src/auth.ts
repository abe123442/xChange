import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';
import crypto, { randomUUID } from 'crypto';
import { Data, User, CONSTANTS, ADMIN_EMAILS } from './typedef';

function hash(initValue: string): string {
    return crypto.createHash('sha256').update(initValue).digest('hex');
}

function generateUUID(): string {
    return randomUUID();
}

/**
 * Requires database to have an array of users
 * @param {*} email 
 * @param {*} password 
 * @param {*} nameFirst 
 * @param {*} nameLast 
 * @param {*} username 
 */
export function register(email: string, password: string, nameFirst: string, nameLast: string, username: string): string {
    const database = getData();

    // Error checks
    const user = database.users.find(user => user.email.localeCompare(email) === 0);

    if (user) {
        throw HTTPError(400, "Email is already registered");
    }

    const id = database.users.length;
    database.users.push({
        id: id,
        email: email,
        password: hash(password),
        nameFirst: nameFirst,
        nameLast: nameLast,
        username: username,
        tokens: []
    });

    setData(database);
    return login(email, password);
}

export function login(email: string, password: string): string {
    const database = getData();

    // Error checks
    const user = database.users.find(user => user.email.localeCompare(email) === 0);

    if (!user) {
        throw HTTPError(400, "Email not found");
    }

    if (user.password != hash(password)) {
        throw HTTPError(400, "Password is incorrect");
    }

    const token = generateUUID();
    user.tokens.push(token);

    setData(database);
    return token;
}

export function logout(token: string) {
    const database = getData();

    // Error checks
    const user = database.users.find(user => user.tokens.includes(token));

    if (!user) {
        throw HTTPError(400, "Token is invalid");
    }
    user.tokens.splice(user.tokens.indexOf(token), 1);

    setData(database);
    return {};
}

export function isAdmin(token: string): boolean {
    const database = getData();

    const user = database.users.find(user => user.tokens.includes(token));

    if (!user) {
        throw HTTPError(400, "Token is invalid");
    }

    if (ADMIN_EMAILS.includes(user.email)) {
        return true;
    }
    return false;
}