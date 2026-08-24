import { 
  DayOfWeek, 
  IEDRecord, 
  UserProfile, 
  ScheduleBlock, 
  TimeSlotAnalysis, 
  MatchResult, 
  MatchCategory 
} from '@/types/ied';
import { 
  TRAVEL_TIME_MATRIX_MINUTES, 
  TRANSPORT_MULTIPLIERS, 
  DISTANCE_MATRIX_KM, 
  UNIVERSITIES 
} from '@/data/barranquilla_geo';

const DAYS_OF_WEEK: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

/**
 * Computes availability metrics from user schedule blocks
 */
export function analyzeUserAvailability(blocks: ScheduleBlock[]): TimeSlotAnalysis {
  const freeDays: DayOfWeek[] = [];
  const freeAfternoons: { day: DayOfWeek; startHour: number; duration: number }[] = [];
  const freeMornings: { day: DayOfWeek; endHour: number; duration: number }[] = [];
  const optimalGaps: { day: DayOfWeek; startHour: number; endHour: number; duration: number }[] = [];

  let totalBusyHours = 0;

  for (const day of DAYS_OF_WEEK) {
    const dayBlocks = blocks
      .filter(b => b.day === day)
      .sort((a, b) => a.startHour - b.startHour);

    const dayBusy = dayBlocks.reduce((acc, b) => acc + (b.endHour - b.startHour), 0);
    totalBusyHours += dayBusy;

    // 1. Días 100% libres
    if (dayBlocks.length === 0) {
      freeDays.push(day);
      freeMornings.push({ day, endHour: 12.0, duration: 6.0 });
      freeAfternoons.push({ day, startHour: 12.0, duration: 8.0 });
      continue;
    }

    // 2. Mañanas libres (6:00 a 12:00)
    const firstBlock = dayBlocks[0];
    if (firstBlock.startHour >= 9.5) {
      // Free from 6:00 to firstBlock.startHour (at least 3.5h)
      freeMornings.push({
        day,
        endHour: firstBlock.startHour,
        duration: firstBlock.startHour - 6.0
      });
    }

    // 3. Tardes libres (12:00 a 20:00)
    const lastBlock = dayBlocks[dayBlocks.length - 1];
    if (lastBlock.endHour <= 14.0) {
      // Free from lastBlock.endHour to 20:00 (at least 6h)
      freeAfternoons.push({
        day,
        startHour: Math.max(12.0, lastBlock.endHour),
        duration: 20.0 - Math.max(12.0, lastBlock.endHour)
      });
    }

    // 4. Huecos entre clases (> 2.5 horas)
    for (let i = 0; i < dayBlocks.length - 1; i++) {
      const current = dayBlocks[i];
      const next = dayBlocks[i + 1];
      const gapDuration = next.startHour - current.endHour;

      if (gapDuration >= 2.5) {
        optimalGaps.push({
          day,
          startHour: current.endHour,
          endHour: next.startHour,
          duration: gapDuration
        });
      }
    }
  }

  const totalPossibleHours = 6 * 14; // 6 days * 14 hours (6am to 8pm) = 84h
  const totalFreeHours = Math.max(0, totalPossibleHours - totalBusyHours);

  return {
    freeDays,
    freeAfternoons,
    freeMornings,
    optimalGaps,
    totalBusyHours,
    totalFreeHours
  };
}

/**
 * Calculates estimated travel time in minutes between two localities
 */
