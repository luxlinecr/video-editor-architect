---
trigger: always_on
---
# LUXLINE CR — Marca, Identidad y Video

Guía operativa obligatoria de **LUXLINE CR (`luxline.tech`)** basada en `assets/marca/docs/BRAND-IDENTITY.md`, `assets/marca/docs/ESTILO-DE-VIDEO.md`, `assets/marca/motion/MOTION-TRANSITIONS.md` y `estilo/luxline-marca.json`.

## 1. Identidad, tono y reglas editoriales

- **Marca y dominio:** `LUXLINE CR · luxline.tech`. Categorías: Android, iPhone, accesorios y **Seminuevos** (evitar *usado* o *reacondicionado*).
- **Voz y enfoque:** español costarricense cercano y confiable con voseo en piezas de marca (`Mirá`, `Elegí`, `Encontrá`). Una idea principal por beat, producto o beneficio real como protagonista y **un CTA**.
- **Prohibiciones editoriales:** nunca inventar precios, existencias, garantías ni compatibilidad; no usar mockups de otra familia como un modelo real; **cero avisos legales, créditos ni textos de «información oficial» en video**.
- **Audio por defecto de piezas gráficas:** música y efectos sin narración; la voz solo entra en piezas aprobadas.
- **Imágenes prohibidas en video:** **NUNCA usar `fondo-mesh-elevenlabs.png` ni `foto-producto.jpg`** en ningún render, EDL ni secuencia (verificado también por `esAssetProhibido` en `src/reel/motion/luxline/Techniques.tsx`).

## 2. Tipografía, logos y color

- **Tipografía:** `Noto Sans Display` variable `100–900` (`biblioteca/fuentes/NotoSansDisplay-Variable.ttf`; titulares `500–700` ~`72–96 px`, cuerpo `400–500` ~`38–48 px`) y `Noto Sans Mono` `400` (`biblioteca/fuentes/Mono-Regular.ttf`; datos técnicos `28–34 px`, sin falsificar otros pesos). Esperar carga con `delayRender`/`FontFace`.
- **Logos:** usar siempre los assets oficiales de `assets/marca/logos/` (`logo-negro.svg` sobre fondo claro, `logo-blanco.svg` sobre oscuro); nunca reconstruir el logo con texto ni deformarlo.
- **Paletas y material:** definidas por universo (`android`, `iphone`, `accessories`) en `estilo/luxline-marca.json`. No teñir con colores históricos ni mezclar las tres paletas sin motivo. Verde `#22C55E` solo para estados activos con etiqueta. Usar tarjetas *liquid glass 2.5D* (`glass-motion.ts`) únicamente cuando aporten claridad, sin repetir una plantilla fija de tres tarjetas.

## 3. Zona segura, lienzo y estilos activos

- **Zona segura (`src/estilo/zona-segura.ts` manda sobre la del kit):** capas y motion dentro de **`x: 135–945` (`810 px`), `y: 220–1600`** en base `1080×1920` (subtítulos `y ≤ 1590`, columna de iconos `x > 945` libre). `acotarPoseZonaSegura()` y `ZONA_SEGURA_LUXLINE` aseguran estos límites.
- **Canvas y FPS:** salida final estándar del editor `1080×1920` a **30 fps** (`Reel` renderiza a `1440×2560` y `render.ts` escala ×`0.75` a `1080×1920`); `DemoComposition` (`Luxline-Style-Demo`) corre autónomamente a `60 fps` y `600` cuadros (`1080×1920`).
- **Dos perfiles de marca en `estilo/estilos/`:**
  - `luxline-cr-oficial`: reels hablados a cámara **sin motion graphics** ni zooms de edición.
  - `luxline-ventas`: reels de venta/producto con las **5 técnicas de motion** activadas.

## 4. Cinco técnicas de motion (`src/reel/motion/luxline/`)

Curva habitual: `luxuryEase = cubic-bezier(0.22, 1, 0.36, 1)`; secuencia glass heredada: quintic `smooth(t) = 6t⁵−15t⁴+10t³` (`math.ts`). Los rangos de cuadros del kit usan 60 fps (`0,1 s = 6 cuadros`); en `Reel` (30 fps), convertir desde segundos (`s × fps`).

1. **`MaskReveal` (revelar texto con máscara):** gancho, cierre y palabras clave. `0,35–0,60 s`, solapar `0,10–0,20 s` con la llegada del objeto; nunca escalar letras ni usarlo en subtítulos rápidos.
2. **`ChainMove` + `chainStarts` (movimientos encadenados):** objeto → detalle → explicación con dirección/posición compartida. `0,45–0,75 s` por acción, solape `0,15–0,25 s`. No iniciar tres protagonistas a la vez.
3. **`CameraFollow` (seguimiento de cámara):** acerca un detalle real que explique beneficio (`0,8–1,4 s`, zoom `1,08–1,20`, solape `0,15–0,25 s`). Titulares siempre en capa independiente; no ampliar fotos para inventar vistas.
4. **`ObjectMorph` + `glassShotSequence` + `SceneFade` (transformación entre escenas):** `0,55–0,90 s` (cápsula→panel). Retirar contenido `0,20 s` antes y revelarlo `0,20–0,30 s` después cuando haya espacio. Nunca deformar un producto real para simular otro modelo.
5. **`SpeechVisualSync` + `cuesDesdeTranscripcion` (sincronía habla-visual):** solo en piezas virales o de venta con voz aprobada (`voiceApproved=true`, `simulation=false`). Leer **tiempos reales por palabra de `transcripcion.json` / `transcripcion-base.json` (`d`, `h`)** convertidos a cuadros con `cuesDesdeTranscripcion(transcripcion, dictionary, fps)` (ataque `0,05–0,10 s`, cues ordenados, sin solapamiento y solo palabras con asset autorizado en `word-assets.json`). **`demo-cues.json` (`simulation=true`) es exclusivo de `Demo.tsx`.**

Evitar piezas secas, tarjetas repetitivas o beneficios genéricos; movimiento siempre con causalidad visual y lectura móvil cómoda.
