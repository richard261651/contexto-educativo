'use client';

import React from 'react';
import { IEDRecord, MatchResult } from '@/types/ied';
import { 
  X, 
  MapPin, 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Building, 
  BookOpen, 
  Award, 
  ExternalLink,
  ShieldAlert,
  FileSpreadsheet
} from 'lucide-react';

interface SchoolDetailsModalProps {
  match: MatchResult | null;
  onClose: () => void;
  onSelect: (record: IEDRecord) => void;
}

export const SchoolDetailsModal: React.FC<SchoolDetailsModalProps> = ({
  match,
  onClose,
  onSelect
}) => {
  if (!match) return null;
  const { record, score, badgeLabel, badgeColor, travelTimeMinutes, distanceKm, reasons } = match;

  const mapsQuery = encodeURIComponent(`${record.ied}, ${record.direccion}, Barranquilla`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 uppercase tracking-wider">
              Grado {record.gradoGeneral} • Grupo {record.grupo}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-yellow-400 text-yellow-950">
              Score: {score}%
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight pr-8">
            {record.ied}
          </h2>
          <p className="text-blue-100 text-xs mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {record.direccion} • {record.localidad}
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Key Quick Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Horario</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{record.horario}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Estrategia</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{record.estrategia}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Tiempo Traslado</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">~{travelTimeMinutes} min ({distanceKm} km)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Fila Excel</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Fila #{record.filaExcel}</span>
            </div>
          </div>

          {/* Compatibility Justification */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-2">
            <h4 className="font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              Diagnóstico de Compatibilidad ({badgeLabel})
            </h4>
            <ul className="space-y-1">
              {reasons.map((r, i) => (
                <li key={i} className="text-blue-900 dark:text-blue-300 flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts Directory */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Directorio de Contactos Clave
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Tutor */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tutor Asignado</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{record.tutor}</p>
                {record.celularTutor && (
                  <p className="text-slate-500 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {record.celularTutor}
                  </p>
                )}
                {record.correoTutor && (
                  <p className="text-slate-500 flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 text-slate-400" /> {record.correoTutor}
                  </p>
                )}
              </div>

              {/* Rector */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Rector(a) IED</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{record.rector || 'Directiva Institucional'}</p>
                {record.celularRector && (
                  <p className="text-slate-500 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {record.celularRector}
                  </p>
                )}
                {record.correoRector && (
                  <p className="text-slate-500 flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 text-slate-400" /> {record.correoRector}
                  </p>
                )}
              </div>

              {/* Coordinador */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Coordinación</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{record.coordinador || 'Coordinación Académica'}</p>
                {record.celularCoordinador && (
                  <p className="text-slate-500 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {record.celularCoordinador}
                  </p>
                )}
              </div>

              {/* Docente Titular */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Docente Titular / Lead Teacher</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{record.docenteTitular || record.leadTeacher || 'Docente de Aula'}</p>
                {record.celularDocente && (
                  <p className="text-slate-500 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {record.celularDocente}
                  </p>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver en Google Maps</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cerrar
            </button>

            <button
              onClick={() => {
                onSelect(record);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
            >
              Seleccionar y Generar PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
