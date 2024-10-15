import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';
import crypto from 'crypto';
import { Data, User, CONSTANTS } from './typedef';

export function hash(initValue: string) {
    return crypto.createHash('sha256').update(initValue).digest('hex');
}

function generateId(): number {
    const database: Data = getData();

    let id: number = Math.floor(Math.random() * CONSTANTS.MAX_CAPACITY);
    let unique: boolean = false;
    while (!unique) {
        id = Math.floor(Math.random() * CONSTANTS.MAX_CAPACITY);
        unique = true;
        const user: any = database.users.filter(user => user.id === id);
        if (user) {
            unique = false;
            break;
        }
    }
    return id;
}

function generateToken(): number {
    const database = getData();

    let token: number = Math.floor(Math.random() * CONSTANTS.MAX_CAPACITY);
    let unique: boolean = false;
    while (!unique) {
        token = Math.floor(Math.random() * CONSTANTS.MAX_CAPACITY);
        unique = true;
        const user: any = database.users.filter(user => user.tokens.includes(token));
        if (user) {
            unique = false;
            break;
        }
    }
    return token;
}

/**
 * Requires database to have an array of users
 * @param {*} email 
 * @param {*} password 
 * @param {*} nameFirst 
 * @param {*} nameLast 
 * @param {*} username 
 */
export function register(email: string, password: string, nameFirst: string, nameLast: string, username: string): number {
    const database: Data = getData();

    // Error checks
    const user = database.users.filter(user => user.email.localeCompare(email) === 0);

    if (user) {
        throw HTTPError(400, "Email is already registered");
    }

    const id: number = generateId();
    database.users.push({
        id: id,
        email: email,
        password: hash(password),
        nameFirst: nameFirst,
        nameLast: nameLast,
        username: username,
        tokens: [generateToken()]
    });

    setData(database);
    return id;
}

export function login(email: string, password: string): number {
    const database: Data = getData();

    // Error checks
    const user: any = database.users.filter(user => user.email.localeCompare(email) === 0);

    if (!user) {
        throw HTTPError(400, "Email not found");
    }

    if (user.password != hash(password)) {
        throw HTTPError(400, "Password is incorrect");
    }

    const token: number = generateToken();
    user.tokens.push(token);

    setData(database);
    return token;
}

export function logout(token: number) {
    const database: Data = getData();

    const user: any = database.users.filter(user => user.tokens.includes(token));
    user.tokens.splice(user.tokens.indexOf(token), 1);

    setData(database);
}