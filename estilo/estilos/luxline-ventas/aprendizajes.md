# Aprendizajes del estilo Luxline Ventas

Bitácora técnica del estilo con motion completo (`5 técnicas`) de LUXLINE CR.

## Recorrido por versiones

| Versión | Qué cambió | Qué dijo el creador |
|---|---|---|
| v1 (2026-11-14) | Alta desde `LUXLINE-BRAND-KIT-v3` con las 5 técnicas de `src/reel/motion/luxline/` activadas y sincronía conectada a `transcripcion.json` (sin aplicar paletas hasta confirmar). | "Crea el estilo luxline-ventas con las 5 técnicas activadas y regístralo en estilos.json." |

## Cómo se hace cada cosa
- **Escala y FPS:** el editor renderiza `Reel` a `30 fps` (`1440×2560`, salida final `1080×1920` con `scale: 0.75`), mientras que `Luxline-Style-Demo` corre a `60 fps` y `600` cuadros (`1080×1920`). Al usar `Techniques.tsx` dentro de `Reel`, los helpers calculan tiempos desde `fps` (`useVideoConfig()`) y el lienzo base `1080×1920` se adapta con `width / 1080`.
- **Sincronía por palabra real:** `cuesDesdeTranscripcion(transcripcion, dictionary, fps)` toma `{ t, d, h }` de `transcripcion.json` / `transcripcion-base.json` (o `edicion.subtitulos`) y produce cues ordenados sin superposición para `SpeechVisualSync` con `simulation={false}`.
- **Zona segura:** `ZONA_SEGURA_LUXLINE` y `acotarPoseZonaSegura` imponen `ZONA_SEGURA.capas` de `src/estilo/zona-segura.ts` (`x: 135–945`, `y: 220–1600`) por encima de la zona más estrecha del kit (`x: 90–900`, `y: 280–1240`).

## Qué no funcionó (del historial v3 del kit)
- Videos secos, estáticos o repetitivos basados en cambiar texto de tres tarjetas idénticas sin continuidad ni beneficio concreto.
- `fondo-mesh-elevenlabs.png` y `foto-producto.jpg`: excluidos del pipeline de video y bloqueados por `esAssetProhibido()`.

## Costos
| Fecha | Servicio | Qué | Costo |
|---|---|---|---|
