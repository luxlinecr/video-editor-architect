---
description: Revisa un reel ya renderizado (hojas de contacto, reporte, validar.ts y frames) y emite un veredicto de QA (/revisor-qa).
---
# /revisor-qa

Revisa un reel ya renderizado (`proyectos/<slug>/`, versión N) siguiendo estrictamente `.agents/skills/revisor-qa/SKILL.md`. Es de **solo lectura / revisión** (no edita la EDL ni renderiza).

1. **Bloqueantes para publicar:**
   - Corre `npx tsx herramientas/validar.ts proyectos/<slug>/edicion-vN.json` y reporta cada `FAIL` con su número de regla y origen.
   - Verifica en `reporte.md` / `reporte.json`: sonoridad (`−14 ±1 LUFS`), true peak (`≤ −1 dBTP`), conteo de cuadros (`round(duración × 30)`) y desfase audio/video (`≤ 1 cuadro`).
   - Inspecciona con `read_file` las hojas `qa/vN/hoja-*.jpg`: texto cortado, capas sobre la cara (si el estilo no lo permite), subtítulos tapados, datos sensibles o cuadros congelados/negros, y ortografía frente a `transcripcion-base.json` y `biblioteca/vocabulario.json`.
2. **Costos:** verifica que no haya assets pagados sin registro de aprobación del creador ni ejecuciones no autorizadas con `--si-gasto`.
3. **Estética (con números y fuentes contra el perfil del estilo):** ritmo, sincronía de tarjetas/SFX, forma/longitud de textos, y animación de 3 stickers al azar con `ffmpeg`.
4. **Entrega:** veredicto en la primera línea (`"Listo para subir"`, `"Listo con avisos"` o `"No subir todavía"`, con `"cumple X de Y checks (Z N/A)"`) y las tres secciones con cada dato citado con su fuente.
