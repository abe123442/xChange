// ENUMS
export enum category {
  SUPERPARTNER,
  HIGHCAPACITY,
  HIGHDEMAND
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
  category: category,
  minWam: number,
  fullTimeLoad: number,
  link: string,
  img: string,
  rating: number,
  numRates: number,
  comments: Array<number>
}

export interface Comment {
  id: number,
  title: string,
  desc: string,
  rating: number
}

export interface Data {
  profiles: Profile;
}
