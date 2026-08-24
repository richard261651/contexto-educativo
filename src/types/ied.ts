export type DayOfWeek = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';

export interface IEDRecord {
  id: number;
  ied: string;
  estrategia: string;
  gradoGeneral: 'CUARTO' | 'QUINTO' | 'NOVENO' | 'DÉCIMO' | string;
  grupo: string;
  horario: string;
  dias: DayOfWeek[];
  horaInicio: string;
  horaFin: string;
  startHour: number;
  endHour: number;
  durationMinutes: number;
  direccion: string;
  localidad: string;
  tutor: string;
  celularTutor?: string;
  correoTutor?: string;
  apoyo?: string;
  leadTeacher?: string;
  rector?: string;
  celularRector?: string;
  correoRector?: string;
  coordinador?: string;
  celularCoordinador?: string;
  correoCoordinador?: string;
  docenteTitular?: string;
  celularDocente?: string;
  correoDocente?: string;
  filaExcel: number;
}

export type TransportMode = 'transmetro' | 'bus' | 'car' | 'motorcycle' | 'bike' | 'walk';

export interface UserProfile {
  fullName: string;
  studentCode: string;
  email: string;
  phone: string;
  university: string;
  program: string;
  semester: string;
  residenceLocality: string;
  residenceNeighborhood: string;
  residenceAddress: string;
  hasExtraWork: boolean;
  extraWorkName: string;
  extraWorkLocality: string;
  transportMode: TransportMode;
  maxTravelTime: number; // in minutes
  preferredGrades: string[];
}

export interface ScheduleBlock {
  id: string;
  day: DayOfWeek;
  startHour: number; // e.g. 6.5 = 6:30 AM
  endHour: number;   // e.g. 8.0 = 8:00 AM
  title: string;
  type: 'academic' | 'work' | 'personal';
  location?: string;
}

export interface TimeSlotAnalysis {
  freeDays: DayOfWeek[];
  freeAfternoons: { day: DayOfWeek; startHour: number; duration: number }[];
  freeMornings: { day: DayOfWeek; endHour: number; duration: number }[];
  optimalGaps: { day: DayOfWeek; startHour: number; endHour: number; duration: number }[];
  totalBusyHours: number;
  totalFreeHours: number;
}

export type MatchCategory = 
  | 'perfect'          // Match Perfecto (Cerca de casa o universidad y horario ideal)
  | 'afternoon'        // Tarde Libre
  | 'gap'              // Hueco Óptimo (> 2.5h entre clases)
  | 'weekend'          // Sábado Libre
  | 'warning'          // Advertencia de desplazamiento ajustado / tráfico
  | 'conflict';        // Conflicto de horario

export interface MatchResult {
  record: IEDRecord;
  score: number; // 0 to 100
  category: MatchCategory;
  badgeLabel: string;
  badgeColor: string;
  reasons: string[];
  travelTimeMinutes: number;
  distanceKm: number;
  isConflict: boolean;
  conflictReason?: string;
}

export interface FilterState {
  searchQuery: string;
  localities: string[];
  grades: string[];
  days: DayOfWeek[];
  strategies: string[];
  matchCategories: MatchCategory[];
  showOnlyNoConflicts: boolean;
  maxTravelTime: number;
  sortBy: 'score' | 'ied' | 'travelTime' | 'grade';
  sortOrder: 'asc' | 'desc';
}
