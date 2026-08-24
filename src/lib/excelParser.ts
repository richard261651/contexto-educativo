import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { IEDRecord, DayOfWeek } from '@/types/ied';

export function parseScheduleString(horarioStr: string) {
  if (!horarioStr || typeof horarioStr !== 'string') {
    return {
      raw: '',
      days: ['Lunes' as DayOfWeek],
      startTime: '08:00',
      endTime: '10:00',
      startHour: 8.0,
      endHour: 10.0,
      durationMinutes: 120
    };
  }

  const clean = horarioStr.trim();
  const dayNames: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const days: DayOfWeek[] = [];

  for (const d of dayNames) {
    const unaccented = d.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cleanNorm = clean.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (new RegExp(unaccented, 'i').test(cleanNorm)) {
      if (!days.includes(d)) {
        days.push(d);
      }
    }
  }

  const timeMatch = clean.match(/(\d{1,2})[:\.](\d{2})\s*(?:-|a|al|hasta)\s*(\d{1,2})[:\.](\d{2})/i);
  let startTime = '08:00';
  let endTime = '10:00';
  let startHour = 8.0;
  let endHour = 10.0;

  if (timeMatch) {
    let h1 = parseInt(timeMatch[1], 10);
    let m1 = parseInt(timeMatch[2], 10);
    let h2 = parseInt(timeMatch[3], 10);
    let m2 = parseInt(timeMatch[4], 10);

    const isPM = /pm|p\.m\./i.test(clean);
    if (isPM && h1 < 12) h1 += 12;
    if (isPM && h2 < 12) h2 += 12;

    startTime = `${String(h1).padStart(2, '0')}:${String(m1).padStart(2, '0')}`;
    endTime = `${String(h2).padStart(2, '0')}:${String(m2).padStart(2, '0')}`;
    startHour = h1 + m1 / 60;
    endHour = h2 + m2 / 60;
  }

  const durationMinutes = Math.max(30, Math.round((endHour - startHour) * 60));

  return {
    raw: clean,
    days: days.length > 0 ? days : (['Lunes'] as DayOfWeek[]),
    startTime,
    endTime,
    startHour,
    endHour,
    durationMinutes
  };
}

export async function parseExcelOrCsvFile(file: File): Promise<IEDRecord[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const records = processRawRows(results.data as any[][]);
            resolve(records);
          } catch (err) {
            reject(err);
          }
        },
        error: (err) => reject(err)
      });
    });
  } else {
    // XLSX or XLS
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    return processRawRows(rawRows);
  }
}

function processRawRows(rows: any[][]): IEDRecord[] {
  if (rows.length < 2) {
    throw new Error('El archivo no contiene suficientes filas.');
  }

  const parsedRecords: IEDRecord[] = [];

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

    let direccion = '';
    if (gradoGeneral.includes('CUARTO') || gradoGeneral.includes('4')) direccion = r[10] || r[11] || r[12] || r[13] || '';
    else if (gradoGeneral.includes('QUINTO') || gradoGeneral.includes('5')) direccion = r[11] || r[10] || r[12] || r[13] || '';
    else if (gradoGeneral.includes('NOVENO') || gradoGeneral.includes('9')) direccion = r[12] || r[13] || r[10] || r[11] || '';
    else if (gradoGeneral.includes('DÉCIMO') || gradoGeneral.includes('DECIMO') || gradoGeneral.includes('10')) direccion = r[13] || r[12] || r[10] || r[11] || '';
    else direccion = r[10] || r[11] || r[12] || r[13] || '';

    direccion = direccion.toString().replace(/[\r\n]+/g, ' ').trim();

    let localidad = (r[14] || '').toString().trim().toUpperCase();
    if (!localidad) {
      if (direccion.toUpperCase().includes('PLAYA') || direccion.toUpperCase().includes('RIOMAR')) localidad = 'RIOMAR';
      else if (direccion.toUpperCase().includes('SOLEDAD')) localidad = 'SOLEDAD';
      else if (direccion.toUpperCase().includes('PUERTO')) localidad = 'PUERTO COLOMBIA';
      else localidad = 'NORTE-CENTRO HISTÓRICO';
    }

    if (localidad.includes('NORTE') || localidad.includes('CENTRO') || localidad.includes('CH')) localidad = 'NORTE-CENTRO HISTÓRICO';
    else if (localidad.includes('RIO') || localidad.includes('RIOMAR')) localidad = 'RIOMAR';
    else if (localidad.includes('SUR') && localidad.includes('OCCIDENTE')) localidad = 'SUR OCCIDENTE';
    else if (localidad.includes('METRO')) localidad = 'METROPOLITANA';
    else if (localidad.includes('SUR') && localidad.includes('ORIENTE')) localidad = 'SUR ORIENTE';
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

    const sched = parseScheduleString(horario);

    parsedRecords.push({
      id: i,
      ied,
      estrategia: estrategia || 'AS',
      gradoGeneral: gradoGeneral || 'NOVENO',
      grupo: grupo || '1',
      horario,
      dias: sched.days,
      horaInicio: sched.startTime,
      horaFin: sched.endTime,
      startHour: sched.startHour,
      endHour: sched.endHour,
      durationMinutes: sched.durationMinutes,
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

  return parsedRecords;
}
