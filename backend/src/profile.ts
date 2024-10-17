import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';
import { ADMIN_EMAILS, CATEGORY, Data, DegLevel, Profile, SPLITREGEX } from './typedef';
import { validateAdmin } from './auth';

/**
 * Creates new profile with input parameters, must be ADMIN to do so
 * @param name 
 * @param desc 
 * @param country 
 * @param scope 
 * @param degLevels 
 * @param category 
 * @param minWam 
 * @param load 
 * @param link 
 * @param img 
 */
export function tryCreateProfile(
  token: string, name: string, desc: string, country: string, scope: string, 
  degLevels: string, category: string, minWam: number, load: string, 
  link: string, img: string
) {
  validateAdmin(token);
  return createProfile(name, desc, country, scope, degLevels, category, minWam,
    load, link, img
  );
}

export function createProfile(
  name: string, desc: string, country: string, scope: string, 
  degLevels: string, category: string, minWam: number, load: string, 
  link: string, img: string
) {
  const data = getData();

  if (!name || name.length > 100) {
    throw HTTPError(400,
      'Invalid university name provided, must not be blank and be at most 100 characters'
    );
  }
  name = name.trim();

  const profile = data.profiles.find(profile => profile.name.localeCompare(name) === 0);
  if (profile) {
    throw HTTPError(400,
      'An existing profile with the same name already exists, try again'
    );
  }

  if (desc) {
    if (desc.length > 1000) {
      throw HTTPError(400,
        'Invalid university description provided, must be at most 1000 characters'
      );
    }
    desc = desc.trim();
  }
  
  if (!country) {
    throw HTTPError(400, 'Invalid country provided');
  }
  country = country.trim();

  if (!scope) {
    throw HTTPError(400, 'Invalid scope provided');
  }
  scope = scope.trim();

  if (!category) {
    throw HTTPError(400, 'Invalid category provided');
  }
  category = category.trim();
  if (!(CATEGORY.includes(category))) {
    throw HTTPError(400, 'Invalid category provided');
  }

  const degLevelsArr = degLevels.split(SPLITREGEX);
  if (degLevelsArr.some(d => d && !(d in DegLevel))) {
    throw HTTPError(400, 'Invalid degree level(s) provided');
  }

  if (minWam < 0 || minWam > 100) {
    throw HTTPError(400, 'Invalid WAM provided');
  }

  if (!load) {
    load = '?';
    // throw HTTPError(400, 'Invalid full time load provided');
  }
  load = load.trim();

  const urlRegex = /^((https?:\/\/)|(www\.)).*/

  if (!link) {
    throw HTTPError(400, 'No website URL provided');
  }
  link = link.trim();

  // NOTE: Invalid links allowed because some fields in the placement xlsx has 
  // 'Please check with advisor' in the link field
  // if (!link.match(urlRegex)) {
  //   throw HTTPError(400, 'Invalid website URL provided');
  // }

  if (img) {
    if (!img.match(urlRegex)) {
      throw HTTPError(400, 'Invalid image URL provided');
    }
    img = img.trim();
  }
  
  let newId = data.profiles.length + data.deletedProfiles;

  let newProfile = {
    id: newId,
    name: name,
    desc: desc,
    country: country,
    scope: scope,
    category: category,
    minWam: minWam,
    load: load,
    degLevels: degLevelsArr,
    link: link,
    img: img,
    rating: 0,
    numRates: 0,
    comments: []
  }

  data.profiles.push(newProfile);
  setData(data);

  return {};
}

export function editProfile(token: string, name: string, desc: string, country: string, scope: string, 
  degLevels: string, category: string, minWam: number, load: string, 
  link: string, img: string) {
  const database: Data = getData();

  const user = database.users.find(user => user.tokens.includes(token));

  if (!user) {
    throw HTTPError(401, "Token not found");
  }

  if (!ADMIN_EMAILS.includes(user.email)) {
    throw HTTPError(401, "Unauthorised access");
  }

  const profile = database.profiles.find(profile => profile.name.localeCompare(name) === 0);

  if (!profile) {
    throw HTTPError(400, "Invalid profile");
  }

  profile.name = name;
  profile.desc = desc;
  profile.country = country;
  profile.scope = scope;

  const degLevelsArr = degLevels.split(SPLITREGEX);
  profile.degLevels = degLevelsArr;

  profile.category = category;
  profile.minWam = minWam;
  profile.load = load;
  profile.link = link;
  profile.img = img;

  setData(database);
}

