'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePracticeStore } from '@/store/usePracticeStore';
import { IEDRecord, MatchResult } from '@/types/ied';
import { 
  getIEDCoordinates, 
  LOCALITY_CENTROIDS, 
  NEIGHBORHOOD_COORDINATES, 
  UNIVERSITY_COORDINATES 
} from '@/data/ied_coordinates';
import { 
  calculateHaversineDistanceKm, 
  calculateRealTravelTimeMinutes, 
  getUserHomeCoordinates, 
  getUserUniversityCoordinates 
} from '@/lib/geoDistance';
import { 
  MapPin, 
  Layers, 
  Flame, 
  Compass, 
  Navigation, 
  Sparkles, 
  Clock, 
  Bus, 
  Car, 
  Bike, 
  Footprints, 
  ExternalLink, 
  Download, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BarranquillaHeatmapProps {
  onSelectIED: (record: IEDRecord, match?: MatchResult) => void;
  onOpenDetails: (match: MatchResult) => void;
}

export const BarranquillaHeatmap: React.FC<BarranquillaHeatmapProps> = ({
  onSelectIED,
  onOpenDetails
}) => {
  const { userProfile, updateProfile, matchedResults, filters } = usePracticeStore();

  const [mapMode, setMapMode] = useState<'heat' | 'markers' | 'both'>('both');
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [userCoord, setUserCoord] = useState(() => getUserHomeCoordinates(userProfile));
  const [isDraggingUserPin, setIsDraggingUserPin] = useState(false);
  const [activeLocalityFilter, setActiveLocalityFilter] = useState<string | null>(null);
  const [showTrafficOverlay, setShowTrafficOverlay] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uniCoord = useMemo(() => getUserUniversityCoordinates(userProfile), [userProfile.university]);

  // Update userCoord if userProfile changes
  useEffect(() => {
    setUserCoord(getUserHomeCoordinates(userProfile));
  }, [userProfile.residenceLocality, userProfile.residenceNeighborhood]);

  // Pre-calculate coordinates for all records
  const geocodedMatches = useMemo(() => {
    return matchedResults.map((match) => {
      const coord = getIEDCoordinates(match.record);
      const { roadKm } = calculateHaversineDistanceKm(userCoord.lat, userCoord.lng, coord.lat, coord.lng);
      const dynamicTravelMin = calculateRealTravelTimeMinutes(roadKm, userProfile.transportMode);
      
      return {
        ...match,
        coord,
        realDistanceKm: roadKm,
        dynamicTravelMin
      };
    });
  }, [matchedResults, userCoord, userProfile.transportMode]);

  // Filtered geocoded matches
  const visibleMatches = useMemo(() => {
    return geocodedMatches.filter((m) => {
      if (activeLocalityFilter && m.record.localidad !== activeLocalityFilter) return false;
      if (filters.showOnlyNoConflicts && m.isConflict) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        return (
          m.record.ied.toLowerCase().includes(q) ||
          m.record.localidad.toLowerCase().includes(q) ||
          m.record.direccion.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [geocodedMatches, activeLocalityFilter, filters]);

  // Bounding box for Barranquilla & Metropolitan Area
  // Min Lat: 10.890 (Soledad/Malambo), Max Lat: 11.050 (La Playa/Salgar)
  // Min Lng: -74.960 (Puerto Colombia), Max Lng: -74.740 (Río Magdalena/Sur Oriente)
  const BOUNDS = {
    minLat: 10.890,
    maxLat: 11.050,
    minLng: -74.950,
    maxLng: -74.740
  };

  const projectToCanvas = (lat: number, lng: number, width: number, height: number) => {
    const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * width;
    const y = height - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * height;
    return { x, y };
  };

  const projectFromCanvas = (x: number, y: number, width: number, height: number) => {
    const lng = BOUNDS.minLng + (x / width) * (BOUNDS.maxLng - BOUNDS.minLng);
    const lat = BOUNDS.minLat + ((height - y) / height) * (BOUNDS.maxLat - BOUNDS.minLat);
    return { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) };
  };

  // Render Canvas Heatmap & Vector Map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#0f172a'; // Deep Navy Slate
    ctx.fillRect(0, 0, width, height);

    // 1. Draw Subtle Grid Lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Draw Magdalena River on East
    ctx.beginPath();
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    const riverStart = projectToCanvas(10.890, -74.750, width, height);
    const riverBend = projectToCanvas(10.980, -74.770, width, height);
    const riverEnd = projectToCanvas(11.045, -74.850, width, height);
    ctx.moveTo(riverStart.x, riverStart.y);
    ctx.quadraticCurveTo(riverBend.x, riverBend.y, riverEnd.x, riverEnd.y);
    ctx.stroke();

    // River label
    ctx.fillStyle = '#60a5fa';
    ctx.font = '10px sans-serif';
    ctx.fillText('Río Magdalena / Bocas de Ceniza', riverEnd.x - 60, riverEnd.y + 20);

    // 3. Draw Caribbean Coastline on North
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    const coast1 = projectToCanvas(11.035, -74.950, width, height);
    const coast2 = projectToCanvas(11.038, -74.880, width, height);
    const coast3 = projectToCanvas(11.045, -74.850, width, height);
    ctx.beginPath();
    ctx.moveTo(coast1.x, coast1.y);
    ctx.bezierCurveTo(coast2.x, coast2.y, coast2.x + 30, coast2.y - 10, coast3.x, coast3.y);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Mar Caribe (Puerto Colombia / Salgar / La Playa)', coast1.x + 20, coast1.y - 10);

    // 4. Draw Main Avenues / Corridors (Circunvalar, Murillo, Vía 40, Cra 51B, Calle 30)
    const avenues = [
      // Circunvalar
      {
        name: 'Av. Circunvalar',
        color: '#334155',
        points: [
          projectToCanvas(10.920, -74.780, width, height),
          projectToCanvas(10.940, -74.820, width, height),
          projectToCanvas(10.980, -74.835, width, height),
          projectToCanvas(11.020, -74.845, width, height)
        ]
      },
      // Calle Murillo (Calle 45 - Troncal Transmetro)
      {
        name: 'Troncal Murillo (Transmetro)',
        color: showTrafficOverlay ? '#ef4444' : '#475569',
        dash: [4, 4],
        points: [
          projectToCanvas(10.930, -74.760, width, height),
          projectToCanvas(10.950, -74.790, width, height),
          projectToCanvas(10.980, -74.810, width, height)
        ]
      },
      // Cra 51B (Corredor Universitario)
      {
        name: 'Cra 51B (Corredor Uni)',
        color: '#38bdf8',
        points: [
          projectToCanvas(10.995, -74.805, width, height),
          projectToCanvas(11.018, -74.850, width, height),
          projectToCanvas(11.025, -74.890, width, height)
        ]
      }
    ];

    avenues.forEach(av => {
      ctx.beginPath();
      ctx.strokeStyle = av.color;
      ctx.lineWidth = 2.5;
      if (av.dash) ctx.setLineDash(av.dash);
      else ctx.setLineDash([]);
      ctx.moveTo(av.points[0].x, av.points[0].y);
      for (let i = 1; i < av.points.length; i++) {
        ctx.lineTo(av.points[i].x, av.points[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // 5. Draw HEATMAP LAYER (Density Glows)
    if (mapMode === 'heat' || mapMode === 'both') {
      visibleMatches.forEach((m) => {
        const pt = projectToCanvas(m.coord.lat, m.coord.lng, width, height);
        
        // Intensity based on match score
        const radius = m.score > 85 ? 42 : 28;
        const gradient = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius);

        if (m.category === 'perfect' || m.category === 'weekend') {
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.45)'); // Emerald core
          gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)'); // Cyan glow
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        } else if (m.category === 'afternoon' || m.category === 'gap') {
          gradient.addColorStop(0, 'rgba(234, 179, 8, 0.40)'); // Gold core
          gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.20)');
          gradient.addColorStop(1, 'rgba(234, 179, 8, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.30)'); // Red warning core
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 6. Draw Localities Boundary Text Labels
    Object.entries(LOCALITY_CENTROIDS).forEach(([locName, coord]) => {
      const pt = projectToCanvas(coord.lat, coord.lng, width, height);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(locName, pt.x, pt.y);
    });

    // 7. Draw Route Polyline from User Home / University to Selected IED
    if (selectedMatch) {
      const userPt = projectToCanvas(userCoord.lat, userCoord.lng, width, height);
      const iedPt = projectToCanvas(selectedMatch.coord.lat, selectedMatch.coord.lng, width, height);

      // Route Glow
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 8;
      ctx.moveTo(userPt.x, userPt.y);
      ctx.lineTo(iedPt.x, iedPt.y);
      ctx.stroke();

      // Route Dashed Line
      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.moveTo(userPt.x, userPt.y);
      ctx.lineTo(iedPt.x, iedPt.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 8. Draw IED Markers (Pills / Circles)
    if (mapMode === 'markers' || mapMode === 'both') {
      visibleMatches.forEach((m) => {
        const pt = projectToCanvas(m.coord.lat, m.coord.lng, width, height);
        const isSelected = selectedMatch?.record.id === m.record.id;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isSelected ? 8 : 4.5, 0, Math.PI * 2);

        if (m.isConflict) {
          ctx.fillStyle = '#ef4444'; // Red
        } else if (m.category === 'perfect' || m.category === 'weekend') {
          ctx.fillStyle = '#10b981'; // Emerald
        } else if (m.category === 'gap') {
          ctx.fillStyle = '#38bdf8'; // Sky Blue
        } else if (m.category === 'afternoon') {
          ctx.fillStyle = '#f59e0b'; // Amber
        } else {
          ctx.fillStyle = '#f97316'; // Orange
        }

        ctx.fill();
        ctx.strokeStyle = isSelected ? '#ffffff' : '#0f172a';
        ctx.lineWidth = isSelected ? 2.5 : 1;
        ctx.stroke();
      });
    }

    // 9. Draw University Campus Pin
    const uniPt = projectToCanvas(uniCoord.lat, uniCoord.lng, width, height);
    ctx.beginPath();
    ctx.arc(uniPt.x, uniPt.y, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1'; // Indigo
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎓 Mi Universidad', uniPt.x, uniPt.y - 13);

    // 10. Draw User Home Pin (Donde Vivo)
    const userPt = projectToCanvas(userCoord.lat, userCoord.lng, width, height);

    // Radar pulse ring
    ctx.beginPath();
    ctx.arc(userPt.x, userPt.y, 16, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(userPt.x, userPt.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444'; // Red Pin
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📍 DÓNDE VIVO', userPt.x, userPt.y - 15);

  }, [visibleMatches, mapMode, userCoord, uniCoord, selectedMatch, showTrafficOverlay]);

  // Handle Canvas Click to Select IED or Reposition User Pin
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Check if clicked near any IED
    let clickedMatch: any = null;
    let minDistance = 15; // 15px radius

    for (const m of visibleMatches) {
      const pt = projectToCanvas(m.coord.lat, m.coord.lng, canvas.width, canvas.height);
      const dist = Math.hypot(pt.x - x, pt.y - y);
      if (dist < minDistance) {
        minDistance = dist;
        clickedMatch = m;
      }
    }

    if (clickedMatch) {
      setSelectedMatch(clickedMatch);
    } else {
      // Reposition User Pin to Clicked Position!
      const newCoord = projectFromCanvas(x, y, canvas.width, canvas.height);
      setUserCoord(newCoord);
      updateProfile({
        residenceAddress: `Coordenadas [${newCoord.lat}, ${newCoord.lng}]`
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      
      {/* Top Bar Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Mapa Geoespacial y Mapa de Calor • Barranquilla
              </h3>
              <p className="text-xs text-slate-500">
                Visualiza la densidad de cupos y calcula distancias en tiempo real desde tu ubicación
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Mode switch */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setMapMode('both')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mapMode === 'both' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              Híbrido
            </button>
            <button
              onClick={() => setMapMode('heat')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mapMode === 'heat' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              🔥 Calor
            </button>
            <button
              onClick={() => setMapMode('markers')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mapMode === 'markers' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              📍 Puntos
            </button>
          </div>

          <button
            onClick={() => setShowTrafficOverlay(!showTrafficOverlay)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
              showTrafficOverlay
                ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200'
            }`}
          >
            🚦 Troncales Tráfico
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-inner">
        
        {/* Interactive Canvas */}
        <canvas
          ref={canvasRef}
          width={960}
          height={520}
          onClick={handleCanvasClick}
          className="w-full h-[450px] sm:h-[520px] object-cover cursor-crosshair"
        />

        {/* Floating Instruction Badge */}
        <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700 text-white text-[11px] shadow-lg flex items-center gap-2 pointer-events-none">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong>Haz clic en el mapa</strong> para mover tu pin de <strong>"Dónde Vivo"</strong> o selecciona un colegio.
          </span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white text-[11px] space-y-1.5 shadow-lg hidden sm:block">
          <span className="font-bold text-[10px] uppercase text-slate-400 block">Convenciones Afinidad</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Match Perfecto (&gt;88%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Tarde Libre (75-87%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>Hueco Óptimo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Conflicto Horario</span>
          </div>
        </div>

        {/* FLOATING SELECTED IED ROUTE CARD */}
        <AnimatePresence>
          {selectedMatch && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-4 right-4 max-w-sm w-full p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-2xl text-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    Grado {selectedMatch.record.gradoGeneral} • Gr {selectedMatch.record.grupo}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white mt-1 leading-snug line-clamp-2">
                    {selectedMatch.record.ied}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              {/* Commute Real Metrics */}
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Distancia Ruta:</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">
                    {selectedMatch.distanceKm} km (vía urbana)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tiempo Estimado:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    ~{selectedMatch.travelTimeMinutes} min ({userProfile.transportMode})
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-slate-400">Horario:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{selectedMatch.record.horario}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onOpenDetails(selectedMatch)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Ver Ficha
                </button>
                <button
                  onClick={() => onSelectIED(selectedMatch.record, selectedMatch)}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 transition-all"
                >
                  Seleccionar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Quick Coordinate Reference Details */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500 shrink-0" />
          <span>
            Punto de Residencia actual: <strong>{userProfile.residenceNeighborhood}</strong> [{userCoord.lat}, {userCoord.lng}]
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            Total Colegios Georreferenciados: <strong>{visibleMatches.length}</strong> instituciones
          </span>
        </div>
      </div>

    </div>
  );
};
