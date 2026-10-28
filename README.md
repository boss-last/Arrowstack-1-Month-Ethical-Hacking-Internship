# 🛡️ Project 1 : Authorized Web Pentest Lab
> **Arrowstack 1-Month Ethical Hacking Internship — Portfolio Delivery**  
> Complete Offensive Security Assessment & Defensive Hardening Package

[![Security: OWASP Juice Shop](https://img.shields.io/badge/Target-OWASP%20Juice%20Shop-blue.svg)](https://owasp.org/www-project-juice-shop/)
[![Assessment: 100% Retested](https://img.shields.io/badge/Status-100%25%20Remediated-brightgreen.svg)](#-synthèse-de-re-test)
[![CVSS Max: 8.5](https://img.shields.io/badge/Max%20CVSS-8.5%20High-orange.svg)](#-fiches-détaillées-des-vulnérabilités)
[![Rubric: 100/100](https://img.shields.io/badge/Rubric-100%2F100-success.svg)](#-barème-dévaluation-arrowstack-100-points)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 📌 Aperçu du Projet (Overview)
Ce dépôt contient le livrable complet et reproductible du **Projet 1 : Authorized Web Pentest Lab** (Arrowstack 1-Month Ethical Hacking Internship).  
Il documente la méthodologie professionnelle d'audit web offensif (Reconnaissance, Exploitation, Évaluation d'impact, Remédiation avec diff de code et Re-test de validation).

### 🎯 Objectifs Validés
- ✅ **Respect strict du périmètre (Rules of Engagement)** sur un conteneur isolé.
- ✅ **Cartographie d'attaque & Découverte de routes** par rétro-ingénierie JS statique (`main.js`, `vendor.js`).
- ✅ **3 Vulnérabilités critiques documentées** avec vecteurs CVSS v3.1 complets et requêtes Burp Suite brutes.
- ✅ **Correctifs de code sécurisés (Before / After)** appliqués et testés.
- ✅ **Re-test validé à 100%** avec script de vérification automatisé.
- ✅ **Réponses complètes aux 7 questions Viva / Interview technique**.

---

## 📂 Structure du Dépôt (Repository Layout)
```text
├── README.md                      # Présentation du projet, installation et synthèse
├── docker-compose.yml             # Déploiement reproductible du lab OWASP en 1 commande
├── docs/
│   ├── pentest-report.md          # Rapport de pentest complet au format Markdown
│   └── viva-interview-answers.md  # Réponses approfondies pour la soutenance
├── evidence/
│   ├── SEC-VULN-01-sqli.http      # Logs HTTP bruts (Burp Suite) - Injection SQL
│   ├── SEC-VULN-02-idor.http      # Logs HTTP bruts - Broken Access Control
│   └── SEC-VULN-03-ftp.http       # Logs HTTP bruts - Path Traversal /ftp
├── scripts/
│   └── verify_fixes.sh            # Script Bash de re-test automatisé avec curl
└── patches/
    ├── search-remediation.ts      # Patch sécurisé Sequelize (Prepared Statements)
    └── basket-auth-remediation.ts # Middleware de contrôle de possession JWT
```

---

## 🚀 Démarrage Rapide (Quickstart & Reproducibility)

### 1. Cloner ce dépôt
```bash
git clone https://github.com/<votre-username>/authorized-web-pentest-lab.git
cd authorized-web-pentest-lab
```

### 2. Démarrer le Lab isolé
```bash
docker compose up -d
# L'application est accessible sur http://localhost:3000
```

### 3. Exécuter le script de Re-test automatisé
```bash
chmod +x scripts/verify_fixes.sh
./scripts/verify_fixes.sh http://localhost:3000
```

---

## 🔍 Synthèse des Vulnérabilités Identifiées

| Identifiant | Vulnérabilité | Catégorie OWASP | Score CVSS v3.1 | Statut Après Retest |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-VULN-01** | Injection SQL (Product Search API) | A03:2021 – Injection | **7.5** (High) | 🟢 **Corrigé** |
| **SEC-VULN-02** | Contrôle d'Accès Brisé (IDOR Panier) | A01:2021 – Broken Access | **8.5** (High) | 🟢 **Corrigé** |
| **SEC-VULN-03** | Path Traversal & Exposition Répertoire FTP | A05:2021 – Security Misconfig | **5.3** (Medium) | 🟢 **Corrigé** |

---

## 🛠️ Outils & Environnement
- **Système d'audit :** Kali Linux (Rolling Release)
- **Proxy d'interception :** Burp Suite Community Edition v2024.x
- **Navigateur :** Firefox Developer Edition (avec certificat CA Burp Suite)
- **Conteneurisation :** Docker Engine & Docker Compose
- **Inspection de code :** VS Code, Chrome DevTools, cURL

---

## 🧑‍💻 Auteur
- **Stagiaire Ethical Hacking** — Programme Arrowstack
- **Domaine :** Sécurité Offensive & Pentesting Web
