---
description: Entrena un nuevo estilo de edición desde creadores y videos de referencia nombrados por el creador (/entrenar-estilo).
---
# /entrenar-estilo

Sigue el ciclo completo de `.agents/skills/entrenar-estilo/SKILL.md`:

1. **Recoge en una sola pregunta:** nombre del estilo (`estilo-<nombre>`), referencias (1–2 `@perfiles` y/o links/MP4s), qué le gusta literalmente, si es independiente o mezclado, y crudo de prueba.
2. **Crea el perfil `en-prueba`:** copia `estilo/estilos/_plantilla/` a `estilo/estilos/<id>/` y regístralo en `estilo/estilos/estilos.json`.
3. **Descarga y analiza referencias:** usa `npx tsx herramientas/estilo/referencia.ts <mp4|URL> --estilo <id>` (Apify o Gemini requieren costo explicado y "sí" en el mismo turno). Mide con `medir.ts`, `medir-capas.ts` y `overlays.ts` (cada uno standalone) e inspecciona `hoja.jpg` y `gancho.jpg`.
4. **Redacta perfil y valida:** llena `perfil.md` y `perfil.json` → `motor`, muestra el resumen con números y `n`, y espera confirmación.
5. **Prueba en crudo e itera** hasta que el creador apruebe el resultado (`"estado": "aprobado"`).
