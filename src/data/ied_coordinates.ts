import { IEDRecord } from '@/types/ied';

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export const LOCALITY_CENTROIDS: Record<string, GeoCoordinate> = {
  'RIOMAR': { lat: 11.0150, lng: -74.8250 },
  'NORTE-CENTRO HISTÓRICO': { lat: 10.9950, lng: -74.7950 },
  'SUR OCCIDENTE': { lat: 10.9650, lng: -74.8200 },
  'METROPOLITANA': { lat: 10.9450, lng: -74.8050 },
  'SUR ORIENTE': { lat: 10.9500, lng: -74.7750 },
  'SOLEDAD': { lat: 10.9180, lng: -74.7600 },
  'PUERTO COLOMBIA': { lat: 11.0200, lng: -74.8800 }
};

export const NEIGHBORHOOD_COORDINATES: Record<string, GeoCoordinate> = {
  // RIOMAR
  'Altos de Riomar': { lat: 11.0142, lng: -74.8210 },
  'Villa Santos': { lat: 11.0165, lng: -74.8315 },
  'Villa Carolina': { lat: 11.0185, lng: -74.8140 },
  'El Limoncito': { lat: 11.0110, lng: -74.8120 },
  'La Floresta': { lat: 11.0125, lng: -74.8080 },
  'Paraíso': { lat: 11.0080, lng: -74.8050 },
  'San Vicente': { lat: 11.0050, lng: -74.8280 },
  'La Playa (Eduardo Santos)': { lat: 11.0340, lng: -74.8450 },
  'Buenavista': { lat: 11.0150, lng: -74.8290 },
  'Villa Campestre': { lat: 11.0220, lng: -74.8560 },
  'Castillo Salgar': { lat: 11.0250, lng: -74.9100 },

  // NORTE-CENTRO HISTÓRICO
  'El Prado': { lat: 10.9960, lng: -74.7960 },
  'Alto Prado': { lat: 11.0030, lng: -74.8080 },
  'Bellas Artes': { lat: 10.9940, lng: -74.7930 },
  'Boston': { lat: 10.9910, lng: -74.7950 },
  'El Recreo': { lat: 10.9880, lng: -74.8020 },
  'Betania': { lat: 10.9980, lng: -74.8150 },
  'Los Nogales': { lat: 11.0020, lng: -74.8220 },
  'Ciudad Jardín': { lat: 11.0045, lng: -74.8180 },
  'El Golf': { lat: 11.0090, lng: -74.8140 },
  'San Francisco': { lat: 10.9980, lng: -74.7910 },
  'Montecristo': { lat: 10.9900, lng: -74.7840 },
  'Barrio Abajo': { lat: 10.9880, lng: -74.7810 },
  'Centro': { lat: 10.9820, lng: -74.7780 },
  'Chiquinquirá': { lat: 10.9780, lng: -74.7890 },

  // SUR OCCIDENTE
  'La Pradera': { lat: 10.9620, lng: -74.8310 },
  'El Bosque': { lat: 10.9580, lng: -74.8250 },
  'Las Malvinas': { lat: 10.9510, lng: -74.8340 },
  'Los Olivos': { lat: 10.9600, lng: -74.8180 },
  'El Pueblito': { lat: 10.9490, lng: -74.8380 },
  'La Paz': { lat: 10.9550, lng: -74.8290 },
  'Lucero': { lat: 10.9760, lng: -74.7990 },
  'Los Andes': { lat: 10.9790, lng: -74.8080 },
  'Nueva Colombia': { lat: 10.9630, lng: -74.8220 },
  'Silencio': { lat: 10.9820, lng: -74.8120 },
  'San Felipe': { lat: 10.9740, lng: -74.8110 },

  // METROPOLITANA
  'Ciudadela 20 de Julio': { lat: 10.9380, lng: -74.8030 },
  'Las Cayenas': { lat: 10.9320, lng: -74.8090 },
  'Los Girasoles': { lat: 10.9350, lng: -74.8120 },
  '7 de Abril': { lat: 10.9420, lng: -74.8180 },
  'Buenos Aires': { lat: 10.9490, lng: -74.7980 },
  'Carrizal': { lat: 10.9460, lng: -74.8080 },
  'Santo Domingo': { lat: 10.9390, lng: -74.8140 },
  'La Alboraya': { lat: 10.9550, lng: -74.7950 },
  'Santamaría': { lat: 10.9430, lng: -74.8220 },

  // SUR ORIENTE
  'Simón Bolívar': { lat: 10.9520, lng: -74.7720 },
  'La Victoria': { lat: 10.9580, lng: -74.7910 },
  'El Campito': { lat: 10.9620, lng: -74.7860 },
  'Las Nieves': { lat: 10.9610, lng: -74.7780 },
  'Rebolo': { lat: 10.9720, lng: -74.7750 },
  'San Roque': { lat: 10.9780, lng: -74.7790 },
  'La Unión': { lat: 10.9670, lng: -74.7850 },
  'Montes': { lat: 10.9690, lng: -74.7810 },
  'Atlántico': { lat: 10.9680, lng: -74.7920 },

  // SOLEDAD
  'Costa Hermosa': { lat: 10.9290, lng: -74.7680 },
  'Hipódromo': { lat: 10.9190, lng: -74.7620 },
  'Las Moras': { lat: 10.9240, lng: -74.7820 },
  'Los Almendros': { lat: 10.9150, lng: -74.7910 },
  'Villa Sol': { lat: 10.9110, lng: -74.7730 },
  'Soledad 2000': { lat: 10.9080, lng: -74.7860 },
  'Normandía': { lat: 10.9210, lng: -74.7550 },
  'Los Cedros': { lat: 10.9160, lng: -74.7880 },
  'El Parque': { lat: 10.9230, lng: -74.7720 },
  'Villa Muvdi': { lat: 10.9260, lng: -74.7790 },

  // PUERTO COLOMBIA
  'Centro Puerto Colombia': { lat: 11.0210, lng: -74.9540 },
  'Pradomar': { lat: 11.0260, lng: -74.9680 },
  'Sabanilla': { lat: 11.0240, lng: -74.9080 },
  'Salgar': { lat: 11.0220, lng: -74.9180 }
};

