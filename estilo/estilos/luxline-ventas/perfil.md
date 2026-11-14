# Estilo Luxline Ventas

Perfil vivo de ventas/producto para **LUXLINE CR (`luxline.tech`)** con las **5 técnicas de motion** del Brand Kit v3 activadas. **Manda sobre el borrador del director y sobre `/editar` cuando choquen.** Los valores que lee el motor están en `perfil.json` (`motor`).

- **Estado:** en-prueba
- **Versión:** 1
- **Base:** `luxline-cr-oficial` + `LUXLINE-BRAND-KIT-v3` (`assets/marca/docs/ESTILO-DE-VIDEO.md`, `src/reel/motion/luxline/`)
- **Referencia visual:** `assets/marca/referencias-visuales/DEMO-CONTACTOS.png` y composición `Luxline-Style-Demo` (`60 fps`, `600` cuadros)

## Reglas vigentes

### Identidad, tipografía, paletas por universo y reglas editoriales
- **Marca y categorías:** `LUXLINE CR · luxline.tech` — Android, iPhone, accesorios y **Seminuevos** (evitar *usado* o *reacondicionado*). Español de Costa Rica cercano y con voseo en piezas de marca.
- **Tipografía:** `Noto Sans Display` variable `100–900` (`biblioteca/fuentes/NotoSansDisplay-Variable.ttf`; titulares `500–700`, cuerpo `400–500`) y `Noto Sans Mono` `400` (`biblioteca/fuentes/Mono-Regular.ttf`) para etiquetas técnicas discretas.
- **El universo define la paleta y el logo (ver `perfil.json → paletas`):**
  - **Android:** fondo `#F6F5F2`, texto/CTA `#0D0D0D`, acento `#9E9E9E` (plata neutra), secundario `#2E2E2E`, reflejos `#FFFFFF`, metal `#383838`, vidrio `#E2E2E2`, estado activo `#22C55E` (solo con etiqueta). **Logo:** `assets/marca/logos/logo-negro.svg`.
  - **iPhone:** fondo `#F8F7F4`, texto/CTA `#111111`, acento `#AEBACB` (plata azulada), secundario `#B8A4CF` (iridiscencia sutil), reflejos `#FFFFFF`. **Logo:** `assets/marca/logos/logo-negro.svg`.
  - **Accesorios:** fondo `#211814`, texto/CTA `#F7EADB`, acento `#D18C62` (cobre), secundario `#F2B45F` (ámbar), reflejos `#FFF1DA` (champagne). **Logo:** `assets/marca/logos/logo-blanco.svg`.
- **Rigor comercial:** una idea y un CTA claros; beneficio verificable y deseo real sobre el producto. Cero textos legales, créditos o "información oficial"; no inventar precios, stock ni compatibilidad.
- **Imágenes prohibidas:** nunca usar `fondo-mesh-elevenlabs.png` ni `foto-producto.jpg`.

### Las 5 técnicas de motion activadas (`src/reel/motion/luxline/`)
Curva habitual `cubic-bezier(0.22, 1, 0.36, 1)`; transición glass quintic `6t⁵−15t⁴+10t³`. Los rangos de `ESTILO-DE-VIDEO.md` se expresan en segundos (convertir a cuadros según `fps`: `30 fps` en `Reel`, `60 fps` en `Luxline-Style-Demo`):
1. **`MaskReveal` (revelar texto con máscara):** gancho, conclusión y palabras clave (`0,35–0,60 s`; solapar `0,10–0,20 s` con entrada del objeto). Nunca deformar ni repetir en subtítulos rápidos.
2. **`ChainMove` + `chainStarts` (movimientos encadenados):** objeto → detalle → explicación (`0,45–0,75 s`, solape `0,15–0,25 s`). No disparar tres protagonistas a la vez.
3. **`CameraFollow` (seguimiento de cámara):** detalle real que explique beneficio (`0,8–1,4 s`, zoom `1,08–1,20`, solape `0,15–0,25 s`). Titulares siempre en capa independiente; no ampliar fotos para inventar vistas.
4. **`ObjectMorph` + `glassShotSequence` (transformación entre escenas):** cápsula→panel o anillo→marco (`0,55–0,90 s`), retirando contenido `0,20 s` antes y revelándolo `0,20–0,30 s` después con espacio suficiente. Vidrio *liquid glass 2.5D* solo cuando aporte valor.
5. **`SpeechVisualSync` + `cuesDesdeTranscripcion` (sincronía texto-visual):** en piezas de venta/virales con voz aprobada (`voiceApproved=true`, `simulation=false`), lee los **tiempos por palabra de `transcripcion.json` / `transcripcion-base.json` del editor** (`d`, `h`) filtrados por `word-assets.json`. `demo-cues.json` (`simulation=true`) es exclusivo de `Demo.tsx`.

### Ritmo, zona segura y exportación
- **Ritmo:** gancho claro y cambios significativos cada `1,5–3 s` adaptados a lectura móvil. Por defecto música y efectos; voz solo en piezas aprobadas.
- **Zona segura (`src/estilo/zona-segura.ts` manda sobre la del kit):** todo elemento esencial en `x: 135–945`, `y: 220–1600` (subtítulos `y ≤ 1590`; columna de iconos `x > 945` libre). `acotarPoseZonaSegura()` fuerza estos límites.
- **Exportación:** salida final estándar del editor en `1080×1920` a `30 fps` (`scale: 0.75` en `render.ts`; sin 4K).

## Lo que NO va
- `fondo-mesh-elevenlabs.png` y `foto-producto.jpg`.
- `demo-cues.json` en piezas de producción con voz real.
- Memes o plantillas repetitivas de tres tarjetas sin narrativa.
- Mockups de otra familia presentados como modelo real, textos legales, créditos o datos inventados.
- Exportación en 4K (`2160×3840`).

## Falta herramienta
- Validar en una toma real con voz la integración de `SpeechVisualSync` + `cuesDesdeTranscripcion` dentro de `Reel`.

## Números de referencia
Ninguno medido en reels publicados todavía (`n = 0`; criterios operativos iniciales de `ESTILO-DE-VIDEO.md` v3).

## Historial de entrenamiento
- 2026-11-14 (v1): "Crea el estilo luxline-ventas con las 5 técnicas activadas y regístralo en estilos.json." + "La sincronía texto-visual debe leer los tiempos por palabra de la transcripción del editor y no demo-cues.json, que queda solo para la demo."
- 2026-11-14 (v1): "Confirmado. Aplica las 3 paletas tal cual, como bloque por universo (android, iphone, accessories), en luxline-cr-oficial y luxline-ventas. Corrige el texto de 'uso' del accent en iphone ('plata azulada') y accessories ('cobre')... En luxline-ventas y videos generados por código, el universo define la paleta. Logo: logo-negro en Android e iPhone, logo-blanco en Accesorios."