export function estimateTravelTime(
  fromLocality: string, 
  toLocality: string, 
  mode: UserProfile['transportMode'] = 'transmetro',
  targetHour: number = 13.0
): number {
  const normFrom = fromLocality?.toUpperCase().trim() || 'NORTE-CENTRO HISTÓRICO';
  const normTo = toLocality?.toUpperCase().trim() || 'NORTE-CENTRO HISTÓRICO';

  const baseMinutes = TRAVEL_TIME_MATRIX_MINUTES[normFrom]?.[normTo] ?? 25;
  const modeMultiplier = TRANSPORT_MULTIPLIERS[mode] ?? 1.0;

  // Peak hours in Barranquilla: 6:30-8:30, 11:45-13:45, 17:00-19:00
  const isRushHour = 
    (targetHour >= 6.5 && targetHour <= 8.5) ||
    (targetHour >= 11.75 && targetHour <= 13.75) ||
    (targetHour >= 17.0 && targetHour <= 19.0);

  const trafficMultiplier = isRushHour ? 1.3 : 1.0;

  return Math.round(baseMinutes * modeMultiplier * trafficMultiplier);
}

/**
 * Calculates distance in KM
 */
export function estimateDistanceKm(fromLocality: string, toLocality: string): number {
  const normFrom = fromLocality?.toUpperCase().trim() || 'NORTE-CENTRO HISTÓRICO';
  const normTo = toLocality?.toUpperCase().trim() || 'NORTE-CENTRO HISTÓRICO';
  return DISTANCE_MATRIX_KM[normFrom]?.[normTo] ?? 8;
}

/**
 * Core matching evaluation for an IED Record against User Profile and Schedule
 */
