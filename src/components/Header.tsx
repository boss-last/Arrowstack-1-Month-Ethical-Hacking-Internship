import React from 'react';
import { Shield, Terminal, Download, FileText, Globe, CheckCircle2, Github, PlayCircle } from 'lucide-react';
import { PENTEST_METADATA } from '../data/pentestData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'fr' | 'en';
  setLang: (lang: 'fr' | 'en') => void;
  onOpenGithubModal: () => void;
  onPrintReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onOpenGithubModal,
  onPrintReport,
}) => {
  const isFr = lang === 'fr';

  const navItems = [
    { id: 'dashboard', label: isFr ? 'Tableau de Bord' : 'Dashboard', icon: Shield },
    { id: 'scope', label: isFr ? 'Périmètre & Setup' : 'Scope & Setup', icon: Terminal },
    { id: 'recon', label: isFr ? 'Reconnaissance' : 'Reconnaissance', icon: Globe },
    { id: 'findings', label: isFr ? 'Vulnérabilités (3)' : 'Findings (3)', icon: FileText },
    { id: 'sandbox', label: isFr ? 'PoC Interactif' : 'Live PoC Sandbox', icon: PlayCircle },
    { id: 'retest', label: isFr ? 'Synthèse Re-test' : 'Retest Summary', icon: CheckCircle2 },
    { id: 'viva', label: isFr ? 'Questions Viva' : 'Viva Prep (Q&A)', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top Banner with Metadata & Primary CTAs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {PENTEST_METADATA.program}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {PENTEST_METADATA.projectNumber}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {isFr ? 'Rapport de Pentest Web' : 'Web Pentest Assessment'}
                <span className="text-slate-400 font-normal text-sm hidden sm:inline">
                  — {PENTEST_METADATA.targetApplication}
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Info & Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
            {/* Lang Switch */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition flex items-center space-x-1"
              title="Changer de langue / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Print / PDF Export */}
            <button
              onClick={onPrintReport}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{isFr ? 'Exporter PDF / Print' : 'Export PDF / Print'}</span>
            </button>

            {/* GitHub Repo Package Modal */}
            <button
              onClick={onOpenGithubModal}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition flex items-center space-x-1.5"
            >
              <Github className="w-4 h-4" />
              <span>{isFr ? 'Package GitHub' : 'GitHub Repo Package'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