export function deleteProfile(token: string, name: string) {
  const database: Data = getData();

  const user = database.users.find(user => user.tokens.includes(token));

  if (!user) {
    throw HTTPError(401, "Token not found");
  }

  if (!ADMIN_EMAILS.includes(user.email)) {
    throw HTTPError(401, "Unauthorised access");
  }

  const profile = database.profiles.find(profile => profile.name.localeCompare(name) === 0);

  if (!profile) {
    throw HTTPError(400, "Invalid profile");
  }

  database.profiles.splice(database.profiles.indexOf(profile), 1);
  database.deletedProfiles += 1;
  setData(database);
}

export function getAllProfiles(): Profile[] {
  const data = getData();
  return data.profiles;
}

/**
 * Get information on the exchange profile with profileid
 * @param profileid 
 * @returns requested profile with that profileid
 */
export function getProfile(profileid: number): Profile {
  const data = getData();

  const foundProfile = data.profiles.filter((x) => x.id === profileid)[0];

  if (!foundProfile) {
    throw HTTPError(400, 'Requested profile does not exist');
  }

  return foundProfile;
}

/**
 * Filters data profiles by criteria. Criteria are given as a list of potential targets
 * Null assumes no preference
 * @param name 
 * @param desc 
 * @param country 
 * @param scope 
 * @param degLevels 
 * @param category 
 * @param minWam 
 * @param load 
 * @param link 
 * @param img 
 * @returns list of filtered profiles
 */
export function getFilteredProfiles(
  name: string, desc: string, country: string, scope: string, degLevels: string,
  category: string, minWam: number, load: string
): Profile[] {
  let profiles = getData().profiles;

  // Double negative, !!, also checks for falsey (ie, empty strings)
  if (!!name) {
    profiles = profiles.filter(p => matchKeywordsStr(p.name, name.split(SPLITREGEX)));
  }
  if (!!desc) {
    profiles = profiles.filter(p => matchKeywordsStr(p.desc, desc.split(SPLITREGEX)));
  }
  if (!!country) {
    profiles = profiles.filter(p => matchKeywordsStr(p.country, country.split(SPLITREGEX)));
  }
  if (!!scope) {
    profiles = profiles.filter(p => matchKeywordsStr(p.scope, scope.split(SPLITREGEX)));
  }
  if (!!category) {
    profiles = profiles.filter(p => p.category === category);
  }
  if (!!minWam) {
    profiles = profiles.filter(p => p.minWam <= minWam);
  }
  if (!!degLevels) {
    profiles = profiles.filter(p => matchKeywordsArr(p.degLevels, degLevels.split(SPLITREGEX)));
  }
  if (!!load) {
    profiles = profiles.filter(p => matchKeywordsStr(p.load, load.split(SPLITREGEX)));
  }

  profiles.sort((a, b) => a.name.localeCompare(b.name));

  return profiles;
}

function matchKeywordsStr(string: string, keywords: string[]): boolean {
  const basewords = string.split(SPLITREGEX);
  return matchKeywordsArr(basewords, keywords);
}

/**
 * Returns true if string contains any of the keywords
 * @param {*} string 
 * @param {*} keywords 
 * @returns 
 */
function matchKeywordsArr(basewords: string[], keywords: string[]): boolean {
  for (const word of basewords) {
    for (const keyword of keywords) {
      if (matches(word, keyword)) {
        return true;
      }
    }
  }

  return false;
}

function matches(a: string, b: string): boolean {
  return a.toLowerCase().localeCompare(b.toLowerCase()) === 0;
}