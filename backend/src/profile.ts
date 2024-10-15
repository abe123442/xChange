import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';
import { Category, DegLevel, Profile } from './typedef';

/**
 * Creates new profile with input parameters
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
export function createProfile(
    name: string, desc: string, country: string, scope: string, degLevels: string[],
    category: string, minWam: number, load: string, link: string, img: string) {
    if (!name || name.length > 50) {
        throw HTTPError(400, 'Invalid university name provided, must not be blank and be at most 50 characters');
    }

    if (desc.length > 500) {
        throw HTTPError(400, 'Invalid university description provided, must be at most 500 characters');
    }

    if (!country) {
        throw HTTPError(400, 'Invalid country provided');
    }

    if (!scope) {
        throw HTTPError(400, 'Invalid scope provided');
    }

    if (!(category in Category)) {
        throw HTTPError(400, 'Invalid category provided');
    }

    if (degLevels.some(d => !(d in DegLevel))) {
        throw HTTPError(400, 'Invalid degree level(s) provided');
    }

    if (minWam < 0 || minWam > 100) {
        throw HTTPError(400, 'Invalid WAM provided');
    }

    if (!load) {
        throw HTTPError(400, 'Invalid full time load provided');
    }

    const urlRegex = /^(http[s]{0,1}:\/\/){0,1}www\..*/

    if (!link.match(urlRegex)) {
        throw HTTPError(400, 'Invalid website URL provided');
    }

    if (!img.match(urlRegex)) {
        throw HTTPError(400, 'Invalid image URL provided');
    }
    
    const data = getData();
    let newId = data.profiles.length;

    let newProfile = {
        id: newId,
        name: name,
        desc: desc,
        country: country,
        scope: scope,
        category: category,
        minWam: minWam,
        load: load,
        degLevels: degLevels,
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

    if (profileid < 0 || profileid >= data.profiles.length) {
        throw HTTPError(400, 'Requested profile does not exist');
    }

    const profile = data.profiles[profileid];
    return profile;
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
    name: string, desc: string, country: string, scope: string, degLevels: string[],
    category: string, minWam: number, load: string, link: string, img: string): Profile[] {
    const splitRegex = /[\s,-/]+/;
    
    let profiles = getData().profiles;

    // Double negative, !!, also checks for falsey (ie, empty strings)
    if (!!name) {
        profiles = profiles.filter(p => matchKeywordsStr(p.name, name.split(splitRegex)));
    }
    if (!!desc) {
        profiles = profiles.filter(p => matchKeywordsStr(p.desc, desc.split(splitRegex)));
    }
    if (!!country) {
        profiles = profiles.filter(p => matchKeywordsStr(p.country, country.split(splitRegex)));
    }
    if (!!scope) {
        profiles = profiles.filter(p => matchKeywordsStr(p.scope, scope.split(splitRegex)));
    }
    if (!!category) {
        profiles = profiles.filter(p => p.category === category);
    }
    if (!!minWam) {
        profiles = profiles.filter(p => p.minWam <= minWam);
    }
    if (!!degLevels) {
        profiles = profiles.filter(p => matchKeywordsArr(p.degLevels, degLevels));
    }
    if (!!load) {
        profiles = profiles.filter(p => matchKeywordsStr(p.load, load.split(splitRegex)));
    }
    return profiles;
}

/**
 * Returns true if string contains any of the keywords
 * @param {*} string 
 * @param {*} keywords 
 * @returns 
 */
function matchKeywordsStr(string: string, keywords: string[]): boolean {
    const splitRegex = /[\s,-/]+/;
    const basewords = string.split(splitRegex);
    return matchKeywordsArr(basewords, keywords);
}

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

function hasSubstring(main: string, sub: string): boolean {
    return main.toLowerCase().includes(sub);
}

function matches(a: string, b: string): boolean {
    return a.toLowerCase().localeCompare(b.toLowerCase()) === 0;
}

// function matchKeywords(string, keywords) {
//     const words = profile.name.split(" ");
//     const matchingIndices = [];

//     for (const i in words) {
//         let found = false;
//         for (const j in keywords) {
//             if (matchKeyword(words[i], keywords[j])) {
//                 matchingIndices.push(j);
//                 found = true;
//                 break;
//             }
//         }
//         if (!found) {
//             matchingIndices.push(-2);
//         }
//     }

//     let streak = 0;
//     let maxStreak = 0;
//     let prev = -2;
//     for (const index of matchingIndices) {
//         if (index === prev + 1) {
//             streak++;
//         }
//         else {
//             streak = 1;
//         }
//         if (streak > maxStreak) {
//             maxStreak = streak;
//         }
//         prev = index;
//     }
//     profile.maxConsecutive = maxStreak;

//     let matching = 0;
//     for (const index of matchingIndices) {
//         if (index !== -2) {
//             matching++;
//         }
//     }
//     profile.matchingIndices = matching;

//     return profile;
// }

// function matchKeyword(a, b) {
//     return a.toLowerCase() === b.toLowerCase();
// }
