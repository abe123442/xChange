// ENUMS
export enum DegLevel {
  UG = 'UG',
  PG = 'PG'
}

// CONSTANTS
export const CATEGORY = ['Super Partner', 'High Capacity', 'High Demand'];
export const SPLITREGEX = /[\s,-/]+/;

// Admin emails
export const ADMIN_EMAILS = ['unsw-admin@ad.unsw.edu.au'];

// INTERFACES
export interface Error {
  status: number,
  message: string
}

export interface Profile {
  id: number,
  name: string,
  desc: string,
  country: string,
  scope: string,
  category: string,
  minWam: number,
  degLevels: string[],
  load: string,
  link: string,
  img: string,
  rating: number,
  numRates: number,
  comments: number[]
}

export interface User {
  id: number,
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  username: string,
  tokens: string[],
  targetuni: string[];
}

export interface Comment {
  id: number,
  username: string,
  userid: number,
  title: string,
  desc: string,
  rating: number,
  upvotedUsers: number[],
  downvotedUsers: number[]
}

export interface Data {
  profiles: Profile[],
  users: User[],
  comments: Comment[]
}

export interface ExcelSheet {
  continent: string,
  rows: ExcelRow[]
}

export interface ExcelRow {
  name: string,
  desc: string,
  country: string,
  scope: string,
  category: string,
  minWam: string,
  degLevels: string,
  load: string,
  link: string,
}
