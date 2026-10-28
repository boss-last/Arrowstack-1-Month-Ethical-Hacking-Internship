import React, { useState } from 'react';
import { Terminal, Shield, Check, Copy, AlertTriangle, Layers, Laptop, Globe, Cpu } from 'lucide-react';
import { SCOPE_ITEMS, PENTEST_METADATA } from '../data/pentestData';

interface ScopeAndSetupViewProps {
  lang: 'fr' | 'en';
}

export const ScopeAndSetupView: React.FC<ScopeAndSetupViewProps> = ({ lang }) => {
  const isFr = lang === 'fr';
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const dockerCommand = `# 1. Récupération et instanciation du conteneur isolé
docker pull bkimminich/juice-shop:latest
docker run -d -p 3000:3000 --name juice-shop-lab bkimminich/juice-shop

# 2. Vérification de l'état du conteneur
docker ps --filter "name=juice-shop-lab"
curl -I http://127.0.0.1:3000`;

  const burpProxySetup = `# 1. Démarrer Burp Suite Community Edition sur Kali Linux
# 2. Naviguer dans Proxy > Proxy Settings > Proxy Listeners
# Vérifier l'écoute sur 127.0.0.1:8080 (Running = checked)

# 3. Exporter le certificat CA de Burp :
# Ouvrir le navigateur vers http://burp -> Cliquer sur 'CA Certificate' (cacert.der)

# 4. Dans Firefox Developer Edition :
# Settings > Privacy & Security > Certificates > View Certificates...
# Importer 'cacert.der' dans l'onglet 'Authorities'
# Cocher : 'Trust this CA to identify websites'`;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Introduction */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          <span>Section 1 — {isFr ? 'Cadre d’Engagement & Reproductibilité' : 'Scope & Lab Setup'}</span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          {isFr ? 'Périmètre d’Audit & Procédure de Déploiement du Lab' : 'Engagement Scope & Lab Deployment Procedure'}
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          {isFr
            ? 'Définition contractuelle et technique des cibles autorisées, interdictions formelles et guide de reproductibilité à l’attention de l’évaluateur / mentor.'
            : 'Contractual and technical definition of authorized assessment boundaries, explicit exclusions, and reproducibility instructions for mentors.'}
        </p>
      </div>

      {/* Scope Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>{isFr ? 'Matrice de Périmètre (Scope Matrix)' : 'Scope Boundaries Matrix'}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">{isFr ? 'Cible / Composant' : 'Target / Component'}</th>
                <th className="px-4 py-3">{isFr ? 'Type d’Actif' : 'Asset Type'}</th>
                <th className="px-4 py-3">{isFr ? 'Statut Légal' : 'Authorization'}</th>
                <th className="px-4 py-3 rounded-r-lg">{isFr ? 'Règles d’Engagement' : 'Engagement Notes'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {SCOPE_ITEMS.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3.5 font-mono font-medium text-slate-200">{item.target}</td>
                  <td className="px-4 py-3.5 text-slate-400">{item.type}</td>
                  <td className="px-4 py-3.5">
                    {item.inScope ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" />
                        In-Scope (Autorisé)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Out-of-Scope (Interdit)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lab Reproducibility & Docker Commands */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Docker Deployment Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  {isFr ? '1. Déploiement Conteneurisé (Docker)' : '1. Docker Container Setup'}
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(dockerCommand, 'docker')}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1"
              >
                {copiedId === 'docker' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'docker' ? (isFr ? 'Copié !' : 'Copied!') : (isFr ? 'Copier' : 'Copy')}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              {isFr
                ? 'Commande officielle pour démarrer l’instance vulnérable de manière 100% isolée sur le port local 3000.'
                : 'Deterministic commands to launch the target app in complete isolation on local port 3000.'}
            </p>
            <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 overflow-x-auto border border-slate-800 leading-relaxed">
              {dockerCommand}
            </pre>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            <strong>✓ {isFr ? 'Contrainte d’isolation validée :' : 'Isolation constraint satisfied:'}</strong>{' '}
            {isFr
              ? 'Aucun pontage réseau externe, persistance locale SQLite éphémère.'
              : 'No external network exposure, isolated bridge network.'}
          </div>
        </div>

        {/* Burp Suite & Firefox Setup Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Laptop className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {isFr ? '2. Configuration Burp Suite & Proxy CA' : '2. Burp Suite Proxy & CA Trust'}
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(burpProxySetup, 'burp')}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1"
              >
                {copiedId === 'burp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'burp' ? (isFr ? 'Copié !' : 'Copied!') : (isFr ? 'Copier' : 'Copy')}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              {isFr
                ? 'Interception transparente des requêtes HTTP/HTTPS et inspection des headers d’authentification JWT.'
                : 'TLS interception and raw HTTP request inspection in Firefox Developer Edition.'}
            </p>
            <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-amber-300 overflow-x-auto border border-slate-800 leading-relaxed">
              {burpProxySetup}
            </pre>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <strong>⚠️ {isFr ? 'Bonne pratique d’hygiène :' : 'Operational hygiene:'}</strong>{' '}
            {isFr
              ? 'Désactiver le proxy Burp lors de la navigation hors-lab pour éviter toute fuite de trafic.'
              : 'Keep Burp proxy isolated to 127.0.0.1 to avoid routing host traffic.'}
          </div>
        </div>
      </div>

      {/* Tooling Stack Badges */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>{isFr ? 'Outils Éprouvés & Environnement d’Audit' : 'Validated Tooling Stack'}</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PENTEST_METADATA.toolsUsed.map((tool, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-slate-200 block">{tool}</span>
              <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">Configuré & Actif</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
