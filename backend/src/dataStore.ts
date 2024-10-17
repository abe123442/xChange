import fs from 'fs';
import { Data } from './typedef';

// Use get() to access the data
export function getData(): Data {
  return loadData();
}

// Use set(data) to pass in the entire data object, with modifications made
export function setData(data: Data) {
  saveData(data);
}

// Expansion of setData and getData
function saveData(data: Data) {
  const filename = 'dataMemory.json';
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

function loadData(): Data {
  const filename = 'dataMemory.json';
  if (!fs.existsSync(filename)) {
    return { profiles: [], users: [], comments: [] };
  }
  return JSON.parse(fs.readFileSync(filename, 'utf8'));
}
