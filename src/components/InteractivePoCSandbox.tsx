import React, { useState } from 'react';
import { PlayCircle, ShieldCheck, ShieldAlert, Send, RefreshCw, Terminal, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface InteractivePoCSandboxProps {
  lang: 'fr' | 'en';
}

export const InteractivePoCSandbox: React.FC<InteractivePoCSandboxProps> = ({ lang }) => {
  const isFr = lang === 'fr';
  const [activeTab, setActiveTab] = useState<'sqli' | 'idor' | 'ftp'>('sqli');

  // --- SQLi Simulator State ---
  const [sqliInput, setSqliInput] = useState<string>("'))--");
  const [isSqliPatched, setIsSqliPatched] = useState<boolean>(false);
  const [sqliOutput, setSqliOutput] = useState<{
    status: number;
    executedSql: string;
    payloadResult: any;
    isVulnerableHit: boolean;
  } | null>(null);

  // --- IDOR Simulator State ---
  const [idorTargetBasket, setIdorTargetBasket] = useState<number>(2);
  const [isIdorPatched, setIsIdorPatched] = useState<boolean>(false);
  const [idorOutput, setIdorOutput] = useState<{
    status: number;
    body: any;
    isAccessGranted: boolean;
  } | null>(null);

  // --- FTP Simulator State ---
  const [ftpPath, setFtpPath] = useState<string>('/ftp/coupons_2013.md.bak');
  const [isFtpPatched, setIsFtpPatched] = useState<boolean>(false);
  const [ftpOutput, setFtpOutput] = useState<{
    status: number;
    body: string;
    isLeaked: boolean;
  } | null>(null);

  // Run SQLi Simulation
  const handleExecuteSqli = () => {
    const rawInput = sqliInput;

    if (!isSqliPatched) {
      // Vulnerable logic: SQL string concatenation
      const executedSql = `SELECT * FROM Products WHERE ((name LIKE '%${rawInput}%' OR description LIKE '%${rawInput}%') AND deletedAt IS NULL) ORDER BY name;`;

      // Does the payload escape the quote and close the parenthesis?
      const isBypass =
        rawInput.includes("'))--") ||
        rawInput.includes("')--") ||
        rawInput.includes("' OR 1=1") ||
        rawInput.toLowerCase().includes('union select');

      if (isBypass) {
        setSqliOutput({
          status: 200,
          executedSql,
          isVulnerableHit: true,
          payloadResult: {
            status: 'success',
            count: 5,
            data: [
              { id: 1, name: 'Apple Juice (1000ml)', price: 1.99, deletedAt: null },
              { id: 2, name: 'Orange Juice (1000ml)', price: 2.99, deletedAt: null },
              {
                id: 6,
                name: 'Christmas Surprise Box',
                price: 99.99,
                deletedAt: '2025-12-26T00:00:00.000Z',
                _flag: '⚠️ ARTICLE SUPPRIMÉ / CACHÉ DIVULGUÉ PAR SQLi',
              },
              {
                id: 14,
                name: 'OWASP Juice Shop Logo (3D-printed)',
                price: 49.99,
                deletedAt: null,
              },
              {
                id: 99,
                name: 'Super Secret Test Product',
                price: 0.01,
                deletedAt: '2025-01-01T00:00:00.000Z',
                _flag: '⚠️ FICHIER INTERNE EXPOSÉ',
              },
            ],
          },
        });
      } else {
        // Normal search
        const matched =
          rawInput.toLowerCase().includes('apple')
            ? [{ id: 1, name: 'Apple Juice (1000ml)', price: 1.99, deletedAt: null }]
            : [];
        setSqliOutput({
          status: 200,
          executedSql,
          isVulnerableHit: false,
          payloadResult: { status: 'success', count: matched.length, data: matched },
        });
      }
    } else {
      // Patched logic: Sequelize Op.like Prepared Statement
      const executedSql = `SELECT * FROM Products WHERE (name LIKE ? OR description LIKE ?) AND deletedAt IS NULL; /* Params: ["%${rawInput.replace(
        /'/g,
        "\\'"
      )}%", "%${rawInput.replace(/'/g, "\\'")}%"] */`;

      const matched =
        rawInput === 'apple'
          ? [{ id: 1, name: 'Apple Juice (1000ml)', price: 1.99, deletedAt: null }]
          : [];

      setSqliOutput({
        status: 200,
        executedSql,
        isVulnerableHit: false,
        payloadResult: {
          status: 'success',
          count: matched.length,
          data: matched,
          note: 'Requête paramétrée Sequelize appliquée : les métacaractères SQL sont traités comme du texte littéral.',
        },
      });
    }
  };

  // Run IDOR Simulation
  const handleExecuteIdor = () => {
    const callerBasketId = 1; // User A's basket
    const targetId = idorTargetBasket;

    if (!isIdorPatched) {
      // Vulnerable: Returns any requested basket without ownership verification
      const victimProducts =
        targetId === 2
          ? [
              { id: 3, name: 'Banana Juice (1000ml)', price: 2.99, quantity: 4 },
              { id: 8, name: 'OWASP Juice Shop Card Deck', price: 9.99, quantity: 1 },
            ]
          : [{ id: 1, name: 'Apple Juice (1000ml)', price: 1.99, quantity: 1 }];

      setIdorOutput({
        status: 200,
        isAccessGranted: true,
        body: {
          status: 'success',
          basketId: targetId,
          ownerUserId: targetId,
          deliveryAddress: targetId === 2 ? '12 Rue Secrète de la Victime, Paris' : 'Mon Adresse Légitime',
          products: victimProducts,
        },
      });
    } else {
      // Patched: Check req.user.bid === req.params.basketId
      if (targetId !== callerBasketId) {
        setIdorOutput({
          status: 403,
          isAccessGranted: false,
          body: {
            status: 'error',
            code: 'FORBIDDEN_RESOURCE_ACCESS',
            message: 'Accès non autorisé : Vous ne disposez pas des privilèges pour inspecter le panier #2.',
            securityAudit: 'LOG_SECURITY_INCIDENT: Unauthorized cross-user basket attempt blocked.',
          },
        });
      } else {
        setIdorOutput({
          status: 200,
          isAccessGranted: true,
          body: {
            status: 'success',
            basketId: 1,
            ownerUserId: 1,
            products: [{ id: 1, name: 'Apple Juice (1000ml)', price: 1.99, quantity: 1 }],
          },
        });
      }
    }
  };

  // Run FTP Simulation
  const handleExecuteFtp = () => {
    if (!isFtpPatched) {
      // Vulnerable: Directory listing or direct access to sensitive files
      if (ftpPath === '/ftp' || ftpPath === '/ftp/') {
        setFtpOutput({
          status: 200,
          isLeaked: true,
          body: `<!DOCTYPE html>
<html>
<head><title>listing directory /ftp</title></head>
<body>
<h1>Directory: /ftp</h1>
<ul>
  <li><a href="/ftp/acquisitions.md">acquisitions.md</a></li>
  <li><a href="/ftp/coupons_2013.md.bak">coupons_2013.md.bak</a> [SENSITIVE BACKUP]</li>
  <li><a href="/ftp/legal.md">legal.md</a></li>
  <li><a href="/ftp/package.json.bak">package.json.bak</a></li>
</ul>
</body>
</html>`,
        });
      } else if (ftpPath.includes('coupons_2013.md.bak')) {
        setFtpOutput({
          status: 200,
          isLeaked: true,
          body: `# Confidential Internal Backup - Coupons 2013
- 2013-ANNIVERSARY-80OFF : 80% Off on all products (Never expired!)
- ADMIN-OVERRIDE-FREE : Free shipping & 100% voucher code
[END OF SENSITIVE FILE]`,
        });
      } else {
        setFtpOutput({
          status: 200,
          isLeaked: false,
          body: `# Legal Terms & Conditions
OWASP Juice Shop open-source disclaimer and license terms.`,
        });
      }
    } else {
      // Patched: Directory listing disabled, whitelist enforced
      if (ftpPath === '/ftp' || ftpPath === '/ftp/') {
        setFtpOutput({
          status: 403,
          isLeaked: false,
          body: `HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "Directory Listing Disabled",
  "message": "L'indexation directe du répertoire /ftp a été désactivée par mesure de durcissement."
}`,
        });
      } else if (ftpPath.includes('coupons_2013.md.bak') || ftpPath.includes('package.json.bak')) {
        setFtpOutput({
          status: 403,
          isLeaked: false,
          body: `HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "Forbidden File Access",
  "message": "Seuls les fichiers de la liste blanche (.pdf, legal.md) sont distribuables."
}`,
        });
      } else {
        setFtpOutput({
          status: 200,
          isLeaked: false,
          body: `# Legal Terms & Conditions
Fichier légal public autorisé par la whitelist.`,
        });
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <PlayCircle className="w-4 h-4" />
          <span>Section 4 — {isFr ? 'Laboratoire Interactif & Burp Repeater' : 'Interactive PoC Sandbox'}</span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          {isFr ? 'Simulateur d’Exploitation & Validation des Patches' : 'Live Exploit Simulator & Patch Validation'}
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          {isFr
            ? 'Testez en direct les charges utiles d’attaque (Burp Suite Repeater), basculez entre le mode vulnérable et le mode sécurisé, et vérifiez l’efficacité des contre-mesures techniques.'
            : 'Replay exploit payloads with Burp Suite style mechanics, toggle between vulnerable and patched modes, and observe deterministic mitigation results.'}
        </p>
      </div>

      {/* Vulnerability Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('sqli')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'sqli'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          SEC-VULN-01 : Injection SQL (Search API)
        </button>
        <button
          onClick={() => setActiveTab('idor')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'idor'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          SEC-VULN-02 : IDOR Panier (/rest/basket)
        </button>
        <button
          onClick={() => setActiveTab('ftp')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'ftp'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          SEC-VULN-03 : Path Traversal (/ftp)
        </button>
      </div>

      {/* TAB 1: SQL INJECTION SIMULATOR */}
      {activeTab === 'sqli' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <span>Simulateur d’Injection SQL — /rest/products/search?q=</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                La clause WHERE originale : <code className="text-amber-300">WHERE ((name LIKE &apos;%q%&apos; OR ...) AND deletedAt IS NULL)</code>
              </p>
            </div>

            {/* Toggle Vulnerable vs Patched */}
            <div className="flex items-center space-x-3 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <span className={`text-xs font-bold ${!isSqliPatched ? 'text-rose-400' : 'text-slate-500'}`}>
                {isFr ? 'Vulnérable' : 'Vulnerable'}
              </span>
              <button
                onClick={() => {
                  setIsSqliPatched(!isSqliPatched);
                  setSqliOutput(null);
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                  isSqliPatched ? 'bg-emerald-600 justify-end' : 'bg-rose-600 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md transform"></div>
              </button>
              <span className={`text-xs font-bold ${isSqliPatched ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isFr ? 'Patch Sécurisé' : 'Patched'}
              </span>
            </div>
          </div>

          {/* Quick Payloads Bar */}
          <div>
            <label className="text-xs uppercase font-bold text-slate-400 block mb-2">
              {isFr ? 'Charges utiles Burp Repeater (Cliquez pour charger) :' : 'Preset Burp Payloads:'}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSqliInput('apple')}
                className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                apple (Légitime)
              </button>
              <button
                onClick={() => setSqliInput("'))--")}
                className="px-2.5 py-1 text-xs font-mono rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/80 font-bold"
              >
                &apos;))-- (PoC Rapport Pentest)
              </button>
              <button
                onClick={() => setSqliInput("') OR 1=1--")}
                className="px-2.5 py-1 text-xs font-mono rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/80"
              >
                &apos;) OR 1=1--
              </button>
              <button
                onClick={() => setSqliInput("' UNION SELECT 1, email, password FROM Users--")}
                className="px-2.5 py-1 text-xs font-mono rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/80"
              >
                &apos; UNION SELECT Users--
              </button>
            </div>
          </div>

          {/* Input & Action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-mono text-xs text-slate-500">
                /rest/products/search?q=
              </span>
              <input
                type="text"
                value={sqliInput}
                onChange={(e) => setSqliInput(e.target.value)}
                className="w-full pl-52 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-sm text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={handleExecuteSqli}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isFr ? 'Envoyer Requête (Repeater)' : 'Send Request'}</span>
            </button>
          </div>

          {/* Execution Result */}
          {sqliOutput && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              {/* Alert Status */}
              {sqliOutput.isVulnerableHit ? (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/50 flex items-start space-x-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-200">
                      ⚠️ EXPLOITATION CONFIRMÉE (Fuite de Données Privées)
                    </h4>
                    <p className="text-xs text-rose-300/90 mt-1">
                      La séquence <code className="font-mono bg-rose-900/40 px-1 rounded">&apos;))--</code> a refermé prématurément la parenthèse et commenté la restriction <code className="font-mono">deletedAt IS NULL</code>. L&apos;application a retourné tous les éléments cachés et confidentiels !
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/50 flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-200">
                      ✓ EXÉCUTION SÉCURISÉE (Aucune Fuite Détectée)
                    </h4>
                    <p className="text-xs text-emerald-300/90 mt-1">
                      {isSqliPatched
                        ? "Le moteur Sequelize utilise une requête paramétrée (Prepared Statement). La tentative d'injection SQL est neutralisée et échappée."
                        : "Recherche normale effectuée sans altération de la logique SQL."}
                    </p>
                  </div>
                </div>
              )}

              {/* Generated Query */}
              <div className="p-3 rounded-lg bg-black font-mono text-xs text-slate-300 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Requête SQL Interne Générée :</span>
                <code className="text-amber-300">{sqliOutput.executedSql}</code>
              </div>

              {/* JSON Response */}
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 max-h-64 overflow-y-auto">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span>HTTP/1.1 {sqliOutput.status} OK</span>
                  <span>Content-Type: application/json</span>
                </div>
                <pre>{JSON.stringify(sqliOutput.payloadResult, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: IDOR SIMULATOR */}
      {activeTab === 'idor' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <span>Simulateur IDOR — /rest/basket/{'{basketId}'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Utilisateur connecté : <strong className="text-cyan-300">Utilisateur A (JWT bid: 1)</strong>
              </p>
            </div>

            {/* Toggle Vulnerable vs Patched */}
            <div className="flex items-center space-x-3 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <span className={`text-xs font-bold ${!isIdorPatched ? 'text-rose-400' : 'text-slate-500'}`}>
                {isFr ? 'Vulnérable' : 'Vulnerable'}
              </span>
              <button
                onClick={() => {
                  setIsIdorPatched(!isIdorPatched);
                  setIdorOutput(null);
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                  isIdorPatched ? 'bg-emerald-600 justify-end' : 'bg-rose-600 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md transform"></div>
              </button>
              <span className={`text-xs font-bold ${isIdorPatched ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isFr ? 'Patch AuthZ' : 'AuthZ Patched'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <label className="text-xs uppercase font-bold text-slate-400 block mb-2">
                Sélectionner l’Identifiant de Panier Cible (:basketId) :
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIdorTargetBasket(1)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition ${
                    idorTargetBasket === 1
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Panier #1 (Mon Panier)
                </button>
                <button
                  onClick={() => setIdorTargetBasket(2)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition ${
                    idorTargetBasket === 2
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Panier #2 (Victime B - IDOR)
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="text-slate-500 block mb-1">Headers HTTP Transmis :</span>
              <div>GET /rest/basket/{idorTargetBasket} HTTP/1.1</div>
              <div className="text-cyan-400 truncate">Authorization: Bearer eyJhbGci... [bid: 1]</div>
            </div>
          </div>

          <button
            onClick={handleExecuteIdor}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Tester l’Accès au Panier</span>
          </button>

          {idorOutput && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              {idorOutput.isAccessGranted && idorTargetBasket === 2 ? (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/50 flex items-start space-x-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-200">
                      🚨 IDOR VALIDÉ : Panier de la Victime Dévoilé (HTTP 200 OK)
                    </h4>
                    <p className="text-xs text-rose-300/90 mt-1">
                      Le serveur a retourné les articles et l’adresse de livraison de l&apos;Utilisateur B sans vérifier la correspondance avec le token JWT de l&apos;Utilisateur A.
                    </p>
                  </div>
                </div>
              ) : idorOutput.status === 403 ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/50 flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-200">
                      🛡️ ACCÈS BLOQUÉ : HTTP 403 Forbidden (Contrôle d’Autorisation Actif)
                    </h4>
                    <p className="text-xs text-emerald-300/90 mt-1">
                      Le middleware d&apos;autorisation a intercepté la tentative d&apos;accès : <code className="font-mono">req.user.bid (1) !== req.params.basketId (2)</code>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-600/50 text-xs text-cyan-200">
                  Accès légitime à votre propre panier (Panier #1).
                </div>
              )}

              <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800">
                {JSON.stringify(idorOutput.body, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FTP / PATH TRAVERSAL SIMULATOR */}
      {activeTab === 'ftp' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <span>Simulateur Path Traversal — Répertoire /ftp</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Contournement de restrictions et détection de Directory Listing.
              </p>
            </div>

            {/* Toggle Vulnerable vs Patched */}
            <div className="flex items-center space-x-3 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <span className={`text-xs font-bold ${!isFtpPatched ? 'text-rose-400' : 'text-slate-500'}`}>
                {isFr ? 'Vulnérable' : 'Vulnerable'}
              </span>
              <button
                onClick={() => {
                  setIsFtpPatched(!isFtpPatched);
                  setFtpOutput(null);
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                  isFtpPatched ? 'bg-emerald-600 justify-end' : 'bg-rose-600 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md transform"></div>
              </button>
              <span className={`text-xs font-bold ${isFtpPatched ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isFr ? 'Listing Désactivé' : 'Patched'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase font-bold text-slate-400 block">
              Chemin de la Ressource Demandée :
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFtpPath('/ftp')}
                className="px-3 py-1 text-xs font-mono rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                /ftp (Directory Listing)
              </button>
              <button
                onClick={() => setFtpPath('/ftp/coupons_2013.md.bak')}
                className="px-3 py-1 text-xs font-mono rounded bg-rose-950/60 text-rose-300 border border-rose-800/80 font-bold"
              >
                /ftp/coupons_2013.md.bak (Fichier Backup Privé)
              </button>
              <button
                onClick={() => setFtpPath('/ftp/legal.md')}
                className="px-3 py-1 text-xs font-mono rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                /ftp/legal.md (Fichier Public Whitelisté)
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={ftpPath}
                onChange={(e) => setFtpPath(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-sm text-cyan-300"
              />
              <button
                onClick={handleExecuteFtp}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm"
              >
                Requêter
              </button>
            </div>
          </div>

          {ftpOutput && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              {ftpOutput.isLeaked ? (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/50 flex items-start space-x-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-200">
                      ⚠️ EXPOSITION DE FICHIERS INTERNES (HTTP 200)
                    </h4>
                    <p className="text-xs text-rose-300/90 mt-1">
                      Le listing de répertoires ou le téléchargement direct de sauvegardes (.bak) est actif et expose les secrets internes de l&apos;application.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/50 flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-200">
                      ✓ ACCÈS CONTRÔLÉ & SÉCURISÉ
                    </h4>
                    <p className="text-xs text-emerald-300/90 mt-1">
                      {isFtpPatched
                        ? "Le Directory Listing est désactivé et la whitelist empêche l'extraction des fichiers non autorisés."
                        : "Fichier public légitime délivré."}
                    </p>
                  </div>
                </div>
              )}

              <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 whitespace-pre-wrap">
                {ftpOutput.body}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
