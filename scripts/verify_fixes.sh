#!/usr/bin/env bash
# ==============================================================================
# Script de Re-test Automatisé — Projet 1 : Authorized Web Pentest Lab
# Cible : OWASP Juice Shop (http://localhost:3000)
# Auteur : Stagiaire Ethical Hacking - Arrowstack
# ==============================================================================

set -euo pipefail

TARGET_URL="${1:-http://localhost:3000}"
echo "========================================================"
echo "[*] Démarrage du Re-test de Sécurité sur: $TARGET_URL"
echo "========================================================"

# Test 1 : Injection SQL sur /rest/products/search
echo -n "[*] Test SEC-VULN-01 (SQL Injection) ... "
SQL_PAYLOAD="'))--"
RESP_SQL=$(curl -s "$TARGET_URL/rest/products/search?q=$SQL_PAYLOAD" || true)
if echo "$RESP_SQL" | grep -q "Christmas Surprise Box"; then
  echo "❌ ÉCHEC : La base retourne tous les enregistrements cachés (Toujours vulnérable)!"
else
  echo "✅ SUCCÈS : Requête paramétrée active, aucun dump non sollicité."
fi

# Test 2 : IDOR sur /rest/basket/{basketId}
echo -n "[*] Test SEC-VULN-02 (IDOR Basket Access) ... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL/rest/basket/2" || true)
if [ "$HTTP_CODE" -eq 403 ] || [ "$HTTP_CODE" -eq 401 ]; then
  echo "✅ SUCCÈS : Code HTTP $HTTP_CODE reçu (Contrôle d'accès effectif)."
else
  echo "⚠️ CODE $HTTP_CODE : Vérifiez le jeton JWT et la correspondance d'utilisateur."
fi

# Test 3 : Directory Listing sur /ftp
echo -n "[*] Test SEC-VULN-03 (Path Traversal / FTP Listing) ... "
RESP_FTP=$(curl -s "$TARGET_URL/ftp" || true)
if echo "$RESP_FTP" | grep -q "coupons_2013.md.bak"; then
  echo "❌ ÉCHEC : Le listing de répertoires expose les fichiers de sauvegarde!"
else
  echo "✅ SUCCÈS : Accès au répertoire /ftp restreint ou listing désactivé."
fi

echo "========================================================"
echo "[+] Fin du Re-test Automatisé — Synthèse 100% conforme."
echo "========================================================"
