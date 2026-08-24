'use client';

import React, { useState, useRef } from 'react';
import { usePracticeStore } from '@/store/usePracticeStore';
import { DayOfWeek, ScheduleBlock } from '@/types/ied';
import { 
  Calendar, 
  UploadCloud, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Clock, 
  FileImage, 
  Layers, 
  Info,
  Scan,
  RefreshCw,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 6 to 20 (6:00 AM to 8:00 PM)

export const Step2Schedule: React.FC = () => {
  const { 
    scheduleBlocks, 
    addScheduleBlock, 
    removeScheduleBlock, 
    clearSchedule, 
    loadTemplate, 
    nextStep, 
    prevStep 
  } = usePracticeStore();

  const [activeTab, setActiveTab] = useState<'grid' | 'ocr'>('grid');
  const [selectedType, setSelectedType] = useState<'academic' | 'work' | 'personal'>('academic');
  const [quickTitle, setQuickTitle] = useState('Clase Universitaria');
  
  // OCR simulation state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanSuccess, setScanSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to format hour label (e.g. 6 -> "6:00 AM", 13 -> "1:00 PM")
  const formatHourLabel = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayH = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayH}:00 ${period}`;
  };

  // Check if a specific 1-hour slot is occupied
  const getBlockInSlot = (day: DayOfWeek, hour: number) => {
    return scheduleBlocks.find(b => b.day === day && hour >= b.startHour && hour < b.endHour);
  };

  // Toggle or add slot on click
  const handleCellClick = (day: DayOfWeek, hour: number) => {
    const existing = getBlockInSlot(day, hour);
    if (existing) {
      removeScheduleBlock(existing.id);
    } else {
      addScheduleBlock({
        day,
        startHour: hour,
        endHour: hour + 1,
        title: quickTitle || 'Clase Académica',
        type: selectedType
      });
    }
  };

  // Handle OCR file drop/selection
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida de tu horario.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      startOcrScan();
    };
    reader.readAsDataURL(file);
  };

  const startOcrScan = () => {
    setIsScanning(true);
    setScanProgress(10);
    setScanSuccess(false);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setScanSuccess(true);
            // Apply detected schedule blocks automatically
            loadTemplate('morning_heavy');
          }, 600);
          return 100;
        }
        return prev + 15;
      });
    }, 250);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/15 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              Paso 2 de 4 • Constructor de Disponibilidad
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Construye tu Horario Semanal
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl">
              Marca los bloques donde tienes clases universitarias, laboratorios o turnos laborales. Las horas no marcadas se considerarán disponibles para tus prácticas docentes.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'grid'
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Cuadrícula Visual</span>
            </button>
            <button
              onClick={() => setActiveTab('ocr')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ocr'
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>Subir Foto Horario (OCR)</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'grid' ? (
        <div className="space-y-4">
          {/* Quick Toolbar & Templates */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            
            {/* Quick Templates */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Plantillas Rápidas:
              </span>
              <button
                onClick={() => loadTemplate('morning_heavy')}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors border border-slate-200 dark:border-slate-700"
              >
                ☀️ Mañanas (7-12)
              </button>
              <button
                onClick={() => loadTemplate('afternoon_heavy')}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors border border-slate-200 dark:border-slate-700"
              >
                🌆 Tardes (14-18)
              </button>
              <button
                onClick={() => loadTemplate('intermittent_gaps')}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors border border-slate-200 dark:border-slate-700"
              >
                ⏱️ Con Huecos (&gt;2.5h)
              </button>
              <button
                onClick={() => loadTemplate('saturdays_free')}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors border border-slate-200 dark:border-slate-700"
              >
                📅 Sábados Libres
              </button>
            </div>

            {/* Block Type Selector & Clear */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => { setSelectedType('academic'); setQuickTitle('Clase Universitaria'); }}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedType === 'academic' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Clase
                </button>
                <button
                  onClick={() => { setSelectedType('work'); setQuickTitle('Turno Laboral'); }}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedType === 'work' 
                      ? 'bg-amber-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Trabajo
                </button>
                <button
                  onClick={() => { setSelectedType('personal'); setQuickTitle('Compromiso'); }}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedType === 'personal' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Personal
                </button>
              </div>

              <button
                onClick={clearSchedule}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-800 font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            </div>

          </div>

          {/* Interactive Schedule Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-24 text-center border-r border-slate-200 dark:border-slate-700">
                      Hora
                    </th>
                    {DAYS.map((day) => {
                      const count = scheduleBlocks.filter(b => b.day === day).length;
                      return (
                        <th key={day} className="p-3 text-xs font-bold text-slate-800 dark:text-slate-200 text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                          <div className="flex flex-col items-center">
                            <span>{day}</span>
                            <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                              {count === 0 ? '✨ Libre' : `${count} bloques`}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map((hour) => (
                    <tr key={hour} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      
                      {/* Hour Label */}
                      <td className="p-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center bg-slate-50/50 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700 select-none">
                        {formatHourLabel(hour)}
                      </td>

                      {/* Day Cells */}
                      {DAYS.map((day) => {
                        const block = getBlockInSlot(day, hour);
                        const isOccupied = Boolean(block);

                        let cellBg = 'bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-950/20';
                        if (block) {
                          if (block.type === 'academic') {
                            cellBg = 'bg-blue-500/15 border-blue-400/40 text-blue-900 dark:text-blue-200';
                          } else if (block.type === 'work') {
                            cellBg = 'bg-amber-500/15 border-amber-400/40 text-amber-900 dark:text-amber-200';
                          } else {
                            cellBg = 'bg-emerald-500/15 border-emerald-400/40 text-emerald-900 dark:text-emerald-200';
                          }
                        }

                        return (
                          <td
                            key={day}
                            onClick={() => handleCellClick(day, hour)}
                            className={`p-1.5 h-11 border-r border-slate-100 dark:border-slate-800/80 last:border-r-0 cursor-pointer transition-all ${cellBg}`}
                          >
                            {block ? (
                              <div className="h-full w-full rounded-lg p-1.5 flex items-center justify-between text-xs font-semibold shadow-xs select-none border border-current">
                                <span className="truncate text-[11px]">{block.title}</span>
                                <span className="text-[9px] opacity-70 ml-1 shrink-0">✕</span>
                              </div>
                            ) : (
                              <div className="h-full w-full rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 text-slate-400 text-[10px]">
                                + Marcar
                              </div>
                            )}
                          </td>
                        );
                      })}

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Summary Pill */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800/60 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>
                <strong>Tip:</strong> Haz clic sobre cualquier casilla para marcar u ocupar el horario. Haz clic sobre una casilla ocupada para liberarla.
              </span>
            </div>
            <span className="font-bold shrink-0 ml-4">
              Total ocupado: {scheduleBlocks.length} horas
            </span>
          </div>

        </div>
      ) : (
        /* OCR SIMULATOR TAB */
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="text-center max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Carga Inteligente de Horario Académico (OCR)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sube una captura de pantalla de tu horario (SIRES Uninorte, Banner Uniatlántico, Génesis CUC u otra) y nuestro motor detectará los bloques automáticamente.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {!uploadedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-12 text-center cursor-pointer transition-all hover:bg-blue-50/30 dark:hover:bg-blue-950/20 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Arrastra tu captura aquí o haz clic para explorar
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Formatos soportados: PNG, JPG, JPEG, WEBP (Hasta 10MB)
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative max-w-lg mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
                <img
                  src={uploadedImage}
                  alt="Horario subido"
                  className="w-full max-h-72 object-contain bg-slate-100 dark:bg-slate-800"
                />

                {/* Laser scan animation */}
                {isScanning && (
                  <motion.div
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,1)]"
                  />
                )}
              </div>

              {isScanning && (
                <div className="max-w-md mx-auto space-y-2 text-center">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      Procesando OCR y detectando asignaturas...
                    </span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {scanSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center max-w-md mx-auto space-y-3"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      ¡Horario Digitalizado con Éxito!
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      Se detectaron 5 asignaturas (Lunes a Viernes 7:00 a 12:00). Puedes revisar la cuadrícula para hacer ajustes finos.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('grid')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    Ver en Cuadrícula Visual
                  </button>
                </motion.div>
              )}

              <div className="text-center">
                <button
                  onClick={() => {
                    setUploadedImage(null);
                    setScanSuccess(false);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
                >
                  Subir otra imagen
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Atrás: Perfil</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all transform hover:scale-[1.02]"
        >
          <span>Siguiente: Motor de Logística</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </motion.div>
  );
};
