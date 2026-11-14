# ESTADO

Estado: Borrador `v1` listo para revisión de [2026-11-14-s26-ultra-privacy](proyectos/2026-11-14-s26-ultra-privacy/salida/borrador-v1.mp4) (`25 s`, `750` cuadros, `cumple 3 de 3 checks (0 N/A)` en QA y `cumple 3 de 3 reglas (10 N/A)` en `validar.ts`), con el perfil `luxline-cr-oficial` intacto y verificación de tipos/pruebas (`tsc --noEmit` en 0, `motion.test.ts` `15/15`).

## Qué se hizo

- Se registró el motion `privacy-s26` en `src/estilo/motion.ts` (`MotionPrivacyS26`, `NOMBRES_MOTION`, `resolverMotion`, `duracionMinimaMotion`) y se conectó en `src/reel/motion/MotionInsert.tsx` como escena completa `1080×1920`.
- Se creó el componente `src/reel/motion/PrivacyDisplayS26.tsx` (`25 s`, `750` cuadros a `30 fps`) con las 6 escenas solicitadas: cámara dinámica (`<CamaraEscena>`), revelado de texto con máscara (`<TextoMascara>`), movimientos encadenados, silueta del usuario + espía con lupa vectorial (`<EspiaConLupa>`), Galaxy S26 Ultra 3D con giro a `45°`/`58°`, medidor sincronizado `"100 %"` → `"3.5 %"` (`<IndicadorAngulo>`), rotación vertical/horizontal con pantalla PIN gráfica y transformación de objeto (`<TelefonoYMorph>`) al emblema geométrico de Luxline CR; únicamente muestra los 6 textos autorizados del guion dentro de la zona segura de Reels.
- Se creó el proyecto aislado `proyectos/2026-11-14-s26-ultra-privacy/` (`base.mp4` de `25 s` y `edicion-v1.json`) sin modificar `estilo/estilos/luxline-cr-oficial/`, se validó (`validar.ts`: `cumple 3 de 3 reglas (10 N/A)`), se renderizó el borrador (`borrador-v1.mp4`, `720×1280`, `1.9 MB`, `85.3 s`), se ejecutó QA (`qa.ts`: `cumple 3 de 3 checks (0 N/A)`) y se inspeccionó `qa/v1/hoja-01.jpg`.

- Se creó el proyecto aislado `proyectos/2026-11-14-iphone-13/` (prueba de motion para venta de iPhone 13 Negro 128 GB sin modificar `estilo/estilos/luxline-cr-oficial/`, `src/` ni `C:\Users\jerem\Downloads\20261114_150814.mp4`), omitiendo transcripción/corte de silencios al trabajar por ritmo visual (`base.mp4`, `655` cuadros, `21.833 s`, `subtitulos: []`) y limitando todo texto en pantalla a `"iPhone 13"`, `"128 GB"` y `"Negro"`.
- Se corrigió `herramientas/render.ts` en Windows (`process.platform === 'win32'`) para evitar el `EPERM` de `@remotion/bundler` al copiar junctions de `public/`, enlazando `public/` al bundle generado mediante `'junction'` (compatibilidad con `borrarBundle`); `npx vitest run pruebas/unit/render.test.ts` (`27 passed | 4 skipped`) y `npx tsc --noEmit` (código `0`) pasaron.
- Se iteraron `edicion-v1.json` → `edicion-v2.json` → `edicion-v3.json` tras inspeccionar hojas de contacto (`qa/v1`–`v3`): se reemplazó el artefacto de espejo de `desenfoque` por un push-in de zoom encadenado y se reubicaron `t_cap_3` y `tv_cierre` eliminando solapes; `borrador-v3.mp4` (`720×1280`, `655` cuadros) pasó `validar.ts` (`6 de 6 reglas (7 N/A)`) y `qa.ts` (`3 de 3 checks (0 N/A)`).
- Se implementó `leerPathRegistroWindows` y la fusión con `pathAmpliado`/`refrescarPath` en `herramientas/instalar.ts` (y `refrescarPathWindows` en `herramientas/doctor.ts`), leyendo `Machine` + `User` `Path` del registro de Windows y aplicándolo a `process.env.Path` y `process.env.PATH`, con prueba unitaria nueva en `pruebas/unit/instalar.test.ts`.
- Se verificó el hook `PreToolUse` de Antigravity en `.agents/hooks/vigilar-bash.mjs` (`negarAntigravity` con `{decision, reason}` sin `hookSpecificOutput` y `negarLegado` intacto), se eliminaron con aprobación del creador los respaldos `.claude.bak/` y `CLAUDE.md.bak`, y se guardó en Git (`34f4f47` / `eed8082`).
- Se actualizó `pruebas/unit/hook.test.ts` a `.agents/hooks/vigilar-bash.mjs` (`44/44` pasan).
- Se registraron las licencias OFL-1.1 de las fuentes en `biblioteca/LICENCIAS.md` y `"Claude Code"` en `biblioteca/vocabulario.json`, se normalizaron separadores `/` y rutas de Windows en `herramientas/` (`lib/inserts.ts`, `lib/manifest.ts`, `lib/perfil-estilo.ts`, `lib/llaves.ts`, `grabador/secretos.ts`, `estilo/corpus.ts`) y se corrigieron las pruebas dependientes de Windows/fixtures opcionales (`npx vitest run`: 59 archivos pasaron, 1 omitido por ausencia de fixtures opcionales, 1534 tests pasaron, 77 omitidos, 0 fallos).

