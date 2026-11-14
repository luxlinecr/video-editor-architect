# Estilo Luxline CR oficial

Perfil vivo del estilo. **Manda sobre el borrador del director y sobre lo que diga `/editar` cuando choquen.** Los valores que lee el código están en `perfil.json` (misma carpeta), sección `motor`.

- **Estado:** en-prueba
- **Versión:** 1
- **Base:** `base-neutra`
- **De dónde sale:** copia de `base-neutra` ajustada por el creador (ver `fuentes.json`)
- **Reel de referencia:** ninguno todavía

## Reglas vigentes

### Ritmo y cortes
- Velocidad ×1.0: la toma no se acelera.
- Se cortan los silencios de más de 0.3 s. Los aires entre palabras se quedan.
- Se quitan las repeticiones donde el creador se corrige y lo que queda colgado, solo en el texto aprobado. Nada que dé contexto.

### Texto en pantalla
- **Titular:** se decide por reel. Si va, 2 renglones arriba de la cabeza, blanco con contorno negro.
- **Subtítulos:** monolíneas de 2–3 palabras, blancos con borde negro, abajo dentro de la zona segura, corte seco.
- **Tarjetas de palabra clave:** caja blanca con texto negro en negritas a la altura del pecho, 1–3 palabras literales de lo que dice, corte seco. Unas 10 por minuto como punto de partida (decisión, no medida).
- **Listas:** cuando enumera, las tarjetas van apiladas con el mismo `grupo`.
- **Prompts dictados:** cuando dice "le dices / le pides / le escribes a…", va la tarjeta `prompt` escribiéndose con el texto literal.

### Stickers, logos y memes
- Sin stickers, sin logos y sin memes.
- Zona segura de Reels: x 135–945, y 220–1600. Nada tapa boca, nariz ni ojos.

### Sonido
- Sin SFX hasta que el creador agregue los suyos (`/sfx`). Con biblioteca, el selector los pone sin repetir.

### Demos de pantalla
- Si hace falta mostrar un sitio, demo corta en modo oscuro (`/grabar-demo`).

### Exportación
- Salida final estándar en `1080×1920` (`scale: 0.75` en `render.ts`); sin exportación en 4K (`exportar_4k.si_crudo_4k: false`).

## Lo que NO va
- Stickers, logos y memes.
- Zooms de edición.
- Motion graphics.
- Exportación en 4K (`2160×3840`).

## Falta herramienta
Lo que el estilo pide y el editor todavía no sabe hacer, con una propuesta de cómo construirlo.
- Ninguna por ahora.

## Números de referencia
Ninguno: este estilo parte de `base-neutra` y todavía no sale de reels medidos (`n = 0`; fuente: decisiones de arranque y ajuste inicial del creador).

## Historial de entrenamiento
Frases literales del creador, con fecha. No se borra.
- 2026-11-14 (v1): "Un cambio que haría ya: exportar en 1080×1920, no en 4K. Instagram reescala los Reels a 1080 de ancho, así que el 4K solo te cuesta render lento y mucha RAM en una laptop de 16 GB, sin mejora visible."
- 2026-11-14 (v1): "Sí: que el final estándar salga en 1080×1920 (scale 0.75)."
