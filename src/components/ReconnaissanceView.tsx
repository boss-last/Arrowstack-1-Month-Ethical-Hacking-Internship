import React, { useState } from 'react';
import { Globe, Search, Code, Server, Database, FileCode, CheckCircle2, AlertOctagon } from 'lucide-react';
import { DISCOVERED_ENDPOINTS } from '../data/pentestData';

interface ReconnaissanceViewProps {
  lang: 'fr' | 'en';
}

export const ReconnaissanceView: React.FC<ReconnaissanceViewProps> = ({ lang }) => {
  const isFr = lang === 'fr';
  const [filterMethod, setFilterMethod] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredEndpoints = DISCOVERED_ENDPOINTS.filter((ep) => {
    const matchesMethod = filterMethod === 'ALL' || ep.method === filterMethod;
    const matchesSearch =
      ep.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ep.riskNote.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMethod && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>Section 2 — {isFr ? 'Reconnaissance & Cartographie' : 'Reconnaissance & Attack Surface'}</span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          {isFr ? 'Architecture Applicative & Cartographie des Endpoints' : 'Application Architecture & Surface Mapping'}
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          {isFr
            ? 'Identification des composants technologiques, rétro-ingénierie des bundles JavaScript Angular statiques et découverte d’endpoints non documentés.'
            : 'Tech stack profiling, client-side static JavaScript bundle reverse engineering, and unlisted hidden route discovery.'}
        </p>
      </div>

      {/* 3-Tier Architecture Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-3">
              <FileCode className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Tier 1 : Frontend</span>
            <h3 className="text-lg font-bold text-white mt-1">Angular SPA (v14/15)</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {isFr
                ? 'Single Page Application riche minifiée en bundles (main.js, vendor.js). Le routage client intègre des vues d’administration et des paramètres d’API visibles en clair après dé-minification.'
                : 'Minified Angular SPA bundles. Client routing structures embed administration views and backend API routes discovered via sourcemap/beautifier.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            Fichiers audités : <span className="text-cyan-300">main.js, vendor.js</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
              <Server className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Tier 2 : Backend API</span>
            <h3 className="text-lg font-bold text-white mt-1">Node.js & Express REST</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {isFr
                ? 'Serveur REST JSON avec contrôleurs modulaires (/routes/*). Authentification basée sur JSON Web Token (JWT) stockés en SessionStorage côté navigateur.'
                : 'Modular Express REST controllers. Stateless JSON Web Token authentication with authorization checks delegated to individual routes.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            Middlewares : <span className="text-emerald-300">express-jwt, serve-index</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-3">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">Tier 3 : Stockage</span>
            <h3 className="text-lg font-bold text-white mt-1">SQLite & Sequelize ORM</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {isFr
                ? 'Base relationnelle SQLite persistée localement avec ORM Sequelize. Vulnérabilité majeure : contournement de l’ORM par des appels directs à sequelize.query() concaténés.'
                : 'Relational SQLite instance managed by Sequelize ORM. Flaw: bypassing ORM abstraction via raw concatenated query strings.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            Stockage : <span className="text-amber-300">juiceshop.sqlite</span>
          </div>
        </div>
      </div>

      {/* Static Reverse Engineering Walkthrough */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <span>{isFr ? 'Méthodologie de Découverte : Rétro-ingénierie JavaScript Statique' : 'Static JS Reverse Engineering Walkthrough'}</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          {isFr
            ? 'Avant d’initier des tests dynamiques agressifs, l’inspection méthodique des assets statiques via Firefox Developer Edition (Debuggeur & Recherche de chaînes regex) a révélé les points d’entrée cachés :'
            : 'Prior to active probing, comprehensive static analysis of client-side bundles identified unlinked routes:'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
              <span className="text-cyan-400 font-bold">Inspection de main.js</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">RegEx: /rest|api/g</span>
            </div>
            <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
{`// Extrait dé-minifié de main.js :
this.searchService.search = function(query) {
  return this.http.get('/rest/products/search?q=' + encodeURIComponent(query));
};
// Découverte de route cachée vers l'administration :
{ path: 'administration', component: AdminComponent, canActivate: [AdminGuard] },
{ path: 'ftp', redirectTo: '/ftp' }`}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
              <span className="text-emerald-400 font-bold">Inspection de vendor.js & headers</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Tokens & Storage</span>
            </div>
            <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
{`// Header d'authentification intercepté :
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
// Décodage payload JWT :
{
  "email": "user_a@example.com",
  "id": 1,
  "bid": 1  // Basket ID lié séquentiellement
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Discovered Endpoints Table with Filter */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <span>{isFr ? 'Inventaire des Endpoints Découverts' : 'Discovered Endpoints Inventory'}</span>
          </h3>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder={isFr ? 'Filtrer un endpoint...' : 'Filter endpoint...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
              />
            </div>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              {['ALL', 'GET', 'POST'].map((method) => (
                <button
                  key={method}
                  onClick={() => setFilterMethod(method)}
                  className={`px-2 py-1 rounded ${
                    filterMethod === method ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Méthode & Chemin</th>
                <th className="px-4 py-3">Authentification</th>
                <th className="px-4 py-3">Source de Découverte</th>
                <th className="px-4 py-3 rounded-r-lg">Évaluation d'Impact / Vulnérabilité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredEndpoints.map((ep, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3 text-slate-200 flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ep.method === 'GET'
                          ? 'bg-blue-500/20 text-blue-300'
                          : ep.method === 'POST'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-slate-100 font-semibold">{ep.path}</span>
                  </td>
                  <td className="px-4 py-3">
                    {ep.authRequired ? (
                      <span className="text-amber-400 text-xs">JWT Requis</span>
                    ) : (
                      <span className="text-emerald-400 text-xs">Public</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-sans text-xs">{ep.discoveredVia}</td>
                  <td className="px-4 py-3 font-sans text-xs">
                    {ep.riskNote.includes('SEC-VULN') ? (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                        <span>{ep.riskNote}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">{ep.riskNote}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
