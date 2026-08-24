import { create } from 'zustand';
import { 
  UserProfile, 
  ScheduleBlock, 
  IEDRecord, 
  FilterState, 
  TimeSlotAnalysis, 
  MatchResult,
  DayOfWeek 
} from '@/types/ied';
import defaultRecords from '@/data/ied_database.json';
import { analyzeUserAvailability, evaluateIEDMatch } from '@/lib/matchingAlgorithm';

interface PracticeStore {
  currentStep: number;
  userProfile: UserProfile;
  scheduleBlocks: ScheduleBlock[];
  allRecords: IEDRecord[];
  selectedRecord: IEDRecord | null;
  comparedRecords: IEDRecord[];
  filters: FilterState;
  analysis: TimeSlotAnalysis;
  matchedResults: MatchResult[];

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addScheduleBlock: (block: Omit<ScheduleBlock, 'id'>) => void;
  removeScheduleBlock: (id: string) => void;
  clearSchedule: () => void;
  loadTemplate: (templateName: string) => void;
  setAllRecords: (records: IEDRecord[]) => void;
  selectRecord: (record: IEDRecord | null) => void;
  toggleCompareRecord: (record: IEDRecord) => void;
  clearComparedRecords: () => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  recalculateMatches: () => void;
}

const initialProfile: UserProfile = {
  fullName: 'Carlos Mendoza',
  studentCode: '200145892',
  email: 'cmendoza@uninorte.edu.co',
  phone: '3015551234',
  university: 'uninorte',
  program: 'Licenciatura en Educación / Pedagogía',
  semester: '7° Semestre',
  residenceLocality: 'RIOMAR',
  residenceNeighborhood: 'Villa Santos',
  residenceAddress: 'Cra 51B # 106 - 45',
  hasExtraWork: false,
  extraWorkName: '',
  extraWorkLocality: '',
  transportMode: 'transmetro',
  maxTravelTime: 45,
  preferredGrades: ['NOVENO', 'DÉCIMO']
};

const initialFilters: FilterState = {
  searchQuery: '',
  localities: [],
  grades: [],
  days: [],
  strategies: [],
  matchCategories: [],
  showOnlyNoConflicts: true,
  maxTravelTime: 60,
  sortBy: 'score',
  sortOrder: 'desc'
};

const defaultBlocks: ScheduleBlock[] = [
  { id: '1', day: 'Lunes', startHour: 8.0, endHour: 11.0, title: 'Didáctica General', type: 'academic' },
  { id: '2', day: 'Lunes', startHour: 11.5, endHour: 13.0, title: 'Evaluación Curricular', type: 'academic' },
  { id: '3', day: 'Martes', startHour: 7.0, endHour: 10.0, title: 'Pedagogía Infantil', type: 'academic' },
  { id: '4', day: 'Miércoles', startHour: 8.0, endHour: 11.0, title: 'Didáctica General', type: 'academic' },
  { id: '5', day: 'Jueves', startHour: 7.0, endHour: 10.0, title: 'Historia de la Educación', type: 'academic' },
  { id: '6', day: 'Viernes', startHour: 9.0, endHour: 12.0, title: 'Seminario de Investigación', type: 'academic' }
];

