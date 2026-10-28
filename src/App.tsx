/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { ScopeAndSetupView } from './components/ScopeAndSetupView';
import { ReconnaissanceView } from './components/ReconnaissanceView';
import { FindingsView } from './components/FindingsView';
import { InteractivePoCSandbox } from './components/InteractivePoCSandbox';
import { RetestSummaryView } from './components/RetestSummaryView';
import { VivaPrepView } from './components/VivaPrepView';
import { GitHubExportModal } from './components/GitHubExportModal';
import { PrintReportView } from './components/PrintReportView';
import { Shield, Github, FileText, CheckCircle2, AlertOctagon } from 'lucide-react';
import { PENTEST_METADATA } from './data/pentestData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [selectedFindingId, setSelectedFindingId] = useState<string>('SEC-VULN-01');
  const [isGithubModalOpen, setIsGithubModalOpen] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSelectFindingFromDashboard = (findingId: string) => {
    setSelectedFindingId(findingId);
    setActiveTab('findings');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Screen Presentation View */}
      <div className="screen-only flex-1 flex flex-col">
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          setLang={setLang}
          onOpenGithubModal={() => setIsGithubModalOpen(true)}
          onPrintReport={handlePrint}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              lang={lang}
              onSelectFinding={handleSelectFindingFromDashboard}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'scope' && <ScopeAndSetupView lang={lang} />}

          {activeTab === 'recon' && <ReconnaissanceView lang={lang} />}

          {activeTab === 'findings' && (
            <FindingsView
              lang={lang}
              selectedFindingId={selectedFindingId}
              setSelectedFindingId={setSelectedFindingId}
              onNavigateToSandbox={() => setActiveTab('sandbox')}
            />
          )}

          {activeTab === 'sandbox' && <InteractivePoCSandbox lang={lang} />}

          {activeTab === 'retest' && <RetestSummaryView lang={lang} />}

          {activeTab === 'viva' && <VivaPrepView lang={lang} />}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-slate-300 font-semibold">{PENTEST_METADATA.program}</span>
                <span className="mx-2 text-slate-700">•</span>
                <span>Projet 1 : Authorized Web Pentest Lab</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsGithubModalOpen(true)}
                className="text-slate-400 hover:text-emerald-400 transition flex items-center space-x-1"
              >
                <Github className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Dépôt GitHub' : 'GitHub Repo'}</span>
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={handlePrint}
                className="text-slate-400 hover:text-emerald-400 transition flex items-center space-x-1"
              >
                <FileText className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Imprimer / PDF' : 'Print PDF'}</span>
              </button>
            </div>

            <div className="text-slate-600 font-mono text-[11px]">
              {lang === 'fr' ? 'Lab Isolé Éthique & Légal — OWASP Juice Shop' : 'Authorized Local Lab Only — OWASP Juice Shop'}
            </div>
          </div>
        </footer>
      </div>

      {/* Printable Report (rendered when window.print is called) */}
      <PrintReportView lang={lang} />

      {/* GitHub Repository Package Modal */}
      <GitHubExportModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