export const UNIVERSITY_COORDINATES: Record<string, GeoCoordinate> = {
  'uninorte': { lat: 11.0195, lng: -74.8504 },
  'uniatlantico_norte': { lat: 11.0189, lng: -74.8724 },
  'uniatlantico_centro': { lat: 10.9856, lng: -74.7924 },
  'cuc': { lat: 10.9984, lng: -74.7985 },
  'unisimon': { lat: 10.9965, lng: -74.7995 },
  'uac': { lat: 11.0028, lng: -74.8190 },
  'iub': { lat: 10.9820, lng: -74.7890 },
  'unilibre': { lat: 11.0150, lng: -74.8620 },
  'uniminuto': { lat: 11.0010, lng: -74.8110 }
};

/**
 * Deterministically computes geographic lat/lng coordinates for an IED
 * based on its name hash, locality centroid, and street indicators.
 */
export function getIEDCoordinates(record: { id: number; ied: string; direccion: string; localidad: string }): GeoCoordinate {
  const normLoc = record.localidad?.toUpperCase().trim() || 'NORTE-CENTRO HISTÓRICO';
  const centroid = LOCALITY_CENTROIDS[normLoc] || LOCALITY_CENTROIDS['NORTE-CENTRO HISTÓRICO'];

  // Check specific landmark schools
  const nameUpper = record.ied.toUpperCase();
  const dirUpper = record.direccion.toUpperCase();

  if (nameUpper.includes('PIES DESCALZOS') || dirUpper.includes('LA PLAYA')) {
    return { lat: 11.0345, lng: -74.8452 };
  }
  if (nameUpper.includes('NORMAL SUPERIOR DEL DISTRITO')) {
    return { lat: 10.9892, lng: -74.7928 };
  }
  if (nameUpper.includes('CODEBA') || nameUpper.includes('BARRANQUILLA')) {
    return { lat: 10.9924, lng: -74.7912 };
  }
  if (nameUpper.includes('MARCO FIDEL SUAREZ')) {
    return { lat: 10.9765, lng: -74.8015 };
  }
  if (nameUpper.includes('HUMBOLDT')) {
    return { lat: 10.9980, lng: -74.8140 };
  }
  if (nameUpper.includes('JORGE NICOLAS ABELLO')) {
    return { lat: 10.9790, lng: -74.7880 };
  }
  if (nameUpper.includes('BETANIA NORTE')) {
    return { lat: 11.0035, lng: -74.8170 };
  }
  if (nameUpper.includes('CIUDADELA 20 DE JULIO')) {
    return { lat: 10.9385, lng: -74.8032 };
  }
  if (nameUpper.includes('EL SILENCIO')) {
    return { lat: 10.9825, lng: -74.8125 };
  }
  if (nameUpper.includes('LA SALLE')) {
    return { lat: 11.0085, lng: -74.8190 };
  }
  if (nameUpper.includes('MARIA AUXILIADORA')) {
    return { lat: 10.9840, lng: -74.7820 };
  }
  if (nameUpper.includes('SOLEDAD') || dirUpper.includes('SOLEDAD')) {
    return { lat: 10.9190 + ((record.id * 17) % 20 - 10) * 0.0008, lng: -74.7680 + ((record.id * 31) % 20 - 10) * 0.0008 };
  }

  // Generate deterministic jitter within the locality boundary (~1.5 km spread)
  const hash1 = (record.id * 9301 + 49297) % 233280;
  const hash2 = (record.id * 49297 + 9301) % 233280;

  const latOffset = ((hash1 / 233280) - 0.5) * 0.022; // ~1.2 km spread
  const lngOffset = ((hash2 / 233280) - 0.5) * 0.022;

  return {
    lat: parseFloat((centroid.lat + latOffset).toFixed(6)),
    lng: parseFloat((centroid.lng + lngOffset).toFixed(6))
  };
}
