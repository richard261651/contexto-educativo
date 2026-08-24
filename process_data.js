const XLSX = require('xlsx');
const fs = require('fs');

const path = 'C:/Users/richa/Downloads/Base datos IED - GK & AS.xlsx';
const workbook = XLSX.readFile(path);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const header = rows[0];
console.log('Headers:', header);

const uniqueSchedules = new Set();
const uniqueGrades = new Set();
const uniqueLocalities = new Set();
const uniqueStrategies = new Set();
const uniqueIEDs = new Set();

const parsedRecords = [];

function parseSchedule(horarioStr) {
  if (!horarioStr || typeof horarioStr !== 'string') {
    return { raw: '', days: [], startTime: '00:00', endTime: '00:00', startHour: 0, endHour: 0, durationMinutes: 0 };
  }
  const clean = horarioStr.trim();
  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Sabado', 'Domingo'];
  
  let days = [];
  for (const d of dayNames) {
    if (new RegExp(d, 'i').test(clean)) {
      const normalizedDay = d.replace('Miercoles', 'Miércoles').replace('Sabado', 'Sábado');
      if (!days.includes(normalizedDay)) {
        days.push(normalizedDay);
      }
    }
  }

  // Look for time pattern like 13:45 - 15:45 or 8:30 - 10:30 or 7:00 a 9:00
  const timeMatch = clean.match(/(\d{1,2})[:\.](\d{2})\s*(?:-|a|al|hasta)\s*(\d{1,2})[:\.](\d{2})/i);
  let startTime = '08:00';
  let endTime = '10:00';
  let startHour = 8;
  let endHour = 10;

  if (timeMatch) {
    let h1 = parseInt(timeMatch[1], 10);
    let m1 = parseInt(timeMatch[2], 10);
    let h2 = parseInt(timeMatch[3], 10);
    let m2 = parseInt(timeMatch[4], 10);
    
    // Check if 12h format without pm (e.g. 2:00 - 4:00 in afternoon)
    // If h1 < 7 and not morning, or if text has PM
    const isPM = /pm|p\.m\./i.test(clean);
    if (isPM && h1 < 12) h1 += 12;
    if (isPM && h2 < 12) h2 += 12;

    startTime = `${String(h1).padStart(2, '0')}:${String(m1).padStart(2, '0')}`;
    endTime = `${String(h2).padStart(2, '0')}:${String(m2).padStart(2, '0')}`;
    startHour = h1 + m1 / 60;
    endHour = h2 + m2 / 60;
  }

  const durationMinutes = Math.round((endHour - startHour) * 60);

  return {
    raw: clean,
    days: days.length > 0 ? days : ['Lunes'],
    startTime,
    endTime,
    startHour,
    endHour,
    durationMinutes
  };
}

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (!r || r.length === 0 || !r[0]) continue;

  const ied = (r[0] || '').toString().trim();
  const estrategia = (r[1] || '').toString().trim();
  const gradoGeneral = (r[2] || '').toString().trim().toUpperCase();
  const grupo = (r[3] || '').toString().trim();
  const horario = (r[4] || '').toString().trim();
  const tutor = (r[5] || '').toString().trim();
  const celularTutor = (r[6] || '').toString().trim();
  const correoTutor = (r[7] || '').toString().trim();
  const apoyo = (r[8] || '').toString().trim();
  const leadTeacher = (r[9] || r[31] || '').toString().trim();
  
  // Directions based on grade
  let direccion = '';
  if (gradoGeneral.includes('CUARTO') || gradoGeneral.includes('4')) direccion = r[10] || r[11] || r[12] || r[13] || '';
  else if (gradoGeneral.includes('QUINTO') || gradoGeneral.includes('5')) direccion = r[11] || r[10] || r[12] || r[13] || '';
  else if (gradoGeneral.includes('NOVENO') || gradoGeneral.includes('9')) direccion = r[12] || r[13] || r[10] || r[11] || '';
  else if (gradoGeneral.includes('DÉCIMO') || gradoGeneral.includes('DECIMO') || gradoGeneral.includes('10')) direccion = r[13] || r[12] || r[10] || r[11] || '';
  else direccion = r[10] || r[11] || r[12] || r[13] || '';
  
  direccion = direccion.toString().replace(/[\r\n]+/g, ' ').trim();

  let localidad = (r[14] || '').toString().trim().toUpperCase();
  if (!localidad) {
    if (direccion.toUpperCase().includes('PLAYA') || direccion.toUpperCase().includes('RIOMAR') || direccion.toUpperCase().includes('51B')) localidad = 'RIOMAR';
    else if (direccion.toUpperCase().includes('SOLEDAD')) localidad = 'SOLEDAD';
    else if (direccion.toUpperCase().includes('PUERTO COLOMBIA')) localidad = 'PUERTO COLOMBIA';
    else localidad = 'NORTE-CENTRO HISTÓRICO';
  }

  // Normalize localidad names
  if (localidad.includes('NORTE') || localidad.includes('CENTRO') || localidad.includes('CH')) localidad = 'NORTE-CENTRO HISTÓRICO';
  else if (localidad.includes('RIO') || localidad.includes('RIOMAR')) localidad = 'RIOMAR';
  else if (localidad.includes('SUR') || localidad.includes('OCCIDENTE')) localidad = 'SUR OCCIDENTE';
  else if (localidad.includes('METRO') || localidad.includes('METROPOLITANA')) localidad = 'METROPOLITANA';
  else if (localidad.includes('SUR') || localidad.includes('ORIENTE')) localidad = 'SUR ORIENTE';
  else if (localidad.includes('SOLEDAD')) localidad = 'SOLEDAD';
  else if (localidad.includes('PUERTO')) localidad = 'PUERTO COLOMBIA';

  const rector = (r[16] || '').toString().trim();
  const celularRector = (r[17] || '').toString().trim();
  const correoRector = (r[18] || '').toString().trim();
  const coordinadorPrimaria = (r[19] || '').toString().trim();
  const celCoordinadorPrimaria = (r[20] || '').toString().trim();
  const docenteAula45 = (r[22] || '').toString().trim();
  const coordinadorEncargado = (r[25] || '').toString().trim();
  const celCoordinadorEncargado = (r[26] || '').toString().trim();
  const correoCoordinadorEncargado = (r[27] || '').toString().trim();
  const docenteDirector910 = (r[28] || '').toString().trim();
  const celDocente910 = (r[29] || '').toString().trim();
  const correoDocente910 = (r[30] || '').toString().trim();

  uniqueSchedules.add(horario);
  uniqueGrades.add(gradoGeneral);
  uniqueLocalities.add(localidad);
  uniqueStrategies.add(estrategia);
  uniqueIEDs.add(ied);

  const parsedSched = parseSchedule(horario);

  parsedRecords.push({
    id: i,
    ied,
    estrategia,
    gradoGeneral,
    grupo,
    horario,
    dias: parsedSched.days,
    horaInicio: parsedSched.startTime,
    horaFin: parsedSched.endTime,
    startHour: parsedSched.startHour,
    endHour: parsedSched.endHour,
    durationMinutes: parsedSched.durationMinutes,
    direccion: direccion || 'Barranquilla',
    localidad,
    tutor: tutor || 'No asignado',
    celularTutor,
    correoTutor,
    apoyo,
    leadTeacher,
    rector,
    celularRector,
    correoRector,
    coordinador: coordinadorEncargado || coordinadorPrimaria || 'Coordinación Académica',
    celularCoordinador: celCoordinadorEncargado || celCoordinadorPrimaria,
    correoCoordinador: correoCoordinadorEncargado,
    docenteTitular: docenteDirector910 || docenteAula45 || 'Docente Titular',
    celularDocente: celDocente910,
    correoDocente: correoDocente910,
    filaExcel: i + 1
  });
}

console.log(`\nTotal Parsed: ${parsedRecords.length}`);
console.log('Unique IEDs:', uniqueIEDs.size);
console.log('Unique Localities:', Array.from(uniqueLocalities));
console.log('Unique Grades:', Array.from(uniqueGrades));
console.log('Unique Strategies:', Array.from(uniqueStrategies));
console.log('Sample Schedule Patterns:', Array.from(uniqueSchedules).slice(0, 15));

if (!fs.existsSync('src')) fs.mkdirSync('src');
if (!fs.existsSync('src/data')) fs.mkdirSync('src/data');
fs.writeFileSync('src/data/ied_database.json', JSON.stringify(parsedRecords, null, 2), 'utf8');
console.log('Successfully saved to src/data/ied_database.json');
