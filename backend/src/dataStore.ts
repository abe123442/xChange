import fs from 'fs';

// Use get() to access the data
export function getData() {
  loadData();
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
export function setData(newData) {
  data = newData;
  saveData(data);
}

// Expansion of setData and getData
function saveData(data) {
  const filename = 'dataMemory.json';
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

function loadData() {
  const filename = 'dataMemory.json';
  if (!fs.existsSync(filename)) {
    return;
  }
  data = JSON.parse(fs.readFileSync(filename, 'utf8'));
}
