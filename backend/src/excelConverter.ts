import XLSX from 'xlsx';
import fs from 'fs';
import { createProfile } from './profile';
import { ExcelRow, ExcelSheet } from './typedef';
import { validateAdmin } from './auth';

export function tryUploadExcelToDatabase(token: string, filename: string, header?: string[]) {
  validateAdmin(token);
  uploadExcelToDatabase(filename, header);
}

/**
 * Loads excel's contents into the database
 * @param filename 
 * @param header 
 * @returns object
 */
function uploadExcelToDatabase(filename: string, header?: string[]) {
  const excelSheets = excelToJSON(filename, header);
  
  excelSheets.forEach(s => {
    s.rows.forEach(r => {
      try {
        createProfile(r.name, r.desc, r.country, r.scope, r.degLevels, 
          r.category, parseInt(r.minWam), r.load, r.link, ''
        );
      } catch (e) {

      }
    });
  });

  return {};
}

function excelToJSON(filename: string, header?: string[]): ExcelSheet[] {
  const file = fs.readFileSync(filename);
  const data = XLSX.read(file, { type: 'buffer' });
  const res: ExcelSheet[] = [];
  data.SheetNames.forEach(sheetName => {
    let rowObject = XLSX.utils.sheet_to_json(data.Sheets[sheetName], 
      {
        header: header ? header : ['country', 'name', 'scope', 'category', 
        'minWam', 'degLevels', 'load', 'link', 'desc']
      }) as ExcelRow[];
    res.push({ continent: sheetName, rows: rowObject });
  });
  return res;
}