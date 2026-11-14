# Aprendizajes del estilo Luxline CR oficial

Lo técnico que se aprendió entrenándolo. Las reglas finales están en `perfil.md`; aquí va **cómo se llegó a ellas** y **cómo se hace cada cosa**.

## Recorrido por versiones

| Versión | Qué cambió | Qué dijo el creador |
|---|---|---|
| v1 (2026-11-14) | Copia de `base-neutra` con `exportar_4k.si_crudo_4k = false` y preferencia `1080×1920` | "Un cambio que haría ya: exportar en 1080×1920, no en 4K. Instagram reescala los Reels a 1080 de ancho, así que el 4K solo te cuesta render lento y mucha RAM en una laptop de 16 GB, sin mejora visible." |

## Cómo se hace cada cosa
- `herramientas/render.ts` renderiza el final estándar con `scale: 0.75` (`1080×1920`) sobre el lienzo `1440×2560`, dejando el contenedor base `1080×1920` (escalado `×4/3` en `Reel.tsx`) en relación `1:1` (`(4/3) × 0.75 = 1.0`).

## Qué no funcionó
- Exportar en 4K (`2160×3840`) para Reels en laptop de 16 GB de RAM: costo innecesario de render y memoria sin mejora visible tras el reescalado de Instagram.

## Costos
Lo que se gastó (Apify, Gemini u otros), con la fecha y el sí del creador.

| Fecha | Servicio | Qué | Costo |
|---|---|---|---|
