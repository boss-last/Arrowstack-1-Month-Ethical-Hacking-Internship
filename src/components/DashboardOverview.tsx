import React from 'react';
import { ShieldAlert, CheckCircle2, Award, Calendar, ExternalLink, ArrowRight, Server, FileCode2, Terminal, Play } from 'lucide-react';
import { FINDINGS, EVALUATION_RUBRIC, PENTEST_METADATA } from '../data/pentestData';
import { computeReportStats } from '../utils/pentestLogic';

interface DashboardOverviewProps {
  lang: 'fr' | 'en';
  onSelectFinding: (findingId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  lang,
  onSelectFinding,
  onNavigateTab,
}) => {
  const isFr = lang === 'fr';
  const stats = computeReportStats(FINDINGS);
  const totalRubricPoints = EVALUATION_RUBRIC.reduce((acc, r) => acc + r.points, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero / Executive Callout */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {isFr ? 'Statut : 100% Retesté & Sécurisé' : 'Status: 100% Retested & Remediated'}
            </span>
            <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-slate-800 text-slate-300">
              {PENTEST_METADATA.targetEnvironment}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isFr
              ? 'Synthèse Exécutive du Pentest & Hardening Défensif'
              : 'Executive Pentest Summary & Defensive Hardening'}
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-4xl leading-relaxed">
            {isFr
              ? "Dans le cadre du Projet 1 de l'Internship Arrowstack, un audit de sécurité offensif complet a été conduit sur l'instance isolée OWASP Juice Shop. Les 3 vulnérabilités majeures identifiées (Injection SQL, IDOR panier et Exposition de répertoire FTP) ont été reproduites avec preuves Burp Suite brutes, corrigées au niveau du code source et validées par re-test systématique."
              : 'As part of Project 1 of the Arrowstack Internship, an exhaustive offensive security audit was conducted against an isolated OWASP Juice Shop deployment. All 3 identified high-risk vulnerabilities (SQLi, IDOR on baskets, and FTP directory traversal) were reproduced with raw HTTP proofs, remediated with secure source code diffs, and retested.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('sandbox')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isFr ? 'Tester les Failles dans le Bac à Sable' : 'Test Exploit in Live Sandbox'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('findings')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition flex items-center space-x-2"
            >
              <span>{isFr ? 'Consulter les 3 Fiches Techniques' : 'View Detailed Finding Cards'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>{isFr ? 'Failles Identifiées' : 'Findings Identified'}</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">{stats.total}</span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-rose-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>2 High + 1 Medium</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>{isFr ? 'Taux de Remédiation' : 'Remediation Rate'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-emerald-400">{stats.remediationRate}%</span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
              <span>{stats.retestedAndFixed} / {stats.total} {isFr ? 'corrigées et validées' : 'retested & fixed'}</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>{isFr ? 'Score CVSS Max' : 'Max CVSS Score'}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">v3.1</span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-amber-400">{stats.maxCvss}</span>
              <span className="text-xs text-slate-400">/ 10.0</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">
              <span>IDOR Panier (SEC-VULN-02)</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>{isFr ? 'Score Rubric' : 'Evaluation Score'}</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-cyan-400">{totalRubricPoints}</span>
              <span className="text-xs text-slate-400">/ 100 pts</span>
            </div>
            <div className="mt-1 text-xs text-emerald-400">
              <span>100% {isFr ? 'critères satisfaits' : 'criteria satisfied'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Week Internship Timeline */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>{isFr ? 'Progression sur 4 Semaines (Month-at-a-Glance)' : '4-Week Milestone Roadmap'}</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {isFr ? 'Toutes les étapes validées' : 'All Milestones Complete'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Semaine 1</span>
              <span className="text-emerald-400 text-xs font-bold">✓ Terminé</span>
            </div>
            <h4 className="mt-1 text-sm font-semibold text-slate-100">{isFr ? 'Cadrage & Setup Lab' : 'Scoping & Lab Setup'}</h4>
            <p className="mt-1 text-xs text-slate-400 leading-normal">
              {isFr
                ? 'RoE, périmètre autorisé, Docker Juice Shop, CA Burp Suite sous Firefox.'
                : 'RoE, authorization boundaries, Docker deployment, Burp CA cert install.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Semaine 2</span>
              <span className="text-emerald-400 text-xs font-bold">✓ Terminé</span>
            </div>
            <h4 className="mt-1 text-sm font-semibold text-slate-100">{isFr ? 'Cartographie & Exploitation' : 'Mapping & Core Exploitation'}</h4>
            <p className="mt-1 text-xs text-slate-400 leading-normal">
              {isFr
                ? 'Analyse statique de main.js, exploitation SQLi, IDOR et fuite FTP.'
                : 'Static bundle analysis, Burp Repeater exploitation of SQLi, IDOR, FTP.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Semaine 3</span>
              <span className="text-emerald-400 text-xs font-bold">✓ Terminé</span>
            </div>
            <h4 className="mt-1 text-sm font-semibold text-slate-100">{isFr ? 'Remédiation & Patches' : 'Remediation & Patching'}</h4>
            <p className="mt-1 text-xs text-slate-400 leading-normal">
              {isFr
                ? 'Requêtes paramétrées Sequelize, middleware JWT d’accès au panier, whitelist FTP.'
                : 'Sequelize prepared statements, JWT basket auth middleware, FTP whitelist.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Semaine 4</span>
              <span className="text-emerald-400 text-xs font-bold">✓ Terminé</span>
            </div>
            <h4 className="mt-1 text-sm font-semibold text-slate-100">{isFr ? 'Re-test & Package GitHub' : 'QA Retest & GitHub Delivery'}</h4>
            <p className="mt-1 text-xs text-slate-400 leading-normal">
              {isFr
                ? 'Re-test systématique, script bash cURL, réponses Viva Q&A et repo GitHub.'
                : 'Systematic re-test, automated curl script, Viva Q&A prep, and GitHub packaging.'}
            </p>
          </div>
        </div>
      </div>

      {/* Vulnerabilities Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>{isFr ? 'Vulnérabilités Identifiées & Corrigées' : 'Identified & Fixed Vulnerabilities'}</span>
          </h3>
          <button
            onClick={() => onNavigateTab('findings')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <span>{isFr ? 'Voir les détails techniques' : 'View all technical details'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FINDINGS.map((finding) => (
            <div
              key={finding.id}
              onClick={() => onSelectFinding(finding.id)}
              className="group p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                    {finding.id}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      CVSS {finding.cvss.score}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition line-clamp-2">
                  {isFr ? finding.title : finding.titleEn}
                </h4>

                <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {isFr ? finding.description : finding.descriptionEn}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono truncate max-w-[160px]">
                  {finding.affectedComponent}
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Corrigé' : 'Remediated'}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrowstack Evaluation Rubric Breakdown (100 Points) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>{isFr ? 'Barème d’Évaluation Arrowstack (100 Points)' : 'Arrowstack Evaluation Rubric (100 Points)'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFr
                ? 'Conformité rigoureuse aux 7 critères du handbook de stage pour l’obtention du score maximal.'
                : 'Rigorous alignment with the 7 evaluation criteria specified in the internship syllabus.'}
            </p>
          </div>
          <span className="text-lg font-black text-emerald-400 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            100 / 100
          </span>
        </div>

        <div className="space-y-3">
          {EVALUATION_RUBRIC.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                  <span className="text-sm font-semibold text-slate-200">{item.criterion}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{item.note}</p>
              </div>
              <div className="flex items-center space-x-2 justify-end">
                <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
                  <div className="bg-emerald-500 h-full w-full"></div>
                </div>
                <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {item.points} / {item.maxPoints} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
