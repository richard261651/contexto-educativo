export interface UniversityInfo {
  id: string;
  name: string;
  shortName: string;
  locality: string;
  address: string;
  color: string;
}

export const UNIVERSITIES: UniversityInfo[] = [
  {
    id: 'uninorte',
    name: 'Universidad del Norte',
    shortName: 'Uninorte',
    locality: 'RIOMAR',
    address: 'Km 5 Vía Puerto Colombia',
    color: '#dc2626'
  },
  {
    id: 'uniatlantico_norte',
    name: 'Universidad del Atlántico (Sede Norte)',
    shortName: 'Uniatlántico Norte',
    locality: 'PUERTO COLOMBIA',
    address: 'Km 7 Vía Puerto Colombia',
    color: '#16a34a'
  },
  {
    id: 'uniatlantico_centro',
    name: 'Universidad del Atlántico (Sede Centro / Bellas Artes)',
    shortName: 'Uniatlántico Centro',
    locality: 'NORTE-CENTRO HISTÓRICO',
    address: 'Carrera 43 # 50 - 53',
    color: '#15803d'
  },
  {
    id: 'cuc',
    name: 'Universidad de la Costa (CUC)',
    shortName: 'CUC',
    locality: 'NORTE-CENTRO HISTÓRICO',
    address: 'Calle 58 # 55 - 66',
    color: '#2563eb'
  },
  {
    id: 'unisimon',
    name: 'Universidad Simón Bolívar',
    shortName: 'Unisimón',
    locality: 'NORTE-CENTRO HISTÓRICO',
    address: 'Carrera 59 # 59 - 65',
    color: '#d97706'
  },
  {
    id: 'uac',
    name: 'Universidad Autónoma del Caribe',
    shortName: 'Uniautónoma',
    locality: 'NORTE-CENTRO HISTÓRICO',
    address: 'Calle 90 # 46 - 112',
    color: '#9333ea'
  },
  {
    id: 'iub',
    name: 'Institución Universitaria de Barranquilla (IUB)',
    shortName: 'IUB (ITSA)',
    locality: 'NORTE-CENTRO HISTÓRICO',
    address: 'Carrera 45 # 48 - 31 / Soledad',
    color: '#0891b2'
  },
  {
    id: 'unilibre',
    name: 'Universidad Libre Seccional Barranquilla',
    shortName: 'Unilibre',
    locality: 'NORTE-CENTRO HISTÓRICO',
    address: 'Km 7 Vía Antigua Puerto Colombia / Sede Centro',
    color: '#b91c1c'
  },
  {
    id: 'uniminuto',
    name: 'Corporación Universitaria Minuto de Dios',
    shortName: 'Uniminuto',
    locality: 'NORTE-CENTRO HISTÓRICO',
    address: 'Carrera 53 # 74 - 86',
    color: '#0284c7'
  }
];

export const LOCALITIES = [
  'RIOMAR',
  'NORTE-CENTRO HISTÓRICO',
  'SUR OCCIDENTE',
  'METROPOLITANA',
  'SUR ORIENTE',
  'SOLEDAD',
  'PUERTO COLOMBIA'
];

export const NEIGHBORHOODS_BY_LOCALITY: Record<string, string[]> = {
  'RIOMAR': [
    'Altos de Riomar', 'Villa Santos', 'Villa Carolina', 'El Limoncito', 
    'La Floresta', 'Paraíso', 'San Vicente', 'La Playa (Eduardo Santos)', 
    'Buenavista', 'Villa Campestre', 'Castillo Salgar'
  ],
  'NORTE-CENTRO HISTÓRICO': [
    'El Prado', 'Alto Prado', 'Bellas Artes', 'Boston', 'El Recreo', 
    'Betania', 'Los Nogales', 'Ciudad Jardín', 'El Golf', 'San Francisco', 
    'Montecristo', 'Barrio Abajo', 'Centro', 'Chiquinquirá'
  ],
  'SUR OCCIDENTE': [
    'La Pradera', 'El Bosque', 'Las Malvinas', 'Los Olivos', 'El Pueblito', 
    'La Paz', 'Lucero', 'Los Andes', 'Nueva Colombia', 'Silencio', 'San Felipe'
  ],
  'METROPOLITANA': [
    'Ciudadela 20 de Julio', 'Las Cayenas', 'Los Girasoles', '7 de Abril', 
    'Buenos Aires', 'Carrizal', 'Santo Domingo', 'La Alboraya', 'Santamaría'
  ],
  'SUR ORIENTE': [
    'Simón Bolívar', 'La Victoria', 'El Campito', 'Las Nieves', 'Rebolo', 
    'San Roque', 'La Unión', 'Montes', 'Atlántico'
  ],
  'SOLEDAD': [
    'Costa Hermosa', 'Hipódromo', 'Las Moras', 'Los Almendros', 'Villa Sol', 
    'Soledad 2000', 'Normandía', 'Los Cedros', 'El Parque', 'Villa Muvdi'
  ],
  'PUERTO COLOMBIA': [
    'Centro Puerto Colombia', 'Pradomar', 'Sabanilla', 'Salgar', 'Villa Campestre'
  ]
};

