'use client';

import React from 'react';
import { usePracticeStore } from '@/store/usePracticeStore';
import { 
  GraduationCap, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  FileSpreadsheet, 
  Layers, 
  RotateCcw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  onOpenExcelModal: () => void;
  onOpenCompareModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenExcelModal, onOpenCompareModal }) => {
  const { currentStep, setStep, comparedRecords, allRecords, userProfile } = usePracticeStore();

  const steps = [
    { num: 1, label: 'Perfil y Ubicación', icon: MapPin },
    { num: 2, label: 'Horario Académico', icon: Calendar },
    { num: 3, label: 'Análisis Logístico', icon: TrendingUp },
    { num: 4, label: 'Recomendaciones IED', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setStep(1)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  IED Matcher
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Barranquilla
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Asistente Logístico de Prácticas Docentes
              </p>
            </div>
          </div>

          {/* Step Progress Pills (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;

              return (
                <button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                      : isPast
                      ? 'text-emerald-700 dark:text-emerald-400 hover:text-slate-900 dark:hover:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isPast
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Compare Button */}
            {comparedRecords.length > 0 && (
              <button
                onClick={onOpenCompareModal}
                className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300 transition-colors shadow-sm"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Comparar</span>
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {comparedRecords.length}
                </span>
              </button>
            )}

            {/* Excel Import Button */}
            <button
              onClick={onOpenExcelModal}
              title="Cargar o actualizar Base de Datos de Colegios"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline font-semibold">Base IED ({allRecords.length})</span>
            </button>

            {/* Reset wizard */}
            <button
              onClick={() => {
                if (confirm('¿Deseas reiniciar los datos del asistente?')) {
                  window.location.reload();
                }
              }}
              title="Reiniciar asistente"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Step Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs">
        <span className="font-semibold text-slate-600 dark:text-slate-300">
          Paso {currentStep} de 4: {steps[currentStep - 1].label}
        </span>
        <div className="flex gap-1">
          {steps.map((s) => (
            <div
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`w-6 h-1.5 rounded-full cursor-pointer transition-all ${
                currentStep === s.num
                  ? 'bg-blue-600 w-8'
                  : currentStep > s.num
                  ? 'bg-emerald-500'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </header>
  );
};
