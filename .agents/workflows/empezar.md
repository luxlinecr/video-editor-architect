---
description: Configuración guiada paso a paso del creador, dependencias, estilo y primer reel (/empezar).
---
# /empezar

Sigue paso a paso las instrucciones completas de `.agents/skills/empezar/SKILL.md` (una pregunta a la vez, en el idioma elegido por el creador en `creador.json` → `idioma`):

1. **Idioma:** pregunta si prefiere trabajar en español o inglés (si no existe `creador.json`).
2. **Instalación:** corre `npx tsx herramientas/instalar.ts` (solo plan), explica qué falta y cuánto descarga, y corre `--si` únicamente tras su confirmación explícita; confirma con `npx tsx herramientas/doctor.ts`.
3. **Perfil (`creador.json`):** copia `creador.example.json` si no existe y pide nombre, handle y plataforma.
4. **Origen del estilo:** pregunta si aprender de sus propios reels (`/aprender-estilo`), entrenar desde creadores que nombre (`/entrenar-estilo`) o iniciar con `base-neutra`.
5. **Primer reel y ajustes:** edita el primer crudo con `/editar`, aplica correcciones con `/ajustar` y guarda preferencias hasta que quede `"estado": "aprobado"`.
6. **Cierre:** actualiza `ESTADO.md`.
