'use client';

import React from 'react';
import { usePracticeStore } from '@/store/usePracticeStore';
import { School, Users, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export const StatsCards: React.FC = () => {
  const { allRecords, matchedResults } = usePracticeStore();
  const compatibleCount = matchedResults.filter(m => !m.isConflict).length;

  const stats = [
    {
      label: 'Grupos y Plazas IED',
      value: allRecords.length,
      unit: 'cupos',
      icon: School,
      color: 'from-blue-600 to-indigo-600',
      desc: 'Base oficial de colegios'
    },
    {
      label: 'Colegios e Instituciones',
      value: 115,
      unit: 'sedes',
      icon: Users,
      color: 'from-emerald-600 to-teal-600',
      desc: 'Distrito de Barranquilla'
    },
    {
      label: 'Localidades y Zonas',
      value: 7,
      unit: 'zonas',
      icon: MapPin,
      color: 'from-purple-600 to-pink-600',
      desc: 'Riomar, Norte, Sur, AM'
    },
    {
      label: 'Compatibilidad Actual',
      value: compatibleCount,
      unit: 'opciones',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-600',
      desc: 'Disponibles según tu horario'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {s.label}
              </span>
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-xs`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              {s.value} <span className="text-xs font-normal text-slate-400">{s.unit}</span>
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {s.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
};
