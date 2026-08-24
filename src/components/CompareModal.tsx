'use client';

import React from 'react';
import { usePracticeStore } from '@/store/usePracticeStore';
import { IEDRecord, MatchResult } from '@/types/ied';
import { 
  X, 
  Trash2, 
  Check, 
  MapPin, 
  Clock, 
  Calendar, 
  Award, 
  Layers, 
  ExternalLink 
} from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (record: IEDRecord) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const { comparedRecords, toggleCompareRecord, clearComparedRecords, matchedResults } = usePracticeStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-700 to-purple-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Comparador de Opciones de Práctica</h2>
              <p className="text-indigo-100 text-xs mt-0.5">
                Comparando {comparedRecords.length} de 3 plazas seleccionadas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedRecords.length > 0 && (
              <button
                onClick={clearComparedRecords}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Limpiar selección
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {comparedRecords.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                No tienes opciones añadidas al comparador
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto text-xs">
                En el Dashboard de recomendaciones, haz clic en el botón "Comparar" de las tarjetas de IED que desees contrastar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {comparedRecords.map((record) => {
                const match = matchedResults.find(m => m.record.id === record.id);
                return (
                  <div
                    key={record.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      
                      {/* Top badge */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                          Grado {record.gradoGeneral} • Gr {record.grupo}
                        </span>
                        <button
                          onClick={() => toggleCompareRecord(record)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-white dark:hover:bg-slate-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Title */}
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-tight">
                          {record.ied}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {record.localidad}
                        </p>
                      </div>

                      {/* Metrics */}
                      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Score Afinidad:</span>
                          <span className="font-extrabold text-blue-600 dark:text-blue-400">
                            {match?.score || 70}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Horario:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {record.horario}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Estrategia:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {record.estrategia}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tiempo Traslado:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            ~{match?.travelTimeMinutes || 20} min
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tutor:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                            {record.tutor}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Fila Excel:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            #{record.filaExcel}
                          </span>
                        </div>
                      </div>

                    </div>

                    <button
                      onClick={() => {
                        onSelect(record);
                        onClose();
                      }}
                      className="w-full mt-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      Elegir esta opción
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
