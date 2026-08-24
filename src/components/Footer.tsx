'use client';

import React from 'react';
import { GraduationCap, Heart, Shield, Code, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-10 mt-16 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                IED Matcher • Barranquilla
              </p>
              <p className="text-[11px] text-slate-400">
                Asistente Logístico y de Emparejamiento de Prácticas Pedagógicas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              Validado con Base Oficial 750 IEDs
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Listo para Vercel
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} IED Matcher. Desarrollado para estudiantes y docentes en formación de Barranquilla, Soledad y Puerto Colombia.
          </p>
          <p className="flex items-center gap-1">
            Diseñado con <Heart className="w-3 h-3 text-red-500 fill-red-500" /> y Next.js + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
