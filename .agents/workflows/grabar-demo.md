---
description: Graba una demo de pantalla web (2560×1600) con clics, scroll y zoom para usarla como insert (/grabar-demo).
---
# /grabar-demo

Sigue las instrucciones de `.agents/skills/grabar-demo/SKILL.md`:

1. **Prepara `demos/<slug>/`:** crea `sitios.txt` (dominios permitidos), `guion.json` (`riesgo` por paso, `tema: "oscuro"` por defecto; acciones fuera de `lectura` requieren `aprobado: true` con "sí" del creador) y `ocultar.json` opcional.
2. **Explora (opcional):** `npx tsx herramientas/grabador/estudio.ts explorar <url> --slug <slug> --sin-sesion`.
3. **Graba:** `npx tsx herramientas/grabador/estudio.ts grabar <slug> --guion demos/<slug>/guion.json [--sin-sesion]` en su propia llamada de `run_command`.
4. **Revisión de secretos:** si `revision.json` marca `BLOQUEADA`, recorta el guion para evitar el dato sensible o pide al creador que apruebe la toma en su terminal (`npx tsx herramientas/grabador/estudio.ts revision <slug> --aprobar`).
5. **Inserta en la edición:** agrega el insert `tipo: "demo"` en `notas-director.json` → `inserts` o en la EDL.
