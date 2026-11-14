---
description: Aprende el estilo de edición del creador a partir de sus propios reels publicados (/aprender-estilo).
---
# /aprender-estilo

Sigue el procedimiento completo de `.agents/skills/aprender-estilo/SKILL.md`:

1. **Obtén los reels del creador (`creador.json` → `corpus`):** usa solo sus propios reels (yt-dlp gratis, carpeta local de MP4s, o Apify solo con su "sí" explícito en el mismo turno y costo indicado).
2. **Corpus y muestra:** corre `npx tsx herramientas/estilo/corpus.ts --muestra`.
3. **Medición local:** corre `npx tsx herramientas/estilo/aprender.ts --muestra` en una llamada independiente de `run_command`.
4. **Perfil:** resume los hallazgos con números y su `n` a partir de `estilo/estilo.json` e `informe.md`, y crea o actualiza `estilo/estilos/<handle>-oficial/` (`en-prueba`) consultando las decisiones que no salen de los datos.
5. **Semántica opcional (Gemini):** solo con su "sí" explícito y `--si-gasto=<monto>`.
