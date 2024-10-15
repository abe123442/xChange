// ENUMS
export enum Category {
  SUPER_PARTNER = 'Super Partner',
  HIGH_CAPACITY = 'High Capacity',
  HIGH_DEMAND = 'High Demand'
}

export enum DegLevel {
  UG = 'UG',
  PG = 'PG'
}

// CONSTANTS
export const CONSTANTS = {
  MAX_CAPACITY: 10000
}

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
  comments: Array<number>
}

export interface User {
  id: number,
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  username: string,
  tokens: number[]
}

export interface Comment {
  id: number,
  title: string,
  desc: string,
  rating: number,
  upvotes: number,
  downvotes: number
}

export interface Data {
  profiles: Profile[],
  users: User[]
}