// Base transit duration in minutes between zones (average car/bus transit)
export const TRAVEL_TIME_MATRIX_MINUTES: Record<string, Record<string, number>> = {
  'RIOMAR': {
    'RIOMAR': 10,
    'NORTE-CENTRO HISTÓRICO': 20,
    'SUR OCCIDENTE': 35,
    'METROPOLITANA': 45,
    'SUR ORIENTE': 45,
    'SOLEDAD': 55,
    'PUERTO COLOMBIA': 15
  },
  'NORTE-CENTRO HISTÓRICO': {
    'RIOMAR': 20,
    'NORTE-CENTRO HISTÓRICO': 12,
    'SUR OCCIDENTE': 25,
    'METROPOLITANA': 30,
    'SUR ORIENTE': 25,
    'SOLEDAD': 40,
    'PUERTO COLOMBIA': 30
  },
  'SUR OCCIDENTE': {
    'RIOMAR': 35,
    'NORTE-CENTRO HISTÓRICO': 25,
    'SUR OCCIDENTE': 15,
    'METROPOLITANA': 20,
    'SUR ORIENTE': 30,
    'SOLEDAD': 35,
    'PUERTO COLOMBIA': 45
  },
  'METROPOLITANA': {
    'RIOMAR': 45,
    'NORTE-CENTRO HISTÓRICO': 30,
    'SUR OCCIDENTE': 20,
    'METROPOLITANA': 15,
    'SUR ORIENTE': 20,
    'SOLEDAD': 25,
    'PUERTO COLOMBIA': 55
  },
  'SUR ORIENTE': {
    'RIOMAR': 45,
    'NORTE-CENTRO HISTÓRICO': 25,
    'SUR OCCIDENTE': 30,
    'METROPOLITANA': 20,
    'SUR ORIENTE': 15,
    'SOLEDAD': 20,
    'PUERTO COLOMBIA': 55
  },
  'SOLEDAD': {
    'RIOMAR': 55,
    'NORTE-CENTRO HISTÓRICO': 40,
    'SUR OCCIDENTE': 35,
    'METROPOLITANA': 25,
    'SUR ORIENTE': 20,
    'SOLEDAD': 15,
    'PUERTO COLOMBIA': 65
  },
  'PUERTO COLOMBIA': {
    'RIOMAR': 15,
    'NORTE-CENTRO HISTÓRICO': 30,
    'SUR OCCIDENTE': 45,
    'METROPOLITANA': 55,
    'SUR ORIENTE': 55,
    'SOLEDAD': 65,
    'PUERTO COLOMBIA': 12
  }
};

// Transport mode multipliers
export const TRANSPORT_MULTIPLIERS: Record<string, number> = {
  car: 0.8,
  motorcycle: 0.7,
  transmetro: 1.0,
  bus: 1.2,
  bike: 1.4,
  walk: 3.5
};

export const DISTANCE_MATRIX_KM: Record<string, Record<string, number>> = {
  'RIOMAR': { 'RIOMAR': 3, 'NORTE-CENTRO HISTÓRICO': 7, 'SUR OCCIDENTE': 14, 'METROPOLITANA': 16, 'SUR ORIENTE': 17, 'SOLEDAD': 22, 'PUERTO COLOMBIA': 6 },
  'NORTE-CENTRO HISTÓRICO': { 'RIOMAR': 7, 'NORTE-CENTRO HISTÓRICO': 4, 'SUR OCCIDENTE': 9, 'METROPOLITANA': 11, 'SUR ORIENTE': 8, 'SOLEDAD': 15, 'PUERTO COLOMBIA': 14 },
  'SUR OCCIDENTE': { 'RIOMAR': 14, 'NORTE-CENTRO HISTÓRICO': 9, 'SUR OCCIDENTE': 4, 'METROPOLITANA': 7, 'SUR ORIENTE': 10, 'SOLEDAD': 12, 'PUERTO COLOMBIA': 19 },
  'METROPOLITANA': { 'RIOMAR': 16, 'NORTE-CENTRO HISTÓRICO': 11, 'SUR OCCIDENTE': 7, 'METROPOLITANA': 4, 'SUR ORIENTE': 6, 'SOLEDAD': 8, 'PUERTO COLOMBIA': 23 },
  'SUR ORIENTE': { 'RIOMAR': 17, 'NORTE-CENTRO HISTÓRICO': 8, 'SUR OCCIDENTE': 10, 'METROPOLITANA': 6, 'SUR ORIENTE': 4, 'SOLEDAD': 7, 'PUERTO COLOMBIA': 24 },
  'SOLEDAD': { 'RIOMAR': 22, 'NORTE-CENTRO HISTÓRICO': 15, 'SUR OCCIDENTE': 12, 'METROPOLITANA': 8, 'SUR ORIENTE': 7, 'SOLEDAD': 5, 'PUERTO COLOMBIA': 28 },
  'PUERTO COLOMBIA': { 'RIOMAR': 6, 'NORTE-CENTRO HISTÓRICO': 14, 'SUR OCCIDENTE': 19, 'METROPOLITANA': 23, 'SUR ORIENTE': 24, 'SOLEDAD': 28, 'PUERTO COLOMBIA': 4 }
};
