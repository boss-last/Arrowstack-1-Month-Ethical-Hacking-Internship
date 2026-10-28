import React, { useState } from 'react';
import {
  ShieldAlert,
  Copy,
  Check,
  CheckCircle2,
  FileCode2,
  AlertTriangle,
  ArrowRight,
  Code2,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { FINDINGS } from '../data/pentestData';
import { Finding } from '../types/pentest';

interface FindingsViewProps {
  lang: 'fr' | 'en';
  selectedFindingId: string;
  setSelectedFindingId: (id: string) => void;
  onNavigateToSandbox: () => void;
}

export const FindingsView: React.FC<FindingsViewProps> = ({
  lang,
  selectedFindingId,
  setSelectedFindingId,
  onNavigateToSandbox,
}) => {
  const isFr = lang === 'fr';
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeBurpTab, setActiveBurpTab] = useState<'request' | 'response'>('request');

  const finding: Finding =
    FINDINGS.find((f) => f.id === selectedFindingId) || FINDINGS[0];

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Section 3 — {isFr ? 'Fiches Détaillées de Vulnérabilités' : 'Detailed Vulnerability Findings'}</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            {isFr ? 'Rapport Technique des Failles Détectées & Corrigées' : 'Offensive Findings & Defensive Remediations'}
          </h2>
        </div>

        <button
          onClick={onNavigateToSandbox}
          className="self-start sm:self-auto px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition flex items-center space-x-1.5"
        >
          <span>{isFr ? 'Tester dans le simulateur PoC' : 'Test in Live PoC Sandbox'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Finding Selector Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {FINDINGS.map((f) => {
          const isSelected = f.id === finding.id;
          return (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFindingId(f.id);
                setActiveBurpTab('request');
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                isSelected
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  f.severity === 'Critical'
                    ? 'bg-rose-500'
                    : f.severity === 'High'
                    ? 'bg-orange-500'
                    : 'bg-amber-400'
                }`}
              ></span>
              <span className="font-mono font-bold">{f.id}</span>
              <span className="hidden md:inline text-slate-300">
                — {f.id === 'SEC-VULN-01' ? 'SQL Injection' : f.id === 'SEC-VULN-02' ? 'IDOR Basket' : 'Path Traversal'}
              </span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">
                {f.cvss.score}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Finding Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        {/* Finding Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-black px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                {finding.id}
              </span>
              <span
                className={`text-xs font-black px-2.5 py-1 rounded border ${
                  finding.severity === 'High'
                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {finding.severity.toUpperCase()} (CVSS v3.1 : {finding.cvss.score})
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
                {finding.owaspCategory}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isFr ? 'Statut : 100% Corrigé' : 'Status: 100% Remediated'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isFr ? finding.title : finding.titleEn}
            </h3>
            <p className="text-xs sm:text-sm font-mono text-cyan-400 mt-1">
              {isFr ? 'Composant affecté :' : 'Affected Component:'} {finding.affectedComponent}
            </p>
          </div>

          {/* CVSS Vector String Badge */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
              CVSS v3.1 Vector String
            </span>
            <div className="flex items-center space-x-2">
              <code className="text-amber-300 font-bold break-all">{finding.cvss.vectorString}</code>
              <button
                onClick={() => copyText(finding.cvss.vectorString, 'vector')}
                className="p-1 text-slate-400 hover:text-white transition"
                title="Copier le vecteur CVSS"
              >
                {copiedSection === 'vector' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Description & Root Cause */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="text-xs uppercase font-bold text-slate-400 mb-1">
              {isFr ? 'Description Technique' : 'Technical Description'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isFr ? finding.description : finding.descriptionEn}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="text-xs uppercase font-bold text-amber-400 mb-1">
              {isFr ? 'Cause Racine (Root Cause Analysis)' : 'Root Cause Analysis'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isFr ? finding.rootCause : finding.rootCauseEn}
            </p>
          </div>
        </div>

        {/* Step-by-Step Reproduction Guide */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>{isFr ? 'Procédure de Reproduction Pas-à-Pas (PoC)' : 'Step-by-Step Proof of Concept'}</span>
          </h4>
          <ol className="space-y-2 text-xs sm:text-sm text-slate-300">
            {(isFr ? finding.reproductionSteps : finding.reproductionStepsEn).map((step, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span className="mt-0.5 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Burp Suite Raw Evidence (HTTP Request / Response Viewer) */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase text-orange-400">
                Burp Suite Proxy Evidence
              </span>
              <span className="text-[10px] text-slate-500 font-mono">127.0.0.1:8080 Intercept</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setActiveBurpTab('request')}
                  className={`px-3 py-1 rounded-md transition ${
                    activeBurpTab === 'request'
                      ? 'bg-slate-800 text-cyan-300 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  HTTP Request
                </button>
                <button
                  onClick={() => setActiveBurpTab('response')}
                  className={`px-3 py-1 rounded-md transition ${
                    activeBurpTab === 'response'
                      ? 'bg-slate-800 text-emerald-300 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  HTTP Response (Leak Proof)
                </button>
              </div>

              <button
                onClick={() =>
                  copyText(
                    activeBurpTab === 'request' ? finding.rawRequest : finding.rawResponse,
                    'burp'
                  )
                }
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center space-x-1"
              >
                {copiedSection === 'burp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'burp' ? (isFr ? 'Copié !' : 'Copied!') : (isFr ? 'Copier' : 'Copy')}</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-black font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800/80 leading-relaxed max-h-72">
            {activeBurpTab === 'request' ? finding.rawRequest : finding.rawResponse}
          </pre>
        </div>

        {/* Impact Analysis */}
        <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-900/40">
          <h4 className="text-sm font-bold text-rose-300 mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{isFr ? 'Impact Métier & Risque Opérationnel' : 'Business & Security Impact'}</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isFr ? finding.impact : finding.impactEn}
          </p>
        </div>

        {/* Side-by-Side Code Diff (Vulnerable vs Remediated) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>{isFr ? 'Comparatif de Code Source : Vulnérable vs Sécurisé' : 'Source Code Diff: Vulnerable vs Patched'}</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">TypeScript / Express</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Vulnerable Code Card */}
            <div className="rounded-xl overflow-hidden border border-rose-900/50 bg-slate-950">
              <div className="px-4 py-2 bg-rose-950/40 border-b border-rose-900/50 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  {isFr ? 'Code Vulnérable (Avant Audit)' : 'Vulnerable Implementation'}
                </span>
                <span className="text-[10px] text-rose-400 font-mono">Laxisme / Concaténation</span>
              </div>
              <pre className="p-4 font-mono text-xs text-rose-200/90 overflow-x-auto leading-relaxed max-h-80">
                {finding.vulnerableCode}
              </pre>
            </div>

            {/* Remediated Code Card */}
            <div className="rounded-xl overflow-hidden border border-emerald-900/50 bg-slate-950">
              <div className="px-4 py-2 bg-emerald-950/40 border-b border-emerald-900/50 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {isFr ? 'Code Sécurisé (Patch Validé)' : 'Remediated Patch'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Prepared Stmts / AuthZ</span>
              </div>
              <pre className="p-4 font-mono text-xs text-emerald-200/90 overflow-x-auto leading-relaxed max-h-80">
                {finding.remediatedCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Retest Verification Footer */}
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-emerald-400 block">
                {isFr ? 'Validation du Re-test (Semaine 4)' : 'Retest Validation'}
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                {isFr ? finding.retestDetails : finding.retestDetailsEn}
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
            Signé : <strong className="text-slate-200">Stagiaire Pentest</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
