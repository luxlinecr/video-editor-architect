---
trigger: always_on
---
# Reglas de seguridad y permisos (Antigravity IDE)

Antigravity IDE no ejecuta un sandbox del sistema operativo por comando ni aplica automáticamente las listas `deny`/`ask` heredadas de otros agentes. Estas reglas reemplazan esas protecciones y son obligatorias en todo momento:

## 1. Archivos y credenciales prohibidos (equivale a `deny` / `denyRead`)

Nunca leas, copies, imprimas ni inspecciones (con herramientas de archivos ni de terminal) las siguientes rutas:
- `~/.config/claude-editor/**` (archivo de llaves `.env` y configuración de secretos)
- `~/Library/Application Support/claude-editor/estudio-chrome/**` (perfil persistente de Chrome del creador)
- Cualquier archivo `**/ig_cookies.txt` o `**/cookies.txt`
- Las variables de entorno `GEMINI_API_KEY`, `GOOGLE_API_KEY` y `APIFY_TOKEN` nunca deben imprimirse ni pasarse a comandos que las expongan. Solo `herramientas/lib/llaves.ts` las carga internamente; para comprobar su existencia usa únicamente `npx tsx herramientas/doctor.ts`.

## 2. Gastos y servicios de pago (equivale a `ask`)

Pide confirmación explícita al creador **en el mismo turno** antes de:
- Ejecutar cualquier comando que incluya `--si-gasto` (o `--si-gasto=<monto>`).
- Invocar herramientas MCP o servicios de pago (por ejemplo Apify o Gemini).
Indica primero qué se va a ejecutar, cuántos elementos procesará y el costo estimado.

## 3. Reglas estrictas para `playwright-cli`

El hook `.agents/hooks.json` (`vigilar-bash.mjs`) vigila `run_command`, pero el agente también debe respetar estas restricciones sin intentar rodearlas:
- **Verbos permitidos únicamente:** `open`, `goto`, `snapshot`, `click`, `type`, `press`, `screenshot`, `close`, `list`.
- **Prohibido:** `cookie-list`, `cookie-get`, `state-save`, `localstorage-list`, `eval`, `run-code`, `console`, `attach`, etc.
- **Opciones prohibidas:** `--profile`, `--persistent`, `--config`, `--user-data-dir`, `--extension`, `--cdp`, `--cdp-endpoint`, `--storage-state`, `--isolated` (y sus formas con un guion). `--path`/`--file` solo se permiten con `screenshot`.
- **Variables prohibidas:** cualquier `PLAYWRIGHT_MCP_*` o `PLAYWRIGHT_CLI_*` (salvo `PLAYWRIGHT_MCP_PROXY_SERVER`).
- **Sin envoltorios:** nunca ejecutes `playwright-cli` dentro de `sh -c`, `bash -c`, `python -c`, `node`, `eval`, `$(...)`, backticks, `xargs` o `sudo`; invócalo directo como `npx playwright-cli ...`.
- **No escribir en `.playwright/`:** nunca crees ni modifiques archivos dentro de `.playwright/` (su configuración podría volver persistente la sesión).

## 4. Integridad del workspace y originales

- No modifiques, muevas ni borres archivos originales en `~/Downloads`, `entrada/` ni carpetas de otros proyectos.
- No edites `.agents/` mediante comandos de shell; usa las herramientas de edición de archivos (`write_file`, `edit_file`).
- En Windows nativo no hay sandbox del sistema operativo: verifica doblemente cada comando antes de correrlo y no toques rutas fuera del proyecto salvo las cachés explícitas del instalador (`~/.cache/video-editor/` o `%LOCALAPPDATA%\ms-playwright`).
