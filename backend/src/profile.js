import { getData, setData } from 'dataStore';
import HTTPError from 'http-errors';

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
    for (const profile of data) {
        profile = matchKeywords(profile, keywords);
    }

    // Filter and sort
    data = data.filter(profile => profile.matchingIndices > 0);
    data = sort(data);

    return data;
}

function sort(database) {
    let swapped;
    const n = database.length;

    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (compare(database[j], database[j + 1])) {
                database = swap(database, j, j + 1);
                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }
    }

    return database;
}

function swap(database, i, j) {
    const temp = database[i];
    database[i] = database[j];
    database[j] = temp;
    return database;
}

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
 * Filters database profiles by criteria. Criteria are given as a list of potential targets
 * Null assumes no preference
 * @param {*} database 
 * @param {*} criteria 
 */

function filterCriterias(database, criteria) {
    if (criteria.continent !== null) {
        database = database.filter(profile => profile.matchesContinent(criteria.continent));
    }
    if (criteria.country !== null) {
        database = database.filter(profile => profile.matchesCountry(criteria.country));
    }
    if (criteria.degree !== null) {
        database = database.filter(profile => profile.matchesDegree(criteria.degree));
    }
    if (criteria.category !== null) {
        database = database.filter(profile => profile.matchesCategory(criteria.category));
    }
    if (criteria.wam !== null) {
        database = database.filter(profile => profile.matchesWam(criteria.wam));
    }
    if (criteria.degreeLevel !== null) {
        database = database.filter(profile => profile.matchesDegreeLevel(criteria.degreeLevel));
    }
    if (criteria.load !== null) {
        database = database.filter(profile => profile.matchesLoad(criteria.load));
    }
    return database;
}

function matchKeyword(a, b) {
    return a.toLowerCase() === b.toLowerCase();
}