'use client';

import React, { useState, useRef } from 'react';
import { usePracticeStore } from '@/store/usePracticeStore';
import { parseExcelOrCsvFile } from '@/lib/excelParser';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Database,
  Download
} from 'lucide-react';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose
}) => {
  const { allRecords, setAllRecords } = usePracticeStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setSuccessCount(null);
    setIsProcessing(true);

    try {
      const records = await parseExcelOrCsvFile(file);
      if (records.length === 0) {
        throw new Error('No se encontraron registros válidos en el archivo subido.');
      }
      setAllRecords(records);
      setSuccessCount(records.length);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el archivo Excel / CSV.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Gestor de Base de Datos IED</h2>
              <p className="text-emerald-100 text-xs">
                Actualmente cargados: {allRecords.length} grupos IED
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-xs">
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              {isProcessing ? (
                <RefreshCw className="w-7 h-7 animate-spin" />
              ) : (
                <UploadCloud className="w-7 h-7" />
              )}
            </div>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {isProcessing ? 'Procesando archivo...' : 'Arrastra tu archivo Base datos IED (.xlsx / .csv)'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Esquema esperado: Columnas IED, ESTRATEGIA, GRADO GENERAL, GRUPO, HORARIO, TUTOR...
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successCount !== null && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>¡Base de datos actualizada con éxito! {successCount} registros importados.</span>
            </div>
          )}

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              Resumen de la Base Actual
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Total Registros:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{allRecords.length} grupos</span>
              </div>
              <div>
                <span className="text-slate-400 block">Colegios IED:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">115 instituciones</span>
              </div>
              <div>
                <span className="text-slate-400 block">Cobertura:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">Barranquilla, Soledad, Pto Colombia</span>
              </div>
              <div>
                <span className="text-slate-400 block">Grados:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">4°, 5°, 9°, 10°</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300"
          >
            Aceptar y Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