export function evaluateIEDMatch(
  record: IEDRecord,
  userProfile: UserProfile,
  blocks: ScheduleBlock[],
  analysis: TimeSlotAnalysis
): MatchResult {
  const reasons: string[] = [];
  let isConflict = false;
  let conflictReason = '';

  const uniObj = UNIVERSITIES.find(u => u.id === userProfile.university || u.name === userProfile.university);
  const uniLocality = uniObj?.locality || 'RIOMAR';
  const homeLocality = userProfile.residenceLocality || 'NORTE-CENTRO HISTÓRICO';

  // 1. Calculate Travel Times
  const travelFromHome = estimateTravelTime(homeLocality, record.localidad, userProfile.transportMode, record.startHour);
  const travelFromUni = estimateTravelTime(uniLocality, record.localidad, userProfile.transportMode, record.startHour);
  const minTravelTime = Math.min(travelFromHome, travelFromUni);
  const distanceKm = Math.min(
    estimateDistanceKm(homeLocality, record.localidad),
    estimateDistanceKm(uniLocality, record.localidad)
  );

  // 2. Check Time Overlaps with User Schedule
  for (const day of record.dias) {
    const dayBlocks = blocks.filter(b => b.day === day);
    for (const block of dayBlocks) {
      // Overlap condition: start < block.end && end > block.start
      const hasOverlap = (record.startHour < block.endHour) && (record.endHour > block.startHour);
      if (hasOverlap) {
        isConflict = true;
        conflictReason = `Se cruza el ${day} con tu bloque "${block.title}" (${formatHour(block.startHour)} - ${formatHour(block.endHour)})`;
        break;
      }

      // Check tight buffer (less than required travel time)
      if (block.endHour <= record.startHour) {
        const gapBefore = (record.startHour - block.endHour) * 60; // minutes
        if (gapBefore < minTravelTime * 0.8) {
          isConflict = true;
          conflictReason = `Margen de llegada muy ajustado el ${day}: solo tienes ${Math.round(gapBefore)} min para desplazarte (se requieren ~${minTravelTime} min)`;
          break;
        }
      }

      if (block.startHour >= record.endHour) {
        const gapAfter = (block.startHour - record.endHour) * 60; // minutes
        if (gapAfter < minTravelTime * 0.8) {
          isConflict = true;
          conflictReason = `Margen de salida muy ajustado el ${day}: solo tienes ${Math.round(gapAfter)} min para llegar a tu siguiente clase (se requieren ~${minTravelTime} min)`;
          break;
        }
      }
    }
    if (isConflict) break;
  }

  // Handle Conflicted Option
  if (isConflict) {
    return {
      record,
      score: Math.max(10, 35 - minTravelTime * 0.3),
      category: 'conflict',
      badgeLabel: 'Conflicto de Horario',
      badgeColor: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
      reasons: [conflictReason],
      travelTimeMinutes: minTravelTime,
      distanceKm,
      isConflict: true,
      conflictReason
    };
  }

  // 3. Evaluate Match Category & Compatibility
  let category: MatchCategory = 'perfect';
  let badgeLabel = 'Match Perfecto';
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  let score = 70; // Base score for no conflicts

  const isWeekendSlot = record.dias.includes('Sábado');
  const isWeekendFree = analysis.freeDays.includes('Sábado');
  const isAllDaysFree = record.dias.every(d => analysis.freeDays.includes(d));
  const isAfternoonSlot = record.startHour >= 12.0;

  // Check if fits in optimal gap
  const fitsInGap = record.dias.some(d => 
    analysis.optimalGaps.some(g => g.day === d && record.startHour >= g.startHour && record.endHour <= g.endHour)
  );

  // Check locality proximity
  const isSameLocalityHome = record.localidad.toUpperCase() === homeLocality.toUpperCase();
  const isSameLocalityUni = record.localidad.toUpperCase() === uniLocality.toUpperCase();
  const isNear = isSameLocalityHome || isSameLocalityUni || minTravelTime <= 25;

  if (isWeekendSlot && isWeekendFree) {
    category = 'weekend';
    badgeLabel = 'Sábado 100% Libre';
    badgeColor = 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
    score += 25;
    reasons.push('Aprovechas tu fin de semana sin interferir con clases académicas');
  } else if (isAllDaysFree) {
    category = 'perfect';
    badgeLabel = 'Día 100% Libre';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    score += 22;
    reasons.push(`Tienes el día ${record.dias.join(', ')} completamente despejado`);
  } else if (fitsInGap) {
    category = 'gap';
    badgeLabel = 'Hueco Óptimo (>2.5h)';
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    score += 18;
    reasons.push(`Encaja perfectamente en tu ventana libre entre clases (${record.dias.join(', ')})`);
  } else if (isAfternoonSlot) {
    category = 'afternoon';
    badgeLabel = 'Tarde Libre';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    score += 15;
    reasons.push(`Bloque de tarde disponible después de tu jornada (${record.horaInicio} - ${record.horaFin})`);
  }

  // Locality bonuses & travel warnings
  if (isSameLocalityHome) {
    score += 12;
    reasons.push(`Excelente cercanía: misma localidad de tu residencia (${record.localidad})`);
  } else if (isSameLocalityUni) {
    score += 10;
    reasons.push(`Cerca de tu campus universitario (${uniObj?.shortName || 'Universidad'})`);
  } else if (minTravelTime > 45 || (homeLocality === 'SOLEDAD' && record.localidad === 'PUERTO COLOMBIA')) {
    category = 'warning';
    badgeLabel = 'Desplazamiento Extenso';
    badgeColor = 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800';
    score -= 15;
    reasons.push(`Trayecto largo estimado en ~${minTravelTime} min (${distanceKm} km). Planifica tu ruta con anticipación.`);
  }

  // Grade preference bonus
  if (userProfile.preferredGrades && userProfile.preferredGrades.length > 0) {
    if (userProfile.preferredGrades.includes(record.gradoGeneral)) {
      score += 8;
      reasons.push(`Coincide con tu grado de preferencia (${record.gradoGeneral})`);
    }
  }

  // Normalize score between 0 and 99
  const finalScore = Math.min(99, Math.max(30, Math.round(score)));

  return {
    record,
    score: finalScore,
    category,
    badgeLabel,
    badgeColor,
    reasons,
    travelTimeMinutes: minTravelTime,
    distanceKm,
    isConflict: false
  };
}

export function formatHour(hourDec: number): string {
  const h = Math.floor(hourDec);
  const m = Math.round((hourDec - h) * 60);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${m < 10 ? '0' : ''}${m} ${period}`;
}
