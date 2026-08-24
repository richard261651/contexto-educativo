const XLSX = require('xlsx');
const path = 'C:/Users/richa/Downloads/Base datos IED - GK & AS.xlsx';
const workbook = XLSX.readFile(path);
console.log('Sheet Names:', workbook.SheetNames);
for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n--- Sheet: ${sheetName} (Rows: ${data.length}) ---`);
  for (let i = 0; i < Math.min(10, data.length); i++) {
    console.log(`Row ${i}:`, JSON.stringify(data[i]));
  }
}
