#!/usr/bin/env bash
# Test script for DRF school management API endpoints
# Usage:
#   chmod +x test_api.sh
#   ./test_api.sh http://localhost:8000/api
#
# You can also set BASE via environment variable or argument.
# Dependencies: curl (required). jq (optional, for pretty JSON).
#
# Configure credentials below or export them as environment variables
# before running the script.

set -euo pipefail
shopt -s expand_aliases

BASE="${1:-${BASE:-http://localhost:8000/api/gestion}}"
TOKEN_URL="${TOKEN_URL:-http://localhost:8000/api/token/}"

# --------- Credentials (change these) ---------
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@institucion.edu}"
ADMIN_PASS="${ADMIN_PASS:-CAMBIA_ESTA_CONTRASEÑA}"

DOCENTE_EMAIL="${DOCENTE_EMAIL:-docente1@gmail.com}"
DOCENTE_PASS="${DOCENTE_PASS:-docente1}"

ALUMNO_EMAIL="${ALUMNO_EMAIL:-alumno1@gmail.com}"
ALUMNO_PASS="${ALUMNO_PASS:-alumno1}"

# IDs for detail endpoints (docente self / alumno self). Change to real IDs.
DOCENTE_ID="${DOCENTE_ID:-3}"
ALUMNO_ID="${ALUMNO_ID:-2}"

# --------- Helpers ---------
have_jq() { command -v jq >/dev/null 2>&1; }

json_or_raw() {
  if have_jq; then
    jq . 2>/dev/null || cat
  else
    cat
  fi
}

extract_access_token() {
  # Try jq first; fallback to a naive sed if jq isn't available.
  if have_jq; then
    jq -r '.access' 2>/dev/null || true
  else
    # Very naive JSON extraction; works if "access":"..."
    sed -n 's/.*"access"[[:space:]]*:[[:space:]]*"\{0,1\([^"\\]*\).*$/\1/p'
  fi
}

get_token() {
  local email="$1"; local pass="$2"
  if [[ "$pass" == "CHANGE_ME" ]]; then
    echo ""
    return 0
  fi
  local resp
  resp=$(curl -s -X POST "$TOKEN_URL" -H "Content-Type: application/json" -d "{\"email\":\"$email\",\"password\":\"$pass\"}")
  printf "%s" "$resp" | extract_access_token
}


TEST_TOTAL=0
TEST_PASS=0
TEST_FAIL=0
FAILED_TESTS=()

