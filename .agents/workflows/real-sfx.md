---
description: Sonoriza videos de motion graphics o renders MP4 con librerías reales locales y cues CC0 de uisfx (/real-sfx).
---
# /real-sfx

Sigue las instrucciones de `.agents/skills/real-sfx/SKILL.md` (con las reglas de `AGENTS.md` y `.agents/rules/seguridad.md`):

1. **Revisar entorno:** `.venv\Scripts\python.exe .agents\skills\real-sfx\scripts\setup.py check`
2. **Conectar biblioteca local (si aplica):** `.venv\Scripts\python.exe .agents\skills\real-sfx\scripts\setup.py add-library <nombre> "<carpeta>" --index`
3. **Analizar video / momentos / cues:** usa `look.py`, `from_cues.py`, `find_moments.py` y `suggest_cues.py` desde `.venv\Scripts\python.exe` con `PYTHONUTF8=1` guardando salidas en `proyectos/<slug>/real-sfx/` o `out/`.
4. **Mezclar y evaluar:** `mix.py` (con `--voice-safe` si hay voz), seguido de `verify.py`, `review.py` y `critique.py`.
5. **Licencias y descargas:** registra en `biblioteca/LICENCIAS.md` cualquier clip exportado hacia `biblioteca/`, y pide confirmación explícita al creador antes de ejecutar `listen.py install --yes`, `hear.py install --yes` o servicios en la nube.
