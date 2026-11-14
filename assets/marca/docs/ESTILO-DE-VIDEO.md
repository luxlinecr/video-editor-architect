# Cómo se ve y se mueve LUXLINE CR

Marca y web: **LUXLINE CR · luxline.tech**. Esta guía convierte las decisiones del proyecto y las instrucciones del encargo v3 en criterios operativos. Resolver composición y ejecución con estos valores; no volver a preguntar por preferencias ya definidas. Guion y datos comerciales sí siguen el flujo de aprobación de abajo.

## Premium, lujo y deseo
Lujo visual significa precisión, espacio, luz y material controlados. El producto y su utilidad deben despertar deseo; nombrar especificaciones sin mostrar su valor no basta. Jerarquía clara: una idea por beat, protagonista visible, titular dominante, apoyo subordinado y un CTA. Movimiento abundante y perceptible, pero dirigido: entradas conectadas, cambios de escala, detalle y transformaciones que expliquen. Nada seco, estático o repetitivo. No sustituirlo por vibración gratuita ni animar letras mientras deben leerse.

## Ritmo, tipografía, color y espacio
Gancho legible al comienzo; desarrollo con cambios significativos cada 1,5–3 s como punto de partida, adaptados a la lectura. Un plano puede durar más si está explicando algo. Encadenar energía y descanso visual: objeto/cámara suaves durante texto estable. Evitar una receta fija de tres tarjetas. No acortar la lectura o reducir letra para forzar duración.

Noto Sans Display: titulares 500–700, cuerpo 400–500; Noto Sans Mono 400 para datos. Pesos operativos de v3, no pesos inventados del archivo Mono. Usar la variable conservada y esperar su carga. En vertical, titulares orientativos 72–96 px, cuerpo 38–48 px, datos 28–34 px; revisar longitud real. El logo es un asset oficial, sin reconstrucción tipográfica.

Android: crema/carbón/plata, verde solo estado activo con etiqueta. iPhone: perla/plata/titanio/lavanda sutil. Accesorios: cobre/ámbar/champagne cálidos. Hex y usos exactos en estilo/luxline-marca.json. No teñir cada universo con colores históricos o mezclar tres paletas en una misma explicación sin razón. Fondo y bordes acompañan; reflejos nunca compiten con texto. Liquid glass 2.5D transparente y legible cuando haga falta panel, sin imponer tarjetas a todo.

## Cinco técnicas, con criterios concretos

Estos rangos son valores operativos de v3 para ejecutar la dirección aprobada; el historial no fijaba una duración universal. A 60 fps, 0,1 s = 6 cuadros. Curva habitual: cubic-bezier(0.22, 1, 0.36, 1); el glass original usa 6t⁵−15t⁴+10t³. Priorizar lectura y continuidad sobre cumplir una cifra.

### 1. Revelar texto con máscara
Usar para gancho, conclusión y palabras clave. Una caja recorta el texto mientras se descubre; no escalar ni deformar letras. Duración 0,35–0,60 s (21–36 cuadros); curva habitual; solapar con la llegada del objeto 0,10–0,20 s. Tras abrir, dejar texto completo estable según longitud. No repetir animación por cada palabra ni usarla en subtítulos rápidos que pierdan legibilidad. Ejemplo: «Mirá más de cerca.» se revela mientras entra el iPhone. Código: MaskReveal; from y duration en cuadros.

### 2. Encadenar movimientos
Usar cuando una acción dirige a la siguiente: objeto → detalle → explicación, compartiendo dirección o posición. Duración por acción 0,45–0,75 s (27–45 cuadros); curva habitual; solape 0,15–0,25 s (9–15 cuadros). No iniciar tres protagonistas a la vez ni mover todo por rutina. Ejemplo: la entrada del producto activa sucesivamente Forma, Luz y Detalle. chainStarts calcula inicios con solape y ChainMove revela cada elemento. El objeto conserva una posición reconocible entre acciones.

### 3. Cámara que sigue lo importante
Usar para revelar lente, conector o detalle que explique un beneficio; definir el punto seguido. Duración de aproximación 0,8–1,4 s; zoom orientativo 1,08–1,20; curva habitual; solapar 0,15–0,25 s con la entrada del objeto. Suavizar target/zoom antes de pasarlos al helper. Mantener titulares en una capa independiente de cámara. No usar seguimiento continuo sin propósito, marear ni ampliar una foto para inventar una vista. Ejemplo: la cámara acompaña el desplazamiento del iPhone y acerca su silueta; no atribuye prestaciones. CameraFollow transforma un mundo con centro, objetivo, zoom y fuerza de seguimiento; todo se deriva del cuadro actual.

### 4. Transformar un objeto en la escena siguiente
Usar cuando una forma puede convertirse coherentemente en otra: cápsula → panel, anillo → marco. Duración 0,55–0,90 s (33–54 cuadros); curva habitual, o smooth en la secuencia glass original; retirar contenido en 0,20 s antes y revelarlo 0,20–0,30 s después de que exista espacio. Solape de contenido controlado, sin cortar una palabra durante lectura. No deformar un producto real para simular otro modelo ni convertir cada escena en idéntica cápsula. Ejemplo: una cápsula plata se abre en panel de vidrio y revela «Una nueva perspectiva». ObjectMorph interpola caja/radio; su contenido tiene opacidad propia. No es una simulación física.

### 5. Texto, habla y representación sincronizados
Aplicar solo a contenido viral o de ventas con voz aprobada. Leer tiempos de la grabación final en cuadros y el diccionario editable palabra→asset. Al empezar la palabra relevante, enfatizar su texto y mostrar su representación debajo. Ataque 0,05–0,10 s (3–6 cuadros), curva habitual; retener durante la frase pertinente. Solape máximo sugerido 0,10 s entre énfasis, evitando dos representaciones competidoras. No adivinar tiempos desde el guion, no activar en educación sin tratamiento viral/venta y voz aprobada, ni usar assets aproximados para afirmaciones concretas. Ejemplo LUXLINE: «iPhone» activa la foto verificada del iPhone. Si se menciona «auto», agregar primero un asset autorizado de auto y su entrada al diccionario; nunca mostrar un teléfono por asociación arbitraria. El helper omite palabras sin asset. Las claves se normalizan a minúsculas, sin acentos ni puntuación. Los cues deben estar ordenados, no superpuestos y con end > start.

SpeechVisualSync acepta mode, voiceApproved y simulation. simulation se reserva a pruebas técnicas silenciosas. demo-cues.json declara claramente que los tiempos de esta demo son simulados: no demuestra sincronía con una voz real ni contiene voz. En producción usar simulation=false y tiempos medidos. La demo ejemplifica un tratamiento de venta sin precios y sin autorización para publicar.

## Producción y zona segura
- Vertical 1080 × 1920 a 60 fps. El cuadro 599 es el último de la demo de 10 s.
- Zona operativa conservadora de este kit: izquierda 90 px, derecha 180 px, arriba 280 px, abajo 680 px. Textos, logos, CTA y detalles esenciales dentro de x=90…900, y=280…1240. Fondos y elementos no esenciales pueden salir. Evitar la columna derecha de acciones y el pie de caption/CTA.
- Son márgenes de trabajo, no garantía universal para todas las interfaces de Reels. Verificar el placement final antes de publicar. La página oficial de Meta sobre safe zones exige acceso y no pudo verificarse directamente en esta sesión: https://www.facebook.com/business/help/980593475366490 . Se adopta un margen conservador propio, no una especificación oficial atribuida sin comprobación.
- Flujo: guion visual breve con objetivo, universo, gancho, texto exacto, acciones, duración, recursos y CTA → aprobación → producción. No pedir aprobación rutinaria adicional para cada detalle o exportación dentro del guion aprobado. Si falta dato, omitirlo o dejarlo pendiente; nunca inventar precio, disponibilidad, garantía, compatibilidad ni prestaciones.
- Audio por defecto: música y efectos, sin narración. Voz solo en piezas aprobadas. Este kit no incluye audio ni voces; efectos visuales no implican sincronía sonora comprobada.
- Ningún texto de copyright, aviso legal, créditos ni «información oficial» dentro del video. Mantener licencias, fuentes y procedencia en documentación externa. Elegir mensajes que se puedan sostener sin avisos aclaratorios en pantalla; si no, reformular u omitir la afirmación.
- Registrar fuentes y derechos fuera del cuadro. Revisión de lectura, contraste y transiciones; TypeScript y stills no equivalen a revisión audiovisual completa.

## Errores que ya cometimos
El historial recoge rechazo a videos secos, estáticos, repetitivos, poco explicativos y sin deseo de compra. No repetir tarjetas con distinto título como sustituto de edición. Evitar beneficios vacíos, como decir que un equipo ejecuta aplicaciones, sin una experiencia concreta. La revisión explicativa de iPhone 13 de 45 s tampoco quedó aprobada como estándar: cambiar datos repetidos por otros no resolvió el deseo de compra. La dirección de privacidad v3 sí recibió aprobación por sus transformaciones explicativas; tomar el principio, no copiar su guion en todo. Una pieza técnicamente renderizada no equivale a aprobación creativa. Corregir estos problemas con continuidad, producto auténtico, causalidad visual y beneficio verificable; nunca con más efectos por sí solos.
