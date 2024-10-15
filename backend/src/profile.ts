import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';
import { Category, DegLevel } from './typedef';

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

    // TODO: change this to enum
    if (!(category in Category)) {
        throw HTTPError(400, 'Invalid category provided');
    }

    // TODO: add degLevel enum check
    if (degLevels.some(d => !(d in DegLevel))) {
        throw HTTPError(400, 'Invalid degree level(s) provided');
    }

    if (!minWam || minWam < 0 || minWam > 100) {
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

export function getAllProfiles() {
    const data = getData();
    return data.profiles;
}

/**
 * Get information on the exchange profile with profileid
 * @param {number} profileid 
 */
export function getProfile(profileid: number) {
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
 * @param {*} data 
 * @param {*} criterion...
 */
export function getFilteredProfiles(
    name: string, desc: string, country: string, scope: string, degLevels: string[],
    category: string, minWam: number, load: string, link: string, img: string) {
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

function matchKeywordsStr(string: string, keywords: string[]) {
    const splitRegex = /[\s,-/]+/;
    const basewords = string.split(splitRegex);
    matchKeywordsArr(basewords, keywords);
}

function matchKeywordsArr(basewords: string[], keywords: string[]) {
    for (const word of basewords) {
        for (const keyword of keywords) {
            if (word.localeCompare(keyword) === 0) {
                return true;
            }
        }
    }

    return false;
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
