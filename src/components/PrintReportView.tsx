import React from 'react';
import { FINDINGS, SCOPE_ITEMS, RETEST_MATRIX, PENTEST_METADATA } from '../data/pentestData';

interface PrintReportViewProps {
  lang: 'fr' | 'en';
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({ lang }) => {
  const isFr = lang === 'fr';

  return (
    <div className="print-only hidden font-serif text-slate-900 bg-white p-8 max-w-4xl mx-auto space-y-8">
      {/* Print Cover Header */}
      <div className="border-b-2 border-slate-900 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block">
              {PENTEST_METADATA.program}
            </span>
            <h1 className="text-3xl font-extrabold mt-1 text-slate-950">
              Rapport d'Audit de Sécurité Web (Pentest)
            </h1>
            <h2 className="text-xl text-slate-700 font-medium mt-1">
              {PENTEST_METADATA.projectNumber} : {PENTEST_METADATA.projectTitle}
            </h2>
          </div>
          <div className="text-right text-xs text-slate-600 font-mono">
            <div>Classification : CONFIDENTIEL</div>
            <div>Date : {PENTEST_METADATA.completionDate}</div>
            <div>Cible : {PENTEST_METADATA.targetApplication}</div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-950 border-b border-slate-300 pb-1">
          1. Résumé Exécutif & Statut de Re-test
        </h2>
        <p className="text-sm leading-relaxed text-slate-800">
          Un test d'intrusion applicatif autorisé a été conduit contre l'instance isolée OWASP Juice Shop.
          Trois vulnérabilités significatives ont été identifiées : une Injection SQL (CVSS 7.5), un Contrôle d'Accès Brisé / IDOR (CVSS 8.5), et une Traversée de Répertoire / Exposition FTP (CVSS 5.3).
          L'ensemble des vulnérabilités a fait l'objet de correctifs au niveau du code source et a été validé à 100% lors de la phase de re-test contradictoire.
        </p>

        <div className="border border-slate-300 rounded p-4 bg-slate-50 text-xs">
          <strong>Score Global de Résolution :</strong> 3 / 3 Vulnérabilités Corrigées (Taux de succès : 100%)
        </div>
      </section>

      {/* Scope */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-950 border-b border-slate-300 pb-1">
          2. Périmètre d'Audit & Règles d'Engagement
        </h2>
        <table className="w-full text-xs text-left border border-slate-300">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300">
              <th className="p-2">Cible</th>
              <th className="p-2">Type</th>
              <th className="p-2">Statut</th>
              <th className="p-2">Remarques</th>
            </tr>
          </thead>
          <tbody>
            {SCOPE_ITEMS.map((item, i) => (
              <tr key={i} className="border-b border-slate-200">
                <td className="p-2 font-mono font-medium">{item.target}</td>
                <td className="p-2">{item.type}</td>
                <td className="p-2 font-bold">{item.inScope ? 'In-Scope' : 'Out-of-Scope'}</td>
                <td className="p-2 text-slate-600">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Findings */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-950 border-b border-slate-300 pb-1">
          3. Fiches Détaillées des Vulnérabilités (Findings)
        </h2>

        {FINDINGS.map((f) => (
          <div key={f.id} className="border border-slate-300 rounded p-4 space-y-3 page-break-inside-avoid">
            <div className="flex justify-between items-baseline">
              <h3 className="text-base font-bold text-slate-950">
                {f.id} : {f.title}
              </h3>
              <span className="text-xs font-mono font-bold bg-slate-200 px-2 py-0.5 rounded">
                CVSS v3.1 : {f.cvss.score} ({f.severity})
              </span>
            </div>

            <div className="text-xs text-slate-600">
              <strong>Composant :</strong> {f.affectedComponent} | <strong>OWASP :</strong> {f.owaspCategory}
            </div>

            <div className="text-xs text-slate-800 space-y-2">
              <p><strong>Description :</strong> {f.description}</p>
              <p><strong>Cause racine :</strong> {f.rootCause}</p>
              <p><strong>Impact :</strong> {f.impact}</p>
              <p><strong>Remédiation :</strong> {f.remediation}</p>
              <p><strong>Validation Re-test :</strong> {f.retestDetails}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Retest Table */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-950 border-b border-slate-300 pb-1">
          4. Synthèse de Re-test
        </h2>
        <table className="w-full text-xs text-left border border-slate-300">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300">
              <th className="p-2">ID</th>
              <th className="p-2">Intitulé</th>
              <th className="p-2">Statut Initial</th>
              <th className="p-2">Après Retest</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {RETEST_MATRIX.map((r) => (
              <tr key={r.id} className="border-b border-slate-200">
                <td className="p-2 font-mono font-bold">{r.id}</td>
                <td className="p-2">{r.title}</td>
                <td className="p-2">{r.initialStatus}</td>
                <td className="p-2 font-bold text-emerald-800">{r.retestStatus}</td>
                <td className="p-2 font-mono">{r.retestDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Sign-off */}
      <div className="pt-8 border-t border-slate-300 flex justify-between text-xs text-slate-600">
        <div>
          <div>Auditeur : <strong>Stagiaire Ethical Hacking</strong></div>
          <div>Programme : {PENTEST_METADATA.program}</div>
        </div>
        <div className="text-right">
          <div>Mention : <strong>Conforme & Validé 100/100</strong></div>
          <div>Date d'émission : {PENTEST_METADATA.completionDate}</div>
        </div>
      </div>
    </div>
  );
};
