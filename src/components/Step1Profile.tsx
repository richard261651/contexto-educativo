'use client';

import React from 'react';
import { usePracticeStore } from '@/store/usePracticeStore';
import { 
  UNIVERSITIES, 
  LOCALITIES, 
  NEIGHBORHOODS_BY_LOCALITY 
} from '@/data/barranquilla_geo';
import { 
  Building2, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Bus, 
  Car, 
  Bike, 
  Footprints, 
  GraduationCap, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Compass
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Step1Profile: React.FC = () => {
  const { userProfile, updateProfile, nextStep } = usePracticeStore();

  const handleUniversityChange = (uniId: string) => {
    const uni = UNIVERSITIES.find(u => u.id === uniId);
    updateProfile({
      university: uniId,
      program: userProfile.program || 'Licenciatura en Educación'
    });
  };

  const currentNeighborhoods = NEIGHBORHOODS_BY_LOCALITY[userProfile.residenceLocality] || [];

  const transportOptions = [
    { id: 'transmetro', label: 'Transmetro', icon: Bus, desc: 'Troncal + Alimentador' },
    { id: 'bus', label: 'Bus Urbano', icon: Bus, desc: 'Rutas colectivas' },
    { id: 'car', label: 'Carro', icon: Car, desc: 'Vehículo particular' },
    { id: 'motorcycle', label: 'Moto', icon: Car, desc: 'Desplazamiento ágil' },
    { id: 'bike', label: 'Bicicleta', icon: Bike, desc: 'Movilidad activa' },
    { id: 'walk', label: 'A pie', icon: Footprints, desc: 'Cercanía inmediata' }
  ];

  const gradeOptions = [
    { id: 'CUARTO', label: '4° Grado (Primaria)' },
    { id: 'QUINTO', label: '5° Grado (Primaria)' },
    { id: 'NOVENO', label: '9° Grado (Secundaria)' },
    { id: 'DÉCIMO', label: '10° Grado (Media Académica)' }
  ];

  const toggleGrade = (grade: string) => {
    const exists = userProfile.preferredGrades?.includes(grade);
    if (exists) {
      updateProfile({
        preferredGrades: userProfile.preferredGrades.filter(g => g !== grade)
      });
    } else {
      updateProfile({
        preferredGrades: [...(userProfile.preferredGrades || []), grade]
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              Paso 1 de 4 • Configuración Logística
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Perfil Académico y Puntos de Movilidad
            </h1>
            <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-xl">
              Configura tu universidad, lugar de residencia y preferencias de transporte para que el algoritmo calcule tiempos reales de viaje y compatibilidad con las 115 IEDs de Barranquilla.
            </p>
          </div>
          <div className="hidden lg:flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center min-w-[150px]">
            <Sparkles className="w-6 h-6 text-yellow-300 mb-1" />
            <span className="text-2xl font-bold">100%</span>
            <span className="text-[11px] text-blue-100 uppercase tracking-wider">Ajuste Geo-Local</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. SELECCIÓN DE UNIVERSIDAD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span>Universidad de Origen</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Institución Universitaria
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
              {UNIVERSITIES.map((uni) => {
                const isSelected = userProfile.university === uni.id || userProfile.university === uni.name;
                return (
                  <button
                    key={uni.id}
                    type="button"
                    onClick={() => handleUniversityChange(uni.id)}
                    className={`flex items-start justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{uni.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{uni.address}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 ml-2">
                      {uni.locality}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Programa Académico
              </label>
              <input
                type="text"
                value={userProfile.program}
                onChange={(e) => updateProfile({ program: e.target.value })}
                placeholder="Licenciatura en..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Semestre
              </label>
              <select
                value={userProfile.semester}
                onChange={(e) => updateProfile({ semester: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['6° Semestre', '7° Semestre', '8° Semestre', '9° Semestre', '10° Semestre'].map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. DATOS DEL ESTUDIANTE */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <span>Datos del Practicante</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Nombre y Apellidos
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={userProfile.fullName}
                  onChange={(e) => updateProfile({ fullName: e.target.value })}
                  placeholder="Carlos Mendoza"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Código Estudiantil
                </label>
                <input
                  type="text"
                  value={userProfile.studentCode}
                  onChange={(e) => updateProfile({ studentCode: e.target.value })}
                  placeholder="200145892"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Teléfono / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={userProfile.phone}
                    onChange={(e) => updateProfile({ phone: e.target.value })}
                    placeholder="301 555 1234"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  placeholder="cmendoza@uninorte.edu.co"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. LUGAR DE RESIDENCIA Y BARRIO */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <MapPin className="w-5 h-5" />
            </div>
            <span>Lugar de Residencia (Barranquilla / AM)</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Localidad Principal
              </label>
              <select
                value={userProfile.residenceLocality}
                onChange={(e) => {
                  const loc = e.target.value;
                  const firstNeigh = NEIGHBORHOODS_BY_LOCALITY[loc]?.[0] || '';
                  updateProfile({
                    residenceLocality: loc,
                    residenceNeighborhood: firstNeigh
                  });
                }}
                className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Barrio de Residencia
              </label>
              <input
                type="text"
                value={userProfile.residenceNeighborhood}
                onChange={(e) => updateProfile({ residenceNeighborhood: e.target.value })}
                placeholder="Ej. Villa Santos, Boston, El Prado..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />

              {/* Suggestions chips */}
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {currentNeighborhoods.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => updateProfile({ residenceNeighborhood: n })}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                      userProfile.residenceNeighborhood === n
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Dirección Residencial (Opcional)
              </label>
              <input
                type="text"
                value={userProfile.residenceAddress}
                onChange={(e) => updateProfile({ residenceAddress: e.target.value })}
                placeholder="Cra 51B # 106 - 45"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 4. MEDIO DE TRANSPORTE Y ACTIVIDADES EXTRA */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Bus className="w-5 h-5" />
            </div>
            <span>Transporte y Actividades Extra</span>
          </div>

          {/* Transport Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Medio de Transporte Habitual
            </label>
            <div className="grid grid-cols-3 gap-2">
              {transportOptions.map((t) => {
                const Icon = t.icon;
                const isSelected = userProfile.transportMode === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => updateProfile({ transportMode: t.id as any })}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold">{t.label}</span>
                    <span className="text-[9px] text-slate-400">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extra work toggle */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={userProfile.hasExtraWork}
                onChange={(e) => updateProfile({ hasExtraWork: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                Tengo un punto de trabajo o actividad fija adicional
              </span>
            </label>

            {userProfile.hasExtraWork && (
              <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Nombre / Actividad</label>
                  <input
                    type="text"
                    value={userProfile.extraWorkName}
                    onChange={(e) => updateProfile({ extraWorkName: e.target.value })}
                    placeholder="Ej. Centro de Idiomas"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Localidad del trabajo</label>
                  <select
                    value={userProfile.extraWorkLocality}
                    onChange={(e) => updateProfile({ extraWorkLocality: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    {LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Preferred Grades */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Preferencia de Grados para Práctica
            </label>
            <div className="grid grid-cols-2 gap-2">
              {gradeOptions.map((g) => {
                const isSelected = userProfile.preferredGrades?.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGrade(g.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-700'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          💡 Puedes ajustar tus datos en cualquier momento del proceso.
        </p>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all transform hover:scale-[1.02]"
        >
          <span>Siguiente: Constructor de Horarios</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
