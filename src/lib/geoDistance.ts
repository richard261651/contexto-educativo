import { GeoCoordinate, UNIVERSITY_COORDINATES, NEIGHBORHOOD_COORDINATES, LOCALITY_CENTROIDS } from '@/data/ied_coordinates';
import { UserProfile, TransportMode } from '@/types/ied';

/**
 * Calculates geodesic (great-circle) and estimated road distance in km
 */
export function calculateHaversineDistanceKm(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): { crowKm: number; roadKm: number } {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const crowKm = parseFloat((R * c).toFixed(2));
  
  // In Barranquilla's urban layout, road routes are ~1.28x to 1.35x crow-fly distance
  const roadKm = parseFloat((crowKm * 1.30).toFixed(2));

  return { crowKm, roadKm };
}

/**
 * Calculates travel duration in minutes based on real distance and transport mode
 */
export function calculateRealTravelTimeMinutes(
  roadDistanceKm: number,
  mode: TransportMode = 'transmetro',
  isRushHour: boolean = false
): number {
  if (roadDistanceKm <= 0.2) return 5;

  let speedKmH = 22; // default
  let fixedWaitMinutes = 0;

  switch (mode) {
    case 'car':
      speedKmH = isRushHour ? 16 : 26;
      fixedWaitMinutes = 3; // parking/startup
      break;
    case 'motorcycle':
      speedKmH = isRushHour ? 22 : 32;
      fixedWaitMinutes = 2;
      break;
    case 'transmetro':
      speedKmH = isRushHour ? 16 : 20;
      fixedWaitMinutes = 8; // bus stop waiting & transfers
      break;
    case 'bus':
      speedKmH = isRushHour ? 13 : 18;
      fixedWaitMinutes = 6;
      break;
    case 'bike':
      speedKmH = 14;
      fixedWaitMinutes = 2;
      break;
    case 'walk':
      speedKmH = 4.5;
      fixedWaitMinutes = 0;
      break;
  }

  const travelMinutes = (roadDistanceKm / speedKmH) * 60 + fixedWaitMinutes;
  return Math.max(5, Math.round(travelMinutes));
}

/**
 * Resolves user's current home coordinates from profile (neighborhood / locality)
 */
export function getUserHomeCoordinates(user: UserProfile): GeoCoordinate {
  if (user.residenceNeighborhood && NEIGHBORHOOD_COORDINATES[user.residenceNeighborhood]) {
    return NEIGHBORHOOD_COORDINATES[user.residenceNeighborhood];
  }
  if (user.residenceLocality && LOCALITY_CENTROIDS[user.residenceLocality]) {
    return LOCALITY_CENTROIDS[user.residenceLocality];
  }
  return { lat: 10.9950, lng: -74.7950 }; // Default Norte-Centro Histórico
}

/**
 * Resolves user's university campus coordinates
 */
export function getUserUniversityCoordinates(user: UserProfile): GeoCoordinate {
  if (user.university && UNIVERSITY_COORDINATES[user.university]) {
    return UNIVERSITY_COORDINATES[user.university];
  }
  return { lat: 11.0195, lng: -74.8504 }; // Uninorte default
}