export const usePracticeStore = create<PracticeStore>((set, get) => {
  const initialAnalysis = analyzeUserAvailability(defaultBlocks);
  const initialMatches = (defaultRecords as IEDRecord[]).map(r => 
    evaluateIEDMatch(r, initialProfile, defaultBlocks, initialAnalysis)
  );

  return {
    currentStep: 1,
    userProfile: initialProfile,
    scheduleBlocks: defaultBlocks,
    allRecords: defaultRecords as IEDRecord[],
    selectedRecord: null,
    comparedRecords: [],
    filters: initialFilters,
    analysis: initialAnalysis,
    matchedResults: initialMatches,

    setStep: (step) => set({ currentStep: Math.min(4, Math.max(1, step)) }),
    nextStep: () => {
      const next = Math.min(4, get().currentStep + 1);
      get().recalculateMatches();
      set({ currentStep: next });
    },
    prevStep: () => set({ currentStep: Math.max(1, get().currentStep - 1) }),

    updateProfile: (profilePartial) => {
      set((state) => {
        const updated = { ...state.userProfile, ...profilePartial };
        return { userProfile: updated };
      });
      get().recalculateMatches();
    },

    addScheduleBlock: (blockData) => {
      const newBlock: ScheduleBlock = {
        ...blockData,
        id: Math.random().toString(36).substring(2, 9)
      };
      set((state) => ({
        scheduleBlocks: [...state.scheduleBlocks, newBlock]
      }));
      get().recalculateMatches();
    },

    removeScheduleBlock: (id) => {
      set((state) => ({
        scheduleBlocks: state.scheduleBlocks.filter(b => b.id !== id)
      }));
      get().recalculateMatches();
    },

    clearSchedule: () => {
      set({ scheduleBlocks: [] });
      get().recalculateMatches();
    },

    loadTemplate: (templateName) => {
      let newBlocks: ScheduleBlock[] = [];
      if (templateName === 'morning_heavy') {
        newBlocks = [
          { id: '1', day: 'Lunes', startHour: 7.0, endHour: 12.0, title: 'Bloque Académico Mañana', type: 'academic' },
          { id: '2', day: 'Martes', startHour: 7.0, endHour: 12.0, title: 'Bloque Académico Mañana', type: 'academic' },
          { id: '3', day: 'Miércoles', startHour: 7.0, endHour: 12.0, title: 'Bloque Académico Mañana', type: 'academic' },
          { id: '4', day: 'Jueves', startHour: 7.0, endHour: 12.0, title: 'Bloque Académico Mañana', type: 'academic' },
          { id: '5', day: 'Viernes', startHour: 7.0, endHour: 12.0, title: 'Bloque Académico Mañana', type: 'academic' }
        ];
      } else if (templateName === 'afternoon_heavy') {
        newBlocks = [
          { id: '1', day: 'Lunes', startHour: 14.0, endHour: 18.0, title: 'Clases Tarde', type: 'academic' },
          { id: '2', day: 'Martes', startHour: 14.0, endHour: 18.0, title: 'Clases Tarde', type: 'academic' },
          { id: '3', day: 'Miércoles', startHour: 14.0, endHour: 18.0, title: 'Clases Tarde', type: 'academic' },
          { id: '4', day: 'Jueves', startHour: 14.0, endHour: 18.0, title: 'Clases Tarde', type: 'academic' }
        ];
      } else if (templateName === 'intermittent_gaps') {
        newBlocks = [
          { id: '1', day: 'Lunes', startHour: 7.0, endHour: 9.0, title: 'Clase Temprana', type: 'academic' },
          { id: '2', day: 'Lunes', startHour: 15.0, endHour: 18.0, title: 'Clase Tarde', type: 'academic' },
          { id: '3', day: 'Miércoles', startHour: 7.0, endHour: 9.0, title: 'Clase Temprana', type: 'academic' },
          { id: '4', day: 'Miércoles', startHour: 15.0, endHour: 18.0, title: 'Clase Tarde', type: 'academic' },
          { id: '5', day: 'Viernes', startHour: 8.0, endHour: 11.0, title: 'Cátedra Libre', type: 'academic' }
        ];
      } else if (templateName === 'saturdays_free') {
        newBlocks = [
          { id: '1', day: 'Lunes', startHour: 8.0, endHour: 14.0, title: 'Jornada Continua', type: 'academic' },
          { id: '2', day: 'Martes', startHour: 8.0, endHour: 14.0, title: 'Jornada Continua', type: 'academic' },
          { id: '3', day: 'Miércoles', startHour: 8.0, endHour: 14.0, title: 'Jornada Continua', type: 'academic' },
          { id: '4', day: 'Jueves', startHour: 8.0, endHour: 14.0, title: 'Jornada Continua', type: 'academic' },
          { id: '5', day: 'Viernes', startHour: 8.0, endHour: 14.0, title: 'Jornada Continua', type: 'academic' }
        ];
      }
      set({ scheduleBlocks: newBlocks });
      get().recalculateMatches();
    },

    setAllRecords: (records) => {
      set({ allRecords: records });
      get().recalculateMatches();
    },

    selectRecord: (record) => set({ selectedRecord: record }),

    toggleCompareRecord: (record) => {
      set((state) => {
        const exists = state.comparedRecords.some(r => r.id === record.id);
        if (exists) {
          return { comparedRecords: state.comparedRecords.filter(r => r.id !== record.id) };
        }
        if (state.comparedRecords.length >= 3) {
          return { comparedRecords: [...state.comparedRecords.slice(1), record] };
        }
        return { comparedRecords: [...state.comparedRecords, record] };
      });
    },

    clearComparedRecords: () => set({ comparedRecords: [] }),

    setFilters: (filterPartial) => set((state) => ({
      filters: { ...state.filters, ...filterPartial }
    })),

    resetFilters: () => set({ filters: initialFilters }),

    recalculateMatches: () => {
      const state = get();
      const analysis = analyzeUserAvailability(state.scheduleBlocks);
      const matches = state.allRecords.map(r => 
        evaluateIEDMatch(r, state.userProfile, state.scheduleBlocks, analysis)
      );
      set({ analysis, matchedResults: matches });
    }
  };
});
