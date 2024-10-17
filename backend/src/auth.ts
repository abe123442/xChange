import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';
import crypto, { randomUUID } from 'crypto';
import { Data, ADMIN_EMAILS, User } from './typedef';

function hash(initValue: string): string {
  return crypto.createHash('sha256').update(initValue).digest('hex');
}

function generateUUID(): string {
  return randomUUID();
}

/**
 * Requires data to have an array of users
 * @param {*} email 
 * @param {*} password 
 * @param {*} nameFirst 
 * @param {*} nameLast 
 * @param {*} username 
 */
export function register(email: string, password: string, nameFirst: string, nameLast: string, username: string): string {
  const data = getData();

  // Error checks
  const user = data.users.find(user => user.email.localeCompare(email) === 0);

  if (user) {
    throw HTTPError(400, "Email is already registered");
  }

  const id = data.users.length;
  data.users.push({
    id: id,
    email: email,
    password: hash(password),
    nameFirst: nameFirst,
    nameLast: nameLast,
    username: username,
    tokens: []
  });

  setData(data);
  return login(email, password);
}

export function login(email: string, password: string): string {
  const data = getData();

  // Error checks
  const user = data.users.find(user => user.email.localeCompare(email) === 0);

  if (!user) {
    throw HTTPError(400, "Email not found");
  }

  if (user.password != hash(password)) {
    throw HTTPError(400, "Password is incorrect");
  }

  const token = generateUUID();
  user.tokens.push(token);

  setData(data);
  return token;
}

export function logout(token: string) {
  const data = getData();

  // Error checks
  const user = validateToken(token, data);

  user.tokens.splice(user.tokens.indexOf(token), 1);

  setData(data);
  return {};
}

export function validateAdmin(token: string) {
  const user = validateToken(token);
  if (!ADMIN_EMAILS.includes(user.email)) {
    throw HTTPError(403, "User must be an administrator");
  }
  return user;
}

export function validateToken(token: string, dataRef?: Data): User {
  const data = dataRef ? dataRef : getData();
  
  const user = data.users.find(user => user.tokens.includes(token));
  if (!user) {
    throw HTTPError(401, "Token is invalid");
  }

  return user;
}