---
description: Crea o procesa stickers para reels a partir de logos con licencia y PNGs propios del creador (/stickers).
---
# /stickers

Sigue las instrucciones de `.agents/skills/stickers/SKILL.md`:

1. **Logos de marca (Simple Icons CC0 / svgl MIT):** `npx tsx herramientas/stickers/logo.ts --marcas <lista>` o `--lista`.
2. **PNGs propios (`entrada/`):** `npx tsx herramientas/stickers/procesar.ts entrada/stickers/ --destino biblioteca/stickers/propios --etiquetas c1,c2` en su propia llamada de `run_command`.
3. **Generadores de pago:** solo uno por solicitud, tras decir qué se generará y cuánto cuesta, y con el "sí" explícito del creador en el mismo turno.
4. Registra toda licencia nueva en `biblioteca/LICENCIAS.md` y nunca repitas el mismo asset en un reel.
