# ESTADO

Estado: Instalación verificada (`doctor.ts` 13/13 ✔ con refresco automático de `PATH` en Windows, `tsc --noEmit` y `vitest run` en verde con 0 fallos), perfil `creador.json` (`Luxline CR`, `@luxline.cr`, `instagram, tiktok`, `es`, `estilo_activo: luxline-cr-oficial`), estilo `luxline-cr-oficial` (`en-prueba`) y salida final estándar `1080×1920` (`scale: 0.75` en `render.ts` / `qa.ts`) listos; esperando el primer video crudo (Paso 5 de `/empezar`).

## Qué se hizo

- Se implementó `leerPathRegistroWindows` y la fusión con `pathAmpliado`/`refrescarPath` en `herramientas/instalar.ts` (y `refrescarPathWindows` en `herramientas/doctor.ts`), leyendo `Machine` + `User` `Path` del registro de Windows y aplicándolo a `process.env.Path` y `process.env.PATH`, con prueba unitaria nueva en `pruebas/unit/instalar.test.ts`.
- Se actualizó `pruebas/unit/hook.test.ts` a `.agents/hooks/vigilar-bash.mjs` y se añadió `hookSpecificOutput` compatible en `negarAntigravity` de `.agents/hooks/vigilar-bash.mjs`.
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

- Recibir la ruta del primer video crudo para editarlo con `/editar` (Paso 5 de `/empezar`).
- Confirmar más adelante si el usuario aprueba eliminar `.claude.bak/` y `CLAUDE.md.bak`.

## Decisiones

- Se mantuvo la ruta literal `~/.config/claude-editor/.env` en reglas y documentación porque `herramientas/lib/llaves.ts` y `herramientas/doctor.ts` leen esa ruta en código.
- `revisor-qa` se migró como skill y workflow (`/revisor-qa`), con opción de delegarse a un subagente `self` vía `invoke_subagent`.
- Los permisos y restricciones de sandbox de `.claude/settings.json` se trasladaron a `.agents/rules/seguridad.md` y `.agents/hooks.json` (`vigilar-bash.mjs`), ya que Antigravity IDE no aplica un sandbox de SO por comando ni bloqueos declarativos de herramientas equivalentes a `permissions.deny`/`ask`.
- Se normalizan a `/` las rutas relativas guardadas en `manifest.json` y estructuras equivalentes, y `instalar.ts`/`doctor.ts` refrescan `process.env.Path`/`PATH` desde el registro `Machine`+`User` en Windows para detectar instalaciones recientes de `winget` sin reabrir la terminal.