- Se actualizó `herramientas/instalar.ts` (`WINGET_YA_INSTALADO = 0x8a15002b` / `2316632107` y `codigoExitoso`) para tratar como éxito el código de `winget` cuando un paquete ya está instalado sin actualización, junto con `unir()`/`posix.join` para pruebas multiplataforma y su test en `pruebas/unit/instalar.test.ts` (`24/24` pasan; `tsc --noEmit` sin errores).
- Se actualizó `herramientas/render.ts` (`RENDER.final = {escala: 0.75, ancho: 1080, alto: 1920}`), `herramientas/qa.ts` y `pruebas/unit/render.test.ts` para que el render final estándar salga y se verifique en `1080×1920`, manteniendo intacta la posición relativa de subtítulos, tarjetas y zona segura (`(4/3) × 0.75 = 1.0`).
- Se creó el estilo propio `estilo/estilos/luxline-cr-oficial/` (`en-prueba`, v1, copia de `base-neutra`) con `exportar_4k.si_crudo_4k = false`, preferencia de salida `1080×1920` y la cita literal del creador en el historial; se registró en `estilo/estilos/estilos.json` y se activó en `creador.json` (`estilo_activo: luxline-cr-oficial`).
- Se completó el perfil en `creador.json` con nombre (`Luxline CR`), handle (`luxline.cr`), plataforma (`instagram, tiktok`), idioma (`es`) y `estilo_activo`.
- Se agregaron los hashes `sha256Win` deterministas de Windows x64 para `Inter` en `herramientas/lib/fuentes-ofl.ts`, se completó `npx tsx herramientas/instalar.ts --si` (todas las fuentes OFL listas), pasó `npx tsx herramientas/doctor.ts` (`13 de 13 ✔`) y `npx tsc --noEmit`.
- Se ejecutó `npm ci` (dependencias de Node y enlaces de `public/` creados) y se instalaron `uv`, `yt-dlp`, `.venv` de Python 3.12 (fonttools, skia-pathops, RapidOCR, MediaPipe), Chromium de Playwright, whisper.cpp, modelo VAD silero y modelo `large-v3` de Whisper.
- Se respaldó `CLAUDE.md` en `CLAUDE.md.bak` y se renombró `.claude/` a `.claude.bak/`.
- Se fusionaron las reglas principales en `AGENTS.md` (< 12 000 caracteres) sin referencias a Claude/Claude Code y se dejó `CLAUDE.md` como puntero corto a `AGENTS.md`.
- Se creó `.agents/rules/seguridad.md` con las reglas de seguridad, permisos y `playwright-cli` (`trigger: always_on`).
- Se migraron los 8 skills a `.agents/skills/<nombre>/SKILL.md` y el subagente `revisor-qa` a `.agents/skills/revisor-qa/SKILL.md`.
- Se crearon los 9 workflows invocables con `/` en `.agents/workflows/*.md`.
- Se adaptó el hook `vigilar-bash.mjs` en `.agents/hooks/vigilar-bash.mjs` y `.agents/hooks.json` para el contrato `PreToolUse` (`run_command`) de Antigravity IDE.
- Se actualizaron `README.md`, `README.en.md` y las guías en `docs/`.

## Qué sigue

- Revisar visualmente `proyectos/2026-11-14-s26-ultra-privacy/salida/borrador-v1.mp4` y confirmar si pasamos a render final (`1080×1920`) o ajustamos algún tiempo o encuadre en una `v2`.
- Pendiente anterior: revisar `proyectos/2026-11-14-iphone-13/salida/borrador-v3.mp4` para confirmar su render final.

## Decisiones

- Para el video 100 % código de `2026-11-14-s26-ultra-privacy`, se encapsuló toda la animación en un insert `motion:privacy-s26` a pantalla completa (`1080×1920`) en `src/reel/motion/PrivacyDisplayS26.tsx` para dejar intacto `estilo/estilos/luxline-cr-oficial/` y aprovechar `validar.ts`, `render.ts` y `qa.ts`.
- En `PrivacyDisplayS26.tsx`, la capa tipográfica (`<TextoMascara>` e `<IndicadorAngulo>`) vive en un HUD fijo dentro de la zona segura (`x: 135–945, y: 220–1600`) separado de `<CamaraEscena>`, evitando que el zoom `1.34×` empuje textos fuera de márgenes; el signo `?` sobre el espía y el emblema final se dibujaron con SVG puro sin nodos `<text>`.

- En Windows (`render.ts`), al construir el bundle de Remotion se omite el `copyDir()` de `@remotion/bundler` sobre `public/` (que arroja `EPERM` en junctions sin Modo de desarrollador) y se enlaza `outDir/public` hacia `public/` mediante `'junction'`.
- Para `proyectos/2026-11-14-iphone-13/`, `desenfoque` (`ConDesenfoque`) mostró bordes reflejados tipo espejo en el borrador `v1`, por lo que se optó por una transformación basada en push-in de zoom encadenado (`z_trans`) + apertura de píldora y entrada de texto sincronizada sin editar `src/`.

- Se mantuvo la ruta literal `~/.config/claude-editor/.env` en reglas y documentación porque `herramientas/lib/llaves.ts` y `herramientas/doctor.ts` leen esa ruta en código.
- `revisor-qa` se migró como skill y workflow (`/revisor-qa`), con opción de delegarse a un subagente `self` vía `invoke_subagent`.
- Los permisos y restricciones de sandbox de `.claude/settings.json` se trasladaron a `.agents/rules/seguridad.md` y `.agents/hooks.json` (`vigilar-bash.mjs`), ya que Antigravity IDE no aplica un sandbox de SO por comando ni bloqueos declarativos de herramientas equivalentes a `permissions.deny`/`ask`.
- Se normalizan a `/` las rutas relativas guardadas en `manifest.json` y estructuras equivalentes, y `instalar.ts`/`doctor.ts` refrescan `process.env.Path`/`PATH` desde el registro `Machine`+`User` en Windows para detectar instalaciones recientes de `winget` sin reabrir la terminal.
