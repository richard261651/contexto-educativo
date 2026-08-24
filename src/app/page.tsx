'use client';

import React, { useState } from 'react';
import { usePracticeStore } from '@/store/usePracticeStore';
import { Navbar } from '@/components/Navbar';
import { Step1Profile } from '@/components/Step1Profile';
import { Step2Schedule } from '@/components/Step2Schedule';
import { Step3MatchingAnalysis } from '@/components/Step3MatchingAnalysis';
import { Step4Dashboard } from '@/components/Step4Dashboard';
import { SchoolDetailsModal } from '@/components/SchoolDetailsModal';
import { PracticeCertificateModal } from '@/components/PracticeCertificateModal';
import { CompareModal } from '@/components/CompareModal';
import { ExcelUploadModal } from '@/components/ExcelUploadModal';
import { StatsCards } from '@/components/StatsCards';
import { Footer } from '@/components/Footer';
import { IEDRecord, MatchResult } from '@/types/ied';
import { AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const { currentStep, userProfile, selectedRecord, selectRecord } = usePracticeStore();

  // Modals state
  const [selectedMatchForDetails, setSelectedMatchForDetails] = useState<MatchResult | null>(null);
  const [selectedRecordForCert, setSelectedRecordForCert] = useState<IEDRecord | null>(null);
  const [selectedMatchForCert, setSelectedMatchForCert] = useState<MatchResult | undefined>(undefined);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  const handleOpenCertificate = (record: IEDRecord, match?: MatchResult) => {
    selectRecord(record);
    setSelectedRecordForCert(record);
    setSelectedMatchForCert(match);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-grid-pattern">
      
      {/* Top Navbar */}
      <Navbar
        onOpenExcelModal={() => setIsExcelModalOpen(true)}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Summary Stats */}
        <StatsCards />

        {/* Dynamic Wizard Steps */}
        <div className="transition-all duration-300">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <Step1Profile key="step1" />}
            {currentStep === 2 && <Step2Schedule key="step2" />}
            {currentStep === 3 && <Step3MatchingAnalysis key="step3" />}
            {currentStep === 4 && (
              <Step4Dashboard
                key="step4"
                onOpenDetailsModal={(match) => setSelectedMatchForDetails(match)}
                onOpenCertificateModal={(record, match) => handleOpenCertificate(record, match)}
                onOpenCompareModal={() => setIsCompareModalOpen(true)}
              />
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Footer */}
      <Footer />

      {/* MODALS */}
      {/* 1. School Details Modal */}
      <SchoolDetailsModal
        match={selectedMatchForDetails}
        onClose={() => setSelectedMatchForDetails(null)}
        onSelect={(record) => {
          if (selectedMatchForDetails) {
            handleOpenCertificate(record, selectedMatchForDetails);
          }
        }}
      />

      {/* 2. Practice Assignment Certificate Modal (PDF) */}
      <PracticeCertificateModal
        record={selectedRecordForCert}
        user={userProfile}
        match={selectedMatchForCert}
        onClose={() => setSelectedRecordForCert(null)}
      />

      {/* 3. Compare Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onSelect={(record) => {
          handleOpenCertificate(record);
        }}
      />

      {/* 4. Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
      />

    </div>
  );
}
