---
description: Aplica correcciones a un reel ya editado en una versión nueva y guarda preferencias en el perfil (/ajustar).
---
# /ajustar

Sigue el procedimiento completo de `.agents/skills/ajustar/SKILL.md`:

1. **Identifica proyecto y versión:** toma el `<slug>` indicado o el último editado en `proyectos/`, y localiza la versión más alta `edicion-vN.json`.
2. **Crea versión nueva (sin sobrescribir vN):** corre `npx tsx herramientas/ajustar.ts <slug> --desde N`.
3. **Aplica únicamente los cambios pedidos** en `edicion-v(N+1).json` con herramientas de archivos (coordenadas base 1080×1920).
4. **Valida y verifica el diff:** corre de nuevo `npx tsx herramientas/ajustar.ts <slug> --desde N`.
5. **Render y QA:** corre `npx tsx herramientas/render.ts <slug> --version N+1` y `npx tsx herramientas/qa.ts <slug> --version N+1` por separado.
6. **Preferencias generales:** si el cambio es una preferencia permanente, registra la frase literal del creador con fecha en `estilo/estilos/<id>/perfil.md` y actualiza `perfil.json` (`motor`).
