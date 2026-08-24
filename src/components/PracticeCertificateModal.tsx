'use client';

import React, { useEffect } from 'react';
import { IEDRecord, UserProfile, MatchResult } from '@/types/ied';
import { generatePracticeCertificatePDF } from '@/lib/pdfGenerator';
import { UNIVERSITIES } from '@/data/barranquilla_geo';
import confetti from 'canvas-confetti';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Printer, 
  Share2, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Award,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';

interface PracticeCertificateModalProps {
  record: IEDRecord | null;
  user: UserProfile;
  match?: MatchResult;
  onClose: () => void;
}

export const PracticeCertificateModal: React.FC<PracticeCertificateModalProps> = ({
  record,
  user,
  match,
  onClose
}) => {
  useEffect(() => {
    if (record) {
      // Trigger festive confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [record]);

  if (!record) return null;

  const uniObj = UNIVERSITIES.find(u => u.id === user.university || u.name === user.university);
  const uniName = uniObj?.name || user.university;
  const verificationCode = `IED-BAQ-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${record.id}`;

  const handleDownload = () => {
    generatePracticeCertificatePDF(record, user, match);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
              Asignación Logística Exitosa
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400 text-yellow-950 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Afinidad: {match?.score || 95}%
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight">
            Comprobante de Práctica Docente
          </h2>
          <p className="text-emerald-100 text-xs mt-1">
            Generado para radicación ante la Coordinación Académica de {uniName}
          </p>
        </div>

        {/* Certificate Paper Preview */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950/60">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 text-xs font-sans">
            
            {/* Certificate Header */}
            <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                Distrito Especial, Industrial y Portuario de Barranquilla
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                SECRETARÍA DISTRITAL DE EDUCACIÓN • PRÁCTICAS DOCENTES
              </h3>
              <p className="text-[11px] text-slate-500">
                Constancia de Viabilidad Horaria y Asignación de IED
              </p>
              <div className="inline-block mt-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                RADICADO: {verificationCode}
              </div>
            </div>

            {/* Section 1: Estudiante */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-blue-600 dark:text-blue-400">
                1. Información del Practicante
              </h4>
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">Estudiante:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{user.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Código Estudiantil:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{user.studentCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Universidad:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{uniName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Programa / Semestre:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.program} ({user.semester})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Contacto:</span>
                  <span className="text-slate-700 dark:text-slate-300">{user.phone} • {user.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Residencia:</span>
                  <span className="text-slate-700 dark:text-slate-300">{user.residenceNeighborhood} ({user.residenceLocality})</span>
                </div>
              </div>
            </div>

            {/* Section 2: IED */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-emerald-600 dark:text-emerald-400">
                2. Institución Educativa Distrital Seleccionada
              </h4>
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Institución:</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{record.ied}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Grado y Grupo:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Grado {record.gradoGeneral} • Grupo {record.grupo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Estrategia:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{record.estrategia}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Horario Oficial:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{record.horario}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Localidad:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{record.localidad}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Dirección Sede:</span>
                  <span className="text-slate-700 dark:text-slate-300">{record.direccion} (Fila Base #{record.filaExcel})</span>
                </div>
              </div>
            </div>

            {/* Section 3: Contactos */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-purple-600 dark:text-purple-400">
                3. Equipo Directivo y Tutoría
              </h4>
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Tutor Asignado:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{record.tutor} {record.celularTutor ? `(${record.celularTutor})` : ''}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Rector(a):</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{record.rector || 'Directiva IED'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Coordinación:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{record.coordinador || 'Coordinación'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Docente Titular:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{record.docenteTitular || record.leadTeacher || 'Docente Titular'}</span>
                </div>
              </div>
            </div>

            {/* Signatures Preview */}
            <div className="pt-8 grid grid-cols-3 gap-4 text-center border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="h-10 border-b border-dashed border-slate-400 mx-4" />
                <p className="font-bold text-slate-800 dark:text-slate-200 text-[10px]">Firma Practicante</p>
                <p className="text-[9px] text-slate-400">{user.fullName}</p>
              </div>
              <div className="space-y-1">
                <div className="h-10 border-b border-dashed border-slate-400 mx-4" />
                <p className="font-bold text-slate-800 dark:text-slate-200 text-[10px]">Coord. Prácticas</p>
                <p className="text-[9px] text-slate-400">{uniName}</p>
              </div>
              <div className="space-y-1">
                <div className="h-10 border-b border-dashed border-slate-400 mx-4" />
                <p className="font-bold text-slate-800 dark:text-slate-200 text-[10px]">Sello Recibido IED</p>
                <p className="text-[9px] text-slate-400">{record.ied.substring(0, 20)}...</p>
              </div>
            </div>

          </div>
        </div>

        {/* Action Bar */}
        <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(verificationCode);
                alert(`Código de radicación ${verificationCode} copiado al portapapeles.`);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Copiar Radicado</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cerrar
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all transform hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Comprobante Oficial (PDF)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
