'use client';

import React from 'react';
import { usePracticeStore } from '@/store/usePracticeStore';
import { UNIVERSITIES } from '@/data/barranquilla_geo';
import { 
  TrendingUp, 
  CalendarCheck, 
  Sun, 
  Moon, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Navigation, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  PieChart,
  Car,
  Bus
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Step3MatchingAnalysis: React.FC = () => {
  const { 
    analysis, 
    matchedResults, 
    userProfile, 
    nextStep, 
    prevStep 
  } = usePracticeStore();

  const compatibleMatches = matchedResults.filter(m => !m.isConflict);
  const perfectMatches = matchedResults.filter(m => m.category === 'perfect' || m.category === 'weekend');
  const afternoonMatches = matchedResults.filter(m => m.category === 'afternoon');
  const gapMatches = matchedResults.filter(m => m.category === 'gap');
  const warningMatches = matchedResults.filter(m => m.category === 'warning');
  const conflictMatches = matchedResults.filter(m => m.isConflict);

  const uniObj = UNIVERSITIES.find(u => u.id === userProfile.university || u.name === userProfile.university);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/15 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Paso 3 de 4 • Motor Logístico de Disponibilidad
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Diagnóstico de Compatibilidad y Rutas
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl">
              El motor ha analizado tu cuadrícula horaria y calculado tus ventanas óptimas de práctica, evaluando rutas y tráfico en Barranquilla y su área metropolitana.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="text-right">
              <p className="text-2xl font-black">{compatibleMatches.length}</p>
              <p className="text-[11px] text-blue-200 uppercase font-bold tracking-wider">Plazas Compatibles</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* KEY METRICS 4 CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Días Libres */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Días 100% Libres
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analysis.freeDays.length > 0 ? analysis.freeDays.length : '0'} <span className="text-xs font-normal text-slate-400">días</span>
          </p>
          <div className="flex flex-wrap gap-1 pt-1">
            {analysis.freeDays.length > 0 ? (
              analysis.freeDays.map(d => (
                <span key={d} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {d}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Todos los días tienen algún compromiso</span>
            )}
          </div>
        </div>

        {/* 2. Tardes Libres */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tardes Libres (&gt;3h)
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analysis.freeAfternoons.length} <span className="text-xs font-normal text-slate-400">jornadas</span>
          </p>
          <div className="flex flex-wrap gap-1 pt-1">
            {analysis.freeAfternoons.slice(0, 3).map((a, i) => (
              <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {a.day} (desde las {Math.floor(a.startHour)}:00)
              </span>
            ))}
          </div>
        </div>

        {/* 3. Huecos Óptimos */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Huecos entre Clases
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analysis.optimalGaps.length} <span className="text-xs font-normal text-slate-400">ventanas (&gt;2.5h)</span>
          </p>
          <div className="flex flex-wrap gap-1 pt-1">
            {analysis.optimalGaps.length > 0 ? (
              analysis.optimalGaps.map((g, i) => (
                <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {g.day} ({g.duration.toFixed(1)}h libre)
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Sin huecos mayores a 2.5h</span>
            )}
          </div>
        </div>

        {/* 4. Horas Ocupadas vs Libres */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Disponibilidad Total
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analysis.totalFreeHours}h <span className="text-xs font-normal text-slate-400">/ 84h sem</span>
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full" 
              style={{ width: `${Math.round((analysis.totalFreeHours / 84) * 100)}%` }} 
            />
          </div>
        </div>

      </div>

      {/* LOGISTICS & MOBILITY INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mobility Rule & Routing Advice */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
              <Navigation className="w-5 h-5" />
            </div>
            <span>Reglas de Movilidad y Rutas Óptimas</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900 dark:text-emerald-200">
                  Prioridad en Zona de Residencia ({userProfile.residenceLocality})
                </p>
                <p className="text-emerald-700 dark:text-emerald-300 mt-0.5">
                  El algoritmo prioriza las IEDs ubicadas en tu misma localidad ({userProfile.residenceNeighborhood || 'Barrio'}) y en la localidad de tu universidad ({uniObj?.locality || 'Riomar'}).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 dark:text-amber-200">
                  Filtro de Desplazamiento y Tráfico Crítico
                </p>
                <p className="text-amber-700 dark:text-amber-300 mt-0.5">
                  Trayectos que cruzan la ciudad en hora pico (ej. Soledad &lt;-&gt; Puerto Colombia o Sur Occidente &lt;-&gt; Riomar) reciben penalizaciones y alertas de tiempo para evitar demoras en tus clases.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Medio Seleccionado:</span>
              </div>
              <span className="font-bold uppercase text-slate-900 dark:text-white px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                {userProfile.transportMode}
              </span>
            </div>
          </div>
        </div>

        {/* Compatibility Breakdown Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <span>Distribución de Afinidad IED</span>
          </div>

          <div className="space-y-2.5">
            
            {/* Match Perfecto */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Match Perfecto (Cerca / Libre)</span>
              </div>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-300">{perfectMatches.length} plazas</span>
            </div>

            {/* Tardes Libres */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Tarde Libre Compatible</span>
              </div>
              <span className="font-extrabold text-amber-700 dark:text-amber-300">{afternoonMatches.length} plazas</span>
            </div>

            {/* Huecos Óptimos */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Hueco Óptimo entre Clases</span>
              </div>
              <span className="font-extrabold text-blue-700 dark:text-blue-300">{gapMatches.length} plazas</span>
            </div>

            {/* Desplazamiento Extenso */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Desplazamiento Extenso</span>
              </div>
              <span className="font-extrabold text-orange-700 dark:text-orange-300">{warningMatches.length} plazas</span>
            </div>

            {/* Cruce / Conflicto */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Cruces de Horario (Descartadas)</span>
              </div>
              <span className="font-extrabold text-red-700 dark:text-red-300">{conflictMatches.length} plazas</span>
            </div>

          </div>
        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Atrás: Horario</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all transform hover:scale-[1.02]"
        >
          <span>Ver Dashboard de Recomendaciones ({compatibleMatches.length})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
