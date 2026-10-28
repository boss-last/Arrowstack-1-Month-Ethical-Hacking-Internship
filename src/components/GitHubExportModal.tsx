import React, { useState } from 'react';
import {
  Github,
  X,
  Download,
  Copy,
  Check,
  FolderTree,
  FileCode,
  FileText,
  Terminal,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import JSZip from 'jszip';
import { FINDINGS } from '../data/pentestData';
import {
  generateGitHubReadme,
  generateMarkdownReport,
  generateVerifyScript,
  generateDockerCompose,
} from '../utils/pentestLogic';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'fr' | 'en';
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isFr = lang === 'fr';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('README.md');
  const [isZipping, setIsZipping] = useState<boolean>(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate repository files content
  const readmeContent = generateGitHubReadme(FINDINGS, lang);
  const markdownReport = generateMarkdownReport(FINDINGS, lang);
  const verifyScript = generateVerifyScript();
  const dockerCompose = generateDockerCompose();

  const sqliEvidence = FINDINGS[0].rawRequest + '\n\n' + FINDINGS[0].rawResponse;
  const idorEvidence = FINDINGS[1].rawRequest + '\n\n' + FINDINGS[1].rawResponse;
  const ftpEvidence = FINDINGS[2].rawRequest + '\n\n' + FINDINGS[2].rawResponse;

  const gitignoreContent = `node_modules/
dist/
.env
.DS_Store
*.log
`;

  const licenseContent = `MIT License

Copyright (c) 2026 Arrowstack Ethical Hacking Intern

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
`;

  const repoFiles: Record<string, { name: string; content: string; icon: any }> = {
    'README.md': { name: 'README.md', content: readmeContent, icon: FileText },
    'docs/pentest-report.md': { name: 'docs/pentest-report.md', content: markdownReport, icon: FileText },
    'docker-compose.yml': { name: 'docker-compose.yml', content: dockerCompose, icon: FileCode },
    'scripts/verify_fixes.sh': { name: 'scripts/verify_fixes.sh', content: verifyScript, icon: Terminal },
    'evidence/SEC-VULN-01-sqli.http': { name: 'evidence/SEC-VULN-01-sqli.http', content: sqliEvidence, icon: FileCode },
    'evidence/SEC-VULN-02-idor.http': { name: 'evidence/SEC-VULN-02-idor.http', content: idorEvidence, icon: FileCode },
    'evidence/SEC-VULN-03-ftp.http': { name: 'evidence/SEC-VULN-03-ftp.http', content: ftpEvidence, icon: FileCode },
    '.gitignore': { name: '.gitignore', content: gitignoreContent, icon: FileCode },
    'LICENSE': { name: 'LICENSE', content: licenseContent, icon: FileText },
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add files to zip
      Object.entries(repoFiles).forEach(([path, file]) => {
        zip.file(path, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'authorized-web-pentest-lab-github-repo.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to generate zip:', error);
    } finally {
      setIsZipping(false);
    }
  };

  const gitBashCommands = `# 1. Créez un nouveau dépôt vide sur GitHub (ex: authorized-web-pentest-lab)
# 2. Dans votre terminal Kali Linux / VS Code :
mkdir authorized-web-pentest-lab
cd authorized-web-pentest-lab

# (Option A: Décompressez l'archive .zip téléchargée ici dans ce dossier)
# Ou initialisez directement :
git init
git add .
git commit -m "feat: complete Arrowstack project 1 authorized web pentest lab"
git branch -M main
git remote add origin https://github.com/<VOTRE_USERNAME_GITHUB>/authorized-web-pentest-lab.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{isFr ? 'Package GitHub Complet — Projet 1 Pentest Lab' : 'GitHub Repository Package — Project 1'}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Prêt à Déployer
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isFr
                  ? 'Tous les livrables exigés par Arrowstack, organisés dans une arborescence Git propre et téléchargeable en 1 clic.'
                  : 'Complete ready-to-push repo structure with README, markdown report, docker-compose, and test scripts.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? (isFr ? 'Création du ZIP...' : 'Packing ZIP...') : (isFr ? 'Télécharger le Repo (.ZIP)' : 'Download Repo (.ZIP)')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split Pane */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar: File Tree & Git Commands */}
          <div className="w-full md:w-80 bg-slate-950/70 border-r border-slate-800 flex flex-col justify-between overflow-y-auto p-4 space-y-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isFr ? 'Fichiers du Répertoire' : 'Repository Files'}</span>
              </div>

              <div className="space-y-1">
                {Object.keys(repoFiles).map((path) => {
                  const item = repoFiles[path];
                  const Icon = item.icon;
                  const isSelected = selectedFile === path;
                  return (
                    <button
                      key={path}
                      onClick={() => setSelectedFile(path)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center space-x-2 transition ${
                        isSelected
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{path}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Git Commands */}
            <div className="p-3 rounded-xl bg-black border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                <span>{isFr ? 'Commandes Git CLI' : 'Git Push Commands'}</span>
                <button
                  onClick={() => copyToClipboard(gitBashCommands, 'gitcmd')}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedKey === 'gitcmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'gitcmd' ? 'Copié' : 'Copier'}</span>
                </button>
              </div>
              <pre className="text-[10px] font-mono text-slate-300 leading-tight overflow-x-auto whitespace-pre-wrap">
                {gitBashCommands}
              </pre>
            </div>
          </div>

          {/* Right Pane: File Content Preview */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
            <div className="px-5 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-300 font-bold flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                {selectedFile}
              </span>
              <button
                onClick={() => copyToClipboard(repoFiles[selectedFile].content, 'fileContent')}
                className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1"
              >
                {copiedKey === 'fileContent' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedKey === 'fileContent' ? (isFr ? 'Contenu copié !' : 'Copied!') : (isFr ? 'Copier le fichier' : 'Copy File')}</span>
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto">
              <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-emerald-500/30">
                {repoFiles[selectedFile].content}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {isFr
                ? 'Validé pour les critères Arrowstack : README, reproductibilité, scripts et preuves brutes inclus.'
                : 'Meets 100% of Arrowstack criteria: reproducible setup, full writeups, evidence, and scripts.'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            {isFr ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
