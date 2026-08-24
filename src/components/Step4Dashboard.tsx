'use client';

import React, { useState, useMemo } from 'react';
import { usePracticeStore } from '@/store/usePracticeStore';
import { IEDRecord, MatchResult, DayOfWeek, MatchCategory } from '@/types/ied';
import { LOCALITIES } from '@/data/barranquilla_geo';
import { BarranquillaHeatmap } from '@/components/BarranquillaHeatmap';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  BookOpen, 
  Award, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  Layers, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Download, 
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  FileSpreadsheet,
  Bus,
  Flame,
  Map
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Step4DashboardProps {
  onOpenDetailsModal: (match: MatchResult) => void;
  onOpenCertificateModal: (record: IEDRecord, match: MatchResult) => void;
  onOpenCompareModal: () => void;
}

const GRADES = ['CUARTO', 'QUINTO', 'NOVENO', 'DÉCIMO'];
const DAYS: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const STRATEGIES = ['AS', 'GK'];

export const Step4Dashboard: React.FC<Step4DashboardProps> = ({
  onOpenDetailsModal,
  onOpenCertificateModal,
  onOpenCompareModal
}) => {
  const { 
    matchedResults, 
    filters, 
    setFilters, 
    resetFilters, 
    comparedRecords, 
    toggleCompareRecord, 
    prevStep,
    userProfile 
  } = usePracticeStore();

  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'heatmap'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter & Sort matched results
  const filteredMatches = useMemo(() => {
    return matchedResults.filter((match) => {
      const { record, isConflict, category } = match;

      // 1. Conflict Filter
      if (filters.showOnlyNoConflicts && isConflict) {
        return false;
      }

      // 2. Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesQuery = 
          record.ied.toLowerCase().includes(q) ||
          record.tutor.toLowerCase().includes(q) ||
          record.direccion.toLowerCase().includes(q) ||
          record.localidad.toLowerCase().includes(q) ||
          record.grupo.toLowerCase().includes(q) ||
          record.horario.toLowerCase().includes(q);

        if (!matchesQuery) return false;
      }

      // 3. Localities
      if (filters.localities.length > 0) {
        if (!filters.localities.includes(record.localidad)) return false;
      }

      // 4. Grades
      if (filters.grades.length > 0) {
        if (!filters.grades.includes(record.gradoGeneral)) return false;
      }

      // 5. Days
      if (filters.days.length > 0) {
        const hasDay = record.dias.some(d => filters.days.includes(d));
        if (!hasDay) return false;
      }

      // 6. Strategies
      if (filters.strategies.length > 0) {
        if (!filters.strategies.includes(record.estrategia)) return false;
      }

      // 7. Match Categories
      if (filters.matchCategories.length > 0) {
        if (!filters.matchCategories.includes(category)) return false;
      }

      // 8. Max Travel Time
      if (match.travelTimeMinutes > filters.maxTravelTime) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'score') {
        return filters.sortOrder === 'desc' ? b.score - a.score : a.score - b.score;
      }
      if (filters.sortBy === 'travelTime') {
        return filters.sortOrder === 'desc' ? b.travelTimeMinutes - a.travelTimeMinutes : a.travelTimeMinutes - b.travelTimeMinutes;
      }
      if (filters.sortBy === 'ied') {
        return filters.sortOrder === 'desc' 
          ? b.record.ied.localeCompare(a.record.ied) 
          : a.record.ied.localeCompare(b.record.ied);
      }
      if (filters.sortBy === 'grade') {
        return filters.sortOrder === 'desc' 
          ? b.record.gradoGeneral.localeCompare(a.record.gradoGeneral) 
          : a.record.gradoGeneral.localeCompare(b.record.gradoGeneral);
      }
      return 0;
    });
  }, [matchedResults, filters]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage) || 1;
  const paginatedMatches = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMatches.slice(start, start + itemsPerPage);
  }, [filteredMatches, currentPage]);

  const toggleArrayFilter = <T extends string>(
    key: 'localities' | 'grades' | 'days' | 'strategies' | 'matchCategories', 
    item: T
  ) => {
    const current = filters[key] as T[];
    const exists = current.includes(item);
    const updated = exists ? current.filter(x => x !== item) : [...current, item];
    setFilters({ [key]: updated as any });
    setCurrentPage(1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/15 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Paso 4 de 4 • Resultados, Rutas y Selección Final
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dashboard de Recomendaciones y Geolocalización
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl">
              Explora las opciones compatibles en tarjetas, tabla o en el <strong>Mapa de Calor Geoespacial</strong> con cálculo en vivo de distancias desde tu vivienda.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {comparedRecords.length > 0 && (
              <button
                onClick={onOpenCompareModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-indigo-900 font-bold text-xs shadow-lg hover:bg-indigo-50 transition-colors"
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Ver Comparador ({comparedRecords.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FILTER & VIEW SELECTOR TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        
        {/* Search Bar & Primary Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters({ searchQuery: e.target.value });
                setCurrentPage(1);
              }}
              placeholder="Buscar por IED (ej. Pies Descalzos, Normal Superior), tutor, barrio o dirección..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters({ searchQuery: '' })}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort By & View Mode Selector */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Ordenar:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ sortBy: e.target.value as any })}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="score">Mayor Afinidad (Score %)</option>
                <option value="travelTime">Menor Tiempo Traslado</option>
                <option value="ied">Nombre IED (A-Z)</option>
                <option value="grade">Grado Escolar</option>
              </select>
            </div>

            {/* View Mode 3-Way Switcher */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' 
                    : 'text-slate-500'
                }`}
                title="Vista en Tarjetas"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Tarjetas</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' 
                    : 'text-slate-500'
                }`}
                title="Vista en Tabla"
              >
                <List className="w-3.5 h-3.5" />
                <span>Tabla</span>
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  viewMode === 'heatmap' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-blue-600'
                }`}
                title="Mapa de Calor Geoespacial"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>Mapa de Calor</span>
              </button>
            </div>
          </div>

        </div>

        {/* Filter Chips Section */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          
          {/* Localities */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Localidad:
            </span>
            {LOCALITIES.map((loc) => {
              const isSelected = filters.localities.includes(loc);
              return (
                <button
                  key={loc}
                  onClick={() => toggleArrayFilter('localities', loc)}
                  className={`px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>

          {/* Grades & Strategies */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Grado:
              </span>
              {GRADES.map((grade) => {
                const isSelected = filters.grades.includes(grade);
                return (
                  <button
                    key={grade}
                    onClick={() => toggleArrayFilter('grades', grade)}
                    className={`px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {grade}
                  </button>
                );
              })}

              <span className="font-bold text-slate-500 ml-3 mr-1">Estrategia:</span>
              {STRATEGIES.map((strat) => {
                const isSelected = filters.strategies.includes(strat);
                return (
                  <button
                    key={strat}
                    onClick={() => toggleArrayFilter('strategies', strat)}
                    className={`px-2 py-1 rounded-lg border font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {strat}
                  </button>
                );
              })}
            </div>

            {/* Conflicts toggle */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.showOnlyNoConflicts}
                  onChange={(e) => {
                    setFilters({ showOnlyNoConflicts: e.target.checked });
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Ocultar cruces de horario ({matchedResults.filter(m => !m.isConflict).length} compatibles)
                </span>
              </label>

              {(filters.localities.length > 0 || filters.grades.length > 0 || filters.searchQuery || filters.strategies.length > 0) && (
                <button
                  onClick={resetFilters}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Restablecer filtros
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* VIEW MODES */}
      {viewMode === 'heatmap' ? (
        
        /* 1. HEATMAP & GEOLOCATION VIEW */
        <BarranquillaHeatmap
          onSelectIED={(record, match) => onOpenCertificateModal(record, match || matchedResults.find(m => m.record.id === record.id)!)}
          onOpenDetails={(match) => onOpenDetailsModal(match)}
        />

      ) : filteredMatches.length === 0 ? (
        
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No se encontraron opciones con los filtros seleccionados
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Intenta ampliar tu rango de búsqueda, desmarcar algunas localidades o verificar la casilla de cruces de horario.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
          >
            Limpiar todos los filtros
          </button>
        </div>

      ) : viewMode === 'grid' ? (
        
        /* 2. GRID VIEW (Cards) */
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
            <span>
              Mostrando <strong>{filteredMatches.length}</strong> opciones compatibles de <strong>{matchedResults.length}</strong> registradas.
            </span>
            <span>
              Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedMatches.map((match) => {
              const { record, score, badgeLabel, badgeColor, travelTimeMinutes, distanceKm, isConflict, conflictReason, reasons } = match;
              const isCompared = comparedRecords.some(r => r.id === record.id);

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all flex flex-col justify-between hover:shadow-lg ${
                    isConflict 
                      ? 'border-red-200 dark:border-red-900/60 opacity-80' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Top Bar: Grade, Group, Excel Row & Score */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {record.gradoGeneral} • Gr {record.grupo}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {record.estrategia}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Fila #{record.filaExcel}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-black text-xs text-slate-900 dark:text-white">{score}%</span>
                      </div>
                    </div>

                    {/* IED Name */}
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {record.ied}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{record.direccion}</span>
                      </p>
                    </div>

                    {/* Schedule & Locality Pill */}
                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          {record.horario}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {record.localidad}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <span className="flex items-center gap-1">
                          <Bus className="w-3 h-3 text-slate-400" />
                          Traslado: <strong>~{travelTimeMinutes} min</strong> ({distanceKm} km)
                        </span>
                        <span className="truncate max-w-[120px]" title={record.tutor}>
                          Tutor: <strong>{record.tutor}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Badge & Reasons */}
                    <div>
                      <div className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-xl border ${badgeColor}`}>
                        {isConflict ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>{badgeLabel}</span>
                      </div>

                      {reasons.length > 0 && !isConflict && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-1 italic">
                          "{reasons[0]}"
                        </p>
                      )}

                      {isConflict && conflictReason && (
                        <p className="text-[11px] text-red-600 dark:text-red-400 mt-1.5 line-clamp-2">
                          {conflictReason}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenDetailsModal(match)}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Ver ficha completa y contactos"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleCompareRecord(record)}
                        className={`p-2 rounded-xl transition-colors ${
                          isCompared 
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' 
                            : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800'
                        }`}
                        title="Añadir al comparador"
                      >
                        <Layers className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => onOpenCertificateModal(record, match)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all transform hover:scale-[1.02]"
                    >
                      <span>Seleccionar</span>
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <span className="text-slate-600 dark:text-slate-300">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      ) : (
        
        /* 3. TABLE VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 text-center w-14">Fila</th>
                  <th className="p-3.5">IED & Grado</th>
                  <th className="p-3.5">Horario Práctica</th>
                  <th className="p-3.5">Localidad & Traslado</th>
                  <th className="p-3.5">Afinidad</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedMatches.map((match) => {
                  const { record, score, badgeLabel, badgeColor, travelTimeMinutes, isConflict } = match;
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-center text-slate-400 font-mono font-bold">
                        #{record.filaExcel}
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900 dark:text-white leading-tight">
                          {record.ied}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400">
                            Grado {record.gradoGeneral} • Gr {record.grupo}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Estrategia: {record.estrategia}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {record.horario}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          {record.localidad}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Bus className="w-3 h-3 text-slate-400" /> ~{travelTimeMinutes} min
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {score}%
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                            {badgeLabel}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onOpenDetailsModal(match)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenCertificateModal(record, match)}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                          >
                            Seleccionar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Navigation to go back */}
      <div className="flex items-center justify-start pt-2">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Atrás: Motor de Logística</span>
        </button>
      </div>

    </motion.div>
  );
};
