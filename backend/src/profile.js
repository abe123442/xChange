import { getData, setData } from 'dataStore';
import HTTPError from 'http-errors';

export function createProfile() {
    //TODO: params equal to the fields in each profile, tba
}

/**
 * Get information on the exchange profile with profileid
 * @param {int} profileid 
 */
export function getProfile(profileid) {
    const data = getData();

    if (data.profiles.indexOf(profileid) === -1) {
        throw HTTPError(400, 'Requested profile does not exist');
    }

    const profile = data.profiles[profileid];
    return profile;
}

/**
 * Search algorithm that returns a list of appropriate programs
 * Algorithm matches by name and filters using optional criteria such as region, faculty
 * Results are sorted based on name matching
 * @param {*} name 
 * @param {*} criteria 
 */
export function search(keywords, criteria) {
    const data = getData();
    
    if (criteria !== null) {
        data = filterCriterias(data, criteria);
    }

    // Searches by name
    for (const profile of data.profiles) {
        profile = matchKeywords(profile, keywords);
    }

    // Filter and sort
    let newData = data.profiles.filter(profile => profile.matchingIndices > 0);
    newData.sort((a, b) => compare(a, b));

    return newData;
}

// function sort(data) {
//     let swapped;
//     const n = data.length;

//     for (let i = 0; i < n - 1; i++) {
//         swapped = false;
//         for (let j = 0; j < n - i - 1; j++) {
//             if (compare(data[j], data[j + 1])) {
//                 data = swap(data, j, j + 1);
//                 swapped = true;
//             }
//         }

//         if (!swapped) {
//             break;
//         }
//     }

//     return data;
// }

// function swap(data, i, j) {
//     const temp = data[i];
//     data[i] = data[j];
//     data[j] = temp;
//     return data;
// }

function compare(a, b) {
    if (a.maxConsecutive > b.maxConsecutive) {
        return false;
    }
    if (a.matchingIndices > b.matchingIndices) {
        return false;
    }
    if (a.name.localeCompare(b.name) == -1) {
        return false;
    }
    return true;
}

/**
 * String matching algorithm
 * Ideally prioritises:
 * - All keywords matched in order
 * - Some keywords matched in order
 * - Keywords matched not in order
 * - No matches: Removed
 * @param {*} keywords 
 * @param {*} name 
 */
function matchKeywords(profile, keywords) {
    const words = profile.name.split(" ");
    const matchingIndices = [];

    for (const i in words) {
        let found = false;
        for (const j in keywords) {
            if (matchKeyword(words[i], keywords[j])) {
                matchingIndices.push(j);
                found = true;
                break;
            }
        }
        if (!found) {
            matchingIndices.push(-2);
        }
    }

    let streak = 0;
    let maxStreak = 0;
    let prev = -2;
    for (const index of matchingIndices) {
        if (index === prev + 1) {
            streak++;
        }
        else {
            streak = 1;
        }
        if (streak > maxStreak) {
            maxStreak = streak;
        }
        prev = index;
    }
    profile.maxConsecutive = maxStreak;

    let matching = 0;
    for (const index of matchingIndices) {
        if (index !== -2) {
            matching++;
        }
    }
    profile.matchingIndices = matching;

    return profile;
}

/**
 * Filters data profiles by criteria. Criteria are given as a list of potential targets
 * Null assumes no preference
 * @param {*} data 
 * @param {*} criteria 
 */

function filterCriterias(data, criteria) {
    if (criteria.continent !== null) {
        data = data.filter(profile => profile.matchesContinent(criteria.continent));
    }
    if (criteria.country !== null) {
        data = data.filter(profile => profile.matchesCountry(criteria.country));
    }
    if (criteria.degree !== null) {
        data = data.filter(profile => profile.matchesDegree(criteria.degree));
    }
    if (criteria.category !== null) {
        data = data.filter(profile => profile.matchesCategory(criteria.category));
    }
    if (criteria.wam !== null) {
        data = data.filter(profile => profile.matchesWam(criteria.wam));
    }
    if (criteria.degreeLevel !== null) {
        data = data.filter(profile => profile.matchesDegreeLevel(criteria.degreeLevel));
    }
    if (criteria.load !== null) {
        data = data.filter(profile => profile.matchesLoad(criteria.load));
    }
    return data;
}

function matchKeyword(a, b) {
    return a.toLowerCase() === b.toLowerCase();
}