---
description: Edita un reel de principio a fin con el estilo del creador y entrega el MP4 final (/editar).
---
# /editar

Sigue el flujo completo definido en `.agents/skills/editar/SKILL.md` y las reglas de `AGENTS.md` y `.agents/rules/seguridad.md`:

1. **Estilo:** usa el estilo que el creador nombró; si no nombró ninguno, pregúntale cuál usar (`estilo/estilos/estilos.json`) y lee `perfil.md`, `perfil.json` y `aprendizajes.md`.
2. **Texto (Checkpoint 1):** corre `npx tsx herramientas/editar.ts <crudo> [--slug YYYY-MM-DD-tema]` en su propia llamada de `run_command`. Revisa `texto-propuesto.md`, corrige nombres propios en `biblioteca/vocabulario.json`, limpia repeticiones/muletillas y presenta el guion para aprobación.
3. **Base, cara, subtítulos y dirección (Checkpoint 2):** corre `npx tsx herramientas/editar.ts --slug <slug> --aprobar-texto`. Decide titular, tarjetas, prompts, stickers, demos (`/grabar-demo`), inserts y SFX en `proyectos/<slug>/notas-director.json`, corre `npx tsx herramientas/director.ts <slug>` y revisa `direccion.md`.
4. **Borrador y revisión (Checkpoint 3):** corre `npx tsx herramientas/editar.ts --slug <slug> --borrador`, ejecuta la revisión con `/revisor-qa` e inspecciona las hojas de contacto (`qa/vN/hoja-*.jpg`).
5. **Final:** corre `npx tsx herramientas/editar.ts --slug <slug> --final --version N` y entrega `salida/final-vN.mp4` con `"cumple X de Y checks (Z N/A)"`.