# req <method> <path> <who> <token> <desc> [expected_status] [data]
req() {
  local method="$1"; local path="$2"; local who="$3"; local token="$4"; local desc="$5"; local expected="${6:-}"; local data="${7:-}"
  ((TEST_TOTAL++))
  echo "--------------------------------------------------------------------------------"
  echo ">>> $method $BASE$path  as $who"
  echo "--- $desc"
  local -a auth=()
  local -a data_args=()
  if [[ -n "${token:-}" ]]; then
    auth=(-H "Authorization: Bearer $token")
  fi
  if [[ -n "${data:-}" ]]; then
    data_args=(-H "Content-Type: application/json" -d "$data")
  fi
  local response status body
  if [[ ${#auth[@]} -gt 0 && ${#data_args[@]} -gt 0 ]]; then
    response=$(curl -s -w "HTTP_STATUS:%{http_code}" -X "$method" "$BASE$path" "${auth[@]}" "${data_args[@]}")
  elif [[ ${#auth[@]} -gt 0 ]]; then
    response=$(curl -s -w "HTTP_STATUS:%{http_code}" -X "$method" "$BASE$path" "${auth[@]}")
  elif [[ ${#data_args[@]} -gt 0 ]]; then
    response=$(curl -s -w "HTTP_STATUS:%{http_code}" -X "$method" "$BASE$path" "${data_args[@]}")
  else
    response=$(curl -s -w "HTTP_STATUS:%{http_code}" -X "$method" "$BASE$path")
  fi
  body=$(printf "%s" "$response" | sed -e 's/HTTP_STATUS:.*//')
  status=$(printf "%s" "$response" | tr -d '\n' | sed -e 's/.*HTTP_STATUS://')
  echo "Status: $status"
  printf "%s" "$body" | json_or_raw || true
  local ok=0
  if [[ -n "$expected" ]]; then
    # expected puede ser una lista separada por |
    IFS='|' read -ra exp_arr <<< "$expected"
    for exp in "${exp_arr[@]}"; do
      if [[ "$status" == "$exp" ]]; then ok=1; break; fi
    done
  else
    # Si no se especifica expected, éxito si es 2xx
    [[ "$status" =~ ^2 ]] && ok=1
  fi
  if [[ $ok -eq 1 ]]; then
    ((TEST_PASS++))
    echo "[OK] $desc"
  else
    ((TEST_FAIL++))
    FAILED_TESTS+=("$method $path as $who: $desc (Status: $status, Esperado: ${expected:-2xx})")
    echo "[FAIL] $desc"
  fi
  echo
}

warn_if_placeholder() {
  local who="$1" pass="$2"
  if [[ "$pass" == "CHANGE_ME" ]]; then
    echo "NOTE: $who password is CHANGE_ME -> token retrieval will be skipped. Set ${who^^}_PASS or edit the script."
  fi
}

echo "BASE: $BASE"
echo "TOKEN_URL: $TOKEN_URL"

warn_if_placeholder "ADMIN" "$ADMIN_PASS"
warn_if_placeholder "DOCENTE" "$DOCENTE_PASS"
warn_if_placeholder "ALUMNO" "$ALUMNO_PASS"

echo
echo "Obtaining tokens..."
ADMIN_TOKEN="$(get_token "$ADMIN_EMAIL" "$ADMIN_PASS" || true)"
DOCENTE_TOKEN="$(get_token "$DOCENTE_EMAIL" "$DOCENTE_PASS" || true)"
ALUMNO_TOKEN="$(get_token "$ALUMNO_EMAIL" "$ALUMNO_PASS" || true)"

if [[ -z "${ADMIN_TOKEN:-}" ]]; then echo "ADMIN_TOKEN not set (missing credentials?). Admin requests will still run but may return 401."; fi
if [[ -z "${DOCENTE_TOKEN:-}" ]]; then echo "DOCENTE_TOKEN not set (missing credentials?)."; fi
if [[ -z "${ALUMNO_TOKEN:-}" ]]; then echo "ALUMNO_TOKEN not set (missing credentials?)."; fi

echo
echo "============================= START TESTS ============================="
echo

echo "### /grupos/ (GET list)"
# 1) /grupos/
echo "### /grupos/ (GET list)"
req GET "/grupos/" "admin"   "${ADMIN_TOKEN:-}"   "admin puede ver todos los grupos"
req GET "/grupos/" "docente" "${DOCENTE_TOKEN:-}" "docente ve solo sus grupos asignados"
req GET "/grupos/" "alumno"  "${ALUMNO_TOKEN:-}"  "alumno ve solo su grupo"
req GET "/grupos/" "anon"    ""                   "anónimo no puede ver grupos (espera 401)" 401

echo "### /materias/ (GET list)"
# 2) /materias/
echo "### /materias/ (GET list)"
req GET "/materias/" "admin"   "${ADMIN_TOKEN:-}"   "admin puede ver todas las materias"
req GET "/materias/" "docente" "${DOCENTE_TOKEN:-}" "docente ve solo materias asignadas"
req GET "/materias/" "alumno"  "${ALUMNO_TOKEN:-}"  "alumno ve solo materias de su grupo"
req GET "/materias/" "anon"    ""                   "anónimo no puede ver materias (espera 401)" 401

echo "### /alumnos/ (GET list + optional retrieve)"
# 3) /alumnos/
echo "### /alumnos/ (GET list + optional retrieve)"
req GET "/alumnos/" "admin"   "${ADMIN_TOKEN:-}"   "admin puede ver todos los alumnos"
req GET "/alumnos/" "docente" "${DOCENTE_TOKEN:-}" "docente ve solo alumnos de sus grupos"
req GET "/alumnos/" "alumno"  "${ALUMNO_TOKEN:-}"  "alumno ve solo su propio registro"
req GET "/alumnos/" "anon"    ""                   "anónimo no puede ver alumnos (espera 401)" 401
# Optional retrieve for alumno (self). Update ALUMNO_ID accordingly.
req GET "/alumnos/${ALUMNO_ID}/" "alumno (self)"  "${ALUMNO_TOKEN:-}" "alumno puede ver su propio perfil"

echo "### /docentes/ (GET list + retrieve)"
# 4) /docentes/
echo "### /docentes/ (GET list + retrieve)"
req GET "/docentes/" "admin"   "${ADMIN_TOKEN:-}"   "admin puede ver todos los docentes"
req GET "/docentes/" "docente (expect 403 for list)" "${DOCENTE_TOKEN:-}" "docente no puede listar docentes (espera 403)" 403
req GET "/docentes/" "anon"    ""                   "anónimo no puede ver docentes (espera 401)" 401
# Docente retrieve self:
req GET "/docentes/${DOCENTE_ID}/" "docente (self)" "${DOCENTE_TOKEN:-}" "docente puede ver su propio perfil"

echo "### /grupomaterias/ (GET list)"
# 5) /grupomaterias/
echo "### /grupomaterias/ (GET list)"
req GET "/grupomaterias/" "admin"   "${ADMIN_TOKEN:-}"   "admin puede ver todas las relaciones grupo-materia"
req GET "/grupomaterias/" "docente" "${DOCENTE_TOKEN:-}" "docente ve solo sus relaciones grupo-materia activas"
req GET "/grupomaterias/" "alumno"  "${ALUMNO_TOKEN:-}"  "alumno ve solo relaciones de su grupo"
req GET "/grupomaterias/" "anon"    ""                   "anónimo no puede ver relaciones grupo-materia (espera 401)" 401

echo
echo "============================== OPTIONAL ==============================="
echo "Below are optional mutations. Uncomment to try (admin only)."
echo "They demonstrate expected 201/400/403 behaviors per tu lógica de vistas."
echo
cat <<'EOF'
# Example: create a group (admin should get 201; others 403)
# req POST "/grupos/" "admin" "$ADMIN_TOKEN" "admin puede crear grupo" '{"nombre":"1-A","grado":1,"turno":"matutino"}'

# Example: delete a group (admin). If group has alumnos or GrupoMateria, expect 400 by your validations.
# req DELETE "/grupos/ID_DEL_GRUPO/" "admin" "$ADMIN_TOKEN" "admin puede eliminar grupo (si no tiene relaciones)"
EOF
echo
echo "============================== RESULTADOS ==============================="
echo "Pruebas exitosas: $TEST_PASS/$TEST_TOTAL"
echo "Pruebas fallidas: $TEST_FAIL/$TEST_TOTAL"
if [[ $TEST_FAIL -gt 0 ]]; then
  echo "--- Pruebas fallidas:"
  for fail in "${FAILED_TESTS[@]}"; do
    echo "  - $fail"
  done
fi
echo "=========================================================================="
