---
description: Administra la biblioteca de efectos de sonido con licencia, catalogación y selección sin repetir (/sfx).
---
# /sfx

Sigue las instrucciones de `.agents/skills/sfx/SKILL.md`:

1. **Agregar sonidos propios o CC0:** colócalos en `biblioteca/sfx/_originales/<fuente>/`, define `biblioteca/sfx/seleccion.json`, corre `npx tsx herramientas/sfx/catalogar.ts [--sin-red]` y registra cada licencia en `biblioteca/LICENCIAS.md`.
2. **Fuentes permitidas:** respeta `creador.json` → `sfx.solo_fuentes`.
3. **Elegir para una edición:** `npx tsx herramientas/sfx/elegir.ts --edicion proyectos/<slug>/edicion-vN.json --salida proyectos/<slug>/edicion-v(N+1).json` (agrega `--guardar-historial` solo al aprobar final).
4. **Revisar catálogo:** `npx tsx herramientas/sfx/catalogar.ts --solo-revisar`.
