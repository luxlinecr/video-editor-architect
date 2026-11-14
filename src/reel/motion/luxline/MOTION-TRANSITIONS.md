# Motion portable v3

Solo React y Remotion como dependencias de ejecución. Sin reloj real ni aleatoriedad. Frame y props determinan la imagen. math.ts y glass-motion.ts proceden del proyecto; Techniques.tsx implementa las cinco reglas y Demo.tsx las combina. No se incluye configuración del repo.

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

## Secuencia glass heredada
Cápsula→panel 0,55 s; revelar contenido 0,20 s; retirar contenido 0,20 s; panel→cápsula 0,35 s. Curva smooth quintic. Mínimo 2 s por toma. SceneFade conserva el crossfade V2 (entrada 0,18 s, salida 0,30 s); montar antes del inicio nominal para su entrada anticipada. Los presets JSON siguen siendo ejemplos, no hechos comerciales actuales.

## Integración
Copiar assets/ y biblioteca/ a public/ del editor conservando rutas para staticFile; mantener también assets/marca/motion como código fuente importable en el repo. Alternativamente adaptar la resolución de recursos una sola vez. Importar DemoComposition en el registro existente; no ejecutar demo-entry.tsx dentro de un registro que ya llamó registerRoot. demo-entry.tsx es una entrada autónoma opcional. Activar resolveJsonModule en la configuración anfitriona si aún no existe. Demo: Luxline-Style-Demo, 600 cuadros, 60 fps, 1080×1920.

Los archivos de fuente y logos referenciados existen en el kit. El diccionario solo contiene assets incluidos; para otras palabras añadir un recurso autorizado y actualizar el diccionario. No se descargaron capturas ni se incluyó audio. La demo usa los cinco componentes; los cues de habla son sintéticos y su uso está expresamente marcado como simulación.

## Validación
TypeScript estricto ejecutado sobre todos los .ts/.tsx del directorio. Se renderizaron doce cuadros de la demo y una hoja de contactos PNG; no se generó MP4 ni se reprodujo un video. La integración visual en el editor receptor y la sincronía con voz final se verifican al producir la pieza real.
