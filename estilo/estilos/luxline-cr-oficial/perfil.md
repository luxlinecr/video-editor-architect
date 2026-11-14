# Estilo Luxline CR oficial

Perfil vivo del estilo. **Manda sobre el borrador del director y sobre lo que diga `/editar` cuando choquen.** Los valores que lee el código están en `perfil.json` (misma carpeta), sección `motor`.

- **Estado:** en-prueba
- **Versión:** 2
- **Base:** `base-neutra` + identidad de `LUXLINE-BRAND-KIT-v3` (`estilo/luxline-marca.json`, `assets/marca/docs/ESTILO-DE-VIDEO.md`)
- **De dónde sale:** copia de `base-neutra` ajustada por el creador e identidad LUXLINE CR (ver `fuentes.json`)
- **Reel de referencia:** ninguno todavía

## Reglas vigentes

### Identidad, tipografía, paletas y reglas editoriales
- **Marca y dominio:** `LUXLINE CR · luxline.tech` (Android, iPhone, accesorios y **Seminuevos**; nunca decir usado ni reacondicionado).
- **Tipografía de marca:** `Noto Sans Display` variable `100–900` (`biblioteca/fuentes/NotoSansDisplay-Variable.ttf`; titulares `500–700`, cuerpo `400–500`) y `Noto Sans Mono` `400` (`biblioteca/fuentes/Mono-Regular.ttf`) para etiquetas técnicas discretas.
- **Paletas por universo (aplican a fondos y piezas generadas; ver `perfil.json → paletas`):**
  - **Android:** fondo `#F6F5F2`, texto/CTA `#0D0D0D`, acento `#9E9E9E` (plata neutra), secundario `#2E2E2E`, reflejos `#FFFFFF`, metal `#383838`, vidrio `#E2E2E2`, estado activo `#22C55E` (solo con etiqueta). Logo: `logo-negro.svg`.
  - **iPhone:** fondo `#F8F7F4`, texto/CTA `#111111`, acento `#AEBACB` (plata azulada), secundario `#B8A4CF` (iridiscencia sutil), reflejos `#FFFFFF`. Logo: `logo-negro.svg`.
  - **Accesorios:** fondo `#211814`, texto/CTA `#F7EADB`, acento `#D18C62` (cobre), secundario `#F2B45F`, reflejos `#FFF1DA`. Logo: `logo-blanco.svg`.
- **Reels sobre video real:** en tomas grabadas reales, los subtítulos y las tarjetas de palabra clave **conservan blanco (`#FFFFFF`) con borde/texto negro (`#000000`)**.
- **Rigor comercial:** cero textos legales, créditos o "información oficial" dentro del video; no inventar precios, existencias ni garantías.
- **Imágenes prohibidas:** nunca usar `fondo-mesh-elevenlabs.png` ni `foto-producto.jpg`.

### Ritmo, motion y cortes
- Velocidad ×1.0: la toma no se acelera.
- Se cortan los silencios de más de 0.3 s. Los aires entre palabras se quedan.
- Se quitan las repeticiones donde el creador se corrige y lo que queda colgado, solo en el texto aprobado. Nada que dé contexto.
- **Motion sin cambios:** este perfil sigue sin motion graphics ni zooms de edición (para videos con las 5 técnicas de motion, usar `luxline-ventas`).

### Texto en pantalla
- **Titular:** se decide por reel. Si va, 1–2 renglones arriba de la cabeza dentro de zona segura.
- **Subtítulos:** monolíneas de 2–3 palabras, blancos con borde negro, abajo dentro de la zona segura (`y ≤ 1590`), corte seco.
- **Tarjetas de palabra clave:** en video real, caja blanca con texto negro en negritas a la altura del pecho, 1–3 palabras literales de lo que dice, corte seco. Unas 10 por minuto como punto de partida (decisión, no medida).
- **Listas:** cuando enumera, las tarjetas van apiladas con el mismo `grupo`.
- **Prompts dictados:** cuando dice "le dices / le pides / le escribes a…", va la tarjeta `prompt` escribiéndose con el texto literal.

### Stickers, logos y zona segura
- Sin stickers de terceros ni memes; logo oficial de `assets/marca/logos/` solo cuando aporte (`logo-negro.svg` en Android e iPhone; `logo-blanco.svg` en Accesorios), sin reconstruir con texto.
- **Zona segura (`src/estilo/zona-segura.ts` manda sobre la del kit):** `x: 135–945`, `y: 220–1600` (subtítulos `y ≤ 1590`). Nada tapa boca, nariz ni ojos.

### Sonido y demos
- Sin SFX hasta que el creador agregue los suyos (`/sfx`). Con biblioteca, el selector los pone sin repetir.
- Si hace falta mostrar un sitio, demo corta en modo oscuro (`/grabar-demo`).

### Exportación
- Salida final estándar en `1080×1920` (`scale: 0.75` sobre `1440×2560` en `render.ts` a `30 fps`); sin exportación en 4K (`exportar_4k.si_crudo_4k: false`).

## Lo que NO va
- Stickers y memes.
- Zooms de edición.
- **Motion graphics** (sin cambios respecto a v1).
- Exportación en 4K (`2160×3840`).
- `fondo-mesh-elevenlabs.png` y `foto-producto.jpg`.
- Textos legales, créditos o precios inventados.

## Falta herramienta
Lo que el estilo pide y el editor todavía no sabe hacer, con una propuesta de cómo construirlo.
- Ninguna por ahora.

## Números de referencia
Ninguno: este estilo parte de `base-neutra` y todavía no sale de reels medidos (`n = 0`; fuente: decisiones de arranque, identidad de `LUXLINE-BRAND-KIT-v3` y ajuste inicial del creador).

## Historial de entrenamiento
Frases literales del creador, con fecha. No se borra.
- 2026-11-14 (v1): "Un cambio que haría ya: exportar en 1080×1920, no en 4K. Instagram reescala los Reels a 1080 de ancho, así que el 4K solo te cuesta render lento y mucha RAM en una laptop de 16 GB, sin mejora visible."
- 2026-11-14 (v1): "Sí: que el final estándar salga en 1080×1920 (scale 0.75)."
- 2026-11-14 (v2): "Aplica paleta, tipografía y reglas a luxline-cr-oficial, sin cambiar su motion."
- 2026-11-14 (v2): "Confirmado. Aplica las 3 paletas tal cual, como bloque por universo (android, iphone, accessories), en luxline-cr-oficial y luxline-ventas. Corrige el texto de 'uso' del accent en iphone ('plata azulada') y accessories ('cobre')... En luxline-cr-oficial (reels sobre video real), subtítulos y tarjetas conservan blanco con borde negro. Las paletas aplican a fondos y piezas generadas. Logo: logo-negro en Android e iPhone, logo-blanco en Accesorios."
