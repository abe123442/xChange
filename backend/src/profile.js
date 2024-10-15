import { getData, setData } from 'dataStore';
import HTTPError from 'http-errors';

export function createProfile(uniName, uniDesc, country, scope, category, minWam, fullTimeLoad, link, imgUrl) {

    if (uniName === null || uniName === undefined || uniName === "" || uniName.length > 50) {
        throw HTTPError(400, 'Invalid university name provided');
    }

    if (uniDesc === null || uniDesc === undefined || uniDesc === "" || uniDesc.length > 500) {
        throw HTTPError(400, 'Invalid university description provided');
    }

    if (country === null || country === undefined || country === "" || country.length > 30) {
        throw HTTPError(400, 'Invalid country provided');
    }

    if (scope === null || scope === undefined || scope === "" || scope.length > 50) {
        throw HTTPError(400, 'Invalid scope provided');
    }

    if (category !== "Super Partner" || category !== "High Capacity" || category !== "High Demand") {
        throw HTTPError(400, 'Invalid category provided');
    }
    
    if (!uniName || !uniDesc || !country || !scope || !category) {
        throw HTTPError(400, 'Not all requested data was provided');
    }

    if (minWam === null || minWam === undefined || typeof minWam !== 'number' || minWam < 0 || minWam > 100) {
        throw HTTPError(400, 'Invalid WAM provided');
    }

    if (fullTimeLoad === null || fullTimeLoad === undefined || typeof fullTimeLoad !== 'number' || fullTimeLoad < 0) {
        throw HTTPError(400, 'Invalid full time load provided');
    }

    const urlRegex = /^(http[s]{0,1}:\/\/){0,1}www\..*/

    if (!link.match(urlRegex)) {
        throw HTTPError(400, 'Invalid website URL provided');
    }
    if (!imgUrl.match(urlRegex)) {
        throw HTTPError(400, 'Invalid image URL provided');
    }
    
    let data = getData().profiles;
    let newId = data.profiles.length;
    while (data.profiles.indexOf(newId) !== -1) {
        newId = newId + 1;
    }

    let newProfile = {
        id: newId,
        name: uniName,
        desc: uniDesc,
        country: country,
        scope: scope,
        category: category,
        minWam: minWam,
        fullTimeLoad: fullTimeLoad,
        link: link,
        img: imgUrl,
        rating: 0,
        numRates: 0,
        comments: []
    }

    data.push(newProfile);
    setData(data);
}

export function getAllProfiles() {
    const data = getData();
    return data.profiles;
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
 * Filters data profiles by criteria. Criteria are given as a list of potential targets
 * Null assumes no preference
 * @param {*} data 
 * @param {*} criterion...
 */
export function getFilteredProfiles(namePatternStr, descPatternStr, country, scope, category, minWam, degLevel, load) {
    const splitRegex = /[\s,-/]+/
    
    let profiles = getData().profiles;
    // Double negative, !!, also checks for falsey (ie, empty strings)
    if (!!namePatternStr) {
        profiles = profiles.filter(p => p.name.matchKeywords(namePatternStr.split(splitRegex/)));
    }
    if (!!descPatternStr) {
        profiles = profiles.filter(p => p.desc.matchKeywords(descPatternStr.split(splitRegex)));
    }
    if (!!country) {
        profiles = profiles.filter(p => p.country.matchKeywords(country.split(splitRegex)));
    }
    if (!!scope) {
        profiles = profiles.filter(p => p.scope.matchKeywords(scope.split(splitRegex)));
    }
    if (!!category) {
        profiles = profiles.filter(p => p.category === category);
    }
    if (!!wam) {
        profiles = profiles.filter(p => p.minWam <= minWam);
    }
    if (!!degreeLevel) {
        profiles = profiles.filter(p => p.degLevel.matchKeywords(degLevel.split(splitRegex)));
    }
    if (!!criteria.load) {
        profiles = profiles.filter(p => p.matchKeywords(load.split(splitRegex)));
    }
    return profiles;
}

/**
 * Search algorithm that returns a list of appropriate programs
 * Algorithm matches by name and filters using optional criteria such as region, faculty
 * Results are sorted based on name matching
 * @param {*} keywords 
 * @param {*} criteria 
 */
export function search(keywords, criteria) {
    const data = getData();
    
    if (criteria !== null) {
        data = filterCriteria(data, criteria);
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

function filterCriteria(data, criteria) {
    let profiles;
    if (criteria.continent !== null) {
        profiles = data.profiles.filter(profile => profile.matchesContinent(criteria.continent));
    }
    if (criteria.country !== null) {
        profiles = data.profiles.filter(profile => profile.matchesCountry(criteria.country));
    }
    if (criteria.degree !== null) {
        profiles = data.profiles.filter(profile => profile.matchesDegree(criteria.degree));
    }
    if (criteria.category !== null) {
        profiles = data.profiles.filter(profile => profile.matchesCategory(criteria.category));
    }
    if (criteria.wam !== null) {
        profiles = data.profiles.filter(profile => profile.matchesWam(criteria.wam));
    }
    if (criteria.degreeLevel !== null) {
        profiles = data.profiles.filter(profile => profile.matchesDegreeLevel(criteria.degreeLevel));
    }
    if (criteria.load !== null) {
        profiles = data.profiles.filter(profile => profile.matchesLoad(criteria.load));
    }
    return profiles;
}

function matchKeyword(a, b) {
    return a.toLowerCase() === b.toLowerCase();
}