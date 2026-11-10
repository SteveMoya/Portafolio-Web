# Plan — Estanterías 3D en el hero de /education

Branch: `redesign/personalblog-v2`
Archivo objetivo: `src/pages/education.astro` (hero) + componentes que solo usa esa vista.
Estado: **propuesta — no ejecutado**. Se aprueba o se rechaza antes de tocar código.

---

## 1. Qué se construye

El hero de `/education` deja de tener un fondo de puntos estático y pasa a tener, detrás del
título, una **estantería 3D** con cuatro columnas, una por categoría:

| Columna | Categoría | Libros |
| --- | --- | --- |
| 01 | Marketing | 5 |
| 02 | Programación | 5 |
| 03 | Análisis de datos | 5 |
| 04 | IA & ML | 5 |

Comportamiento:

1. Al entrar al viewport, las estanterías aparecen y **los libros caen y se apilan** de a uno,
   en orden rotativo entre las cuatro columnas, hasta formar cuatro pilas (una por categoría).
2. **Click sobre un libro o sobre su estante** → esa columna pierde el equilibrio: los libros
   salen despedidos, tumban, chocan entre sí y con los estantes, y quedan desordenados.
3. Aparece/queda activo el botón **«Reapilar»**, que repite la caída de las columnas derribadas.
4. Cada columna se derriba y se rearma de forma independiente.

Lectura del pedido: «estanterías que se vayan apilando» + «libros que caen y se apilan según su
categoría» = las estanterías son el mueble (aparecen primero, estáticas) y **lo que cae y se apila
son los libros**. Si la intención era que también el mueble se armara tablero por tablero, decirlo
y se agrega un beat de 400 ms al inicio (§11, decisión 1).

---

## 2. Estado actual (evidencia, no suposición)

- `src/pages/education.astro:82-96` usa `PageHero` con `background="pattern"`.
- `src/components/ui/PageHero.astro` es el hero compartido por `/education`, `/experience` y
  `/gallery` (línea 1-13 del propio archivo: «Single implementation so the four pages cannot drift
  apart again»). Tiene tres capas: fondo (`wash` | `pattern`), contenido `z-10`, y nada más.
- `three@0.187`, `@react-three/fiber` y `@react-three/drei` **ya están** en `package.json`.
- El patrón de la casa para WebGL es **three.js vanilla dentro de un `<script>` de un `.astro`**,
  con `import('three')` dinámico, `renderer` con `alpha: true`, `IntersectionObserver` para pausar
  el rAF y `ResizeObserver` para el sizing: `src/components/sections/skills/SkillsHero.astro`
  (1.802 líneas) y `src/components/contact/ContactScene3D.astro` (694 líneas). No se usa R3F en
  ninguna isla del sitio.
- `matter-js` está instalado, pero es **2D**: no sirve para voltear libros en 3D.

Conclusión: no hace falta ampliar la arquitectura. Se sigue el patrón de `SkillsHero`.

---

## 3. Decisión técnica: coreografía + física real solo al derribar

El hero es el LCP de la página. La opción de meter un motor de física desde el primer frame se
descarta por peso, y un motor 3D estable no es algo que convenga escribir a mano.

### Motores medidos (no estimados: `npm pack` + `gzip -9` en la máquina)

| Opción | Peso real | Veredicto |
| --- | --- | --- |
| `@dimforge/rapier3d-compat@0.21.0` | **1,65 MB gzip** (`rapier.mjs`, wasm inline en base64); wasm suelto: 1,17 MB gzip / 852 KB brotli | Rechazado. Es más que toda la página. |
| `cannon-es@0.20.0` | **74,5 KB gzip** / 61 KB brotli, JS puro, sin init WASM | **Elegido** |
| Física a mano | 0 KB | Rechazado: resolver apilado de cajas estable (contactos, fricción, sueño) es un proyecto en sí mismo y se va a ver peor. |
| `matter-js` (ya instalado) | 26 KB | Rechazado: 2D, no hay volteo en el eje Z. |

### El esquema

- **Caída y apilado: coreografiados.** Cada libro es un `Mesh` con posición/rotación animada por
  código. Determinista, 0 % CPU cuando termina, y el resultado se ve *compuesto* — no una pila
  aleatoria, que es lo que un motor real produciría y lo que arruinaría un hero de portafolio.
- **Derribo: `cannon-es` real.** Al primer click se crean los cuerpos rígidos *en la transformación
  actual* de los libros, se aplica impulso y el solver hace el resto (tumbarse, chocar con el
  estante, con los libros vecinos y con el piso).
- **Carga diferida**: `cannon-es` no entra en el bundle del hero. Se importa con
  `import('cannon-es')` cuando el hero entra en viewport y el navegador está idle
  (`requestIdleCallback`, fallback `setTimeout` 2 000 ms). Para cuando alguien hace click, ya está.
  Si nunca se hace click, nunca se descarga.

---

## 4. Contenido: 20 libros reales

Títulos originales en inglés (son libros, no copy de UI: no se traducen). Un volumen por libro,
datos en un archivo aparte para que el componente no tenga contenido embebido.

**Marketing**
`Influence` — Cialdini · `Positioning` — Ries & Trout · `Ogilvy on Advertising` — Ogilvy ·
`Contagious` — Berger · `Building a StoryBrand` — Miller

**Programación**
`The Pragmatic Programmer` — Hunt & Thomas · `Clean Code` — Martin · `Refactoring` — Fowler ·
`Design Patterns` — Gamma, Helm, Johnson, Vlissides · `Structure and Interpretation of Computer
Programs` — Abelson & Sussman

**Análisis de datos**
`Storytelling with Data` — Knaflic · `Python for Data Analysis` — McKinney ·
`Practical Statistics for Data Scientists` — Bruce & Bruce · `Designing Data-Intensive
Applications` — Kleppmann · `Naked Statistics` — Wheelan

**IA & ML**
`Artificial Intelligence: A Modern Approach` — Russell & Norvig · `Deep Learning` — Goodfellow,
Bengio & Courville · `Pattern Recognition and Machine Learning` — Bishop · `Hands-On Machine
Learning` — Géron · `The Alignment Problem` — Christian

Al escribir la data se confirma año y edición de cada uno; lo que queda escrito es lo que se
renderiza en el `sr-only` y en el atlas de lomos.

**Paleta**: tonos de tela apagados, no acentos de UI. Marketing `#c98f3f` (ocre), Programación
`#4b7fa8` (azul acero), Análisis `#4f8f6b` (verde salvia), IA & ML `#a8324a` (vino). El `#c70039`
de marca queda para el lomo destacado y los controles, no para teñir todo.

---

## 5. Arquitectura de archivos

| Archivo | Acción | Contenido |
| --- | --- | --- |
| `src/data/bookshelf.ts` | nuevo (~70 líneas) | `ShelfCategory[]` con `id`, `label`, `accent`, `books[]` (`title`, `author`, `year`). Tipado exportado. |
| `src/components/sections/education/ShelfHero.astro` | nuevo (~520 líneas) | Marcado (host del canvas, scrim, lista `sr-only`, control «Derribar / Reapilar») + `<script>` con toda la escena. |
| `src/components/ui/PageHero.astro` | edición (+12 líneas, no rompe nada) | Nuevo valor `background="shelves"`: dibuja las capas `pattern` actuales **y** `<slot name="background" />` en `z-0`. Se agrega `<slot name="overlay" />` en `z-20` con `pointer-events-none`. |
| `src/pages/education.astro` | edición (~8 líneas) | `background="shelves"`, pasa `<ShelfHero slot="background" … />` y el control en `slot="overlay"`. Entrada nueva en `railSections` no aplica: el hero no es sección. |
| `package.json` + `bun.lock` | + `cannon-es@0.20.0` | Única dependencia nueva. Trae sus propios tipos: no hace falta `@types`. |

`/experience` y `/gallery` siguen con `background="pattern"`: los slots nuevos se renderizan
vacíos y no cambian su HTML ni su CSS.

Por qué el slot y no un hero nuevo para education: el comentario de cabecera de `PageHero.astro`
existe precisamente porque esas cuatro vistas ya se desincronizaron una vez. Duplicar el hero con
un `EducationHero.astro` reintroduce ese problema a cambio de 12 líneas.

---

## 6. Escena 3D

### Geometría

- Mueble: 4 columnas de 1,5 × 2,6 unidades (1 u ≈ 10 cm), separadas 0,20, sobre un zócalo; 3
  tableros por columna con 0,16 de espesor. Materiales: madera casi negra (`#151312`, roughness
  0,85) + canto superior con un filo de luz. Sin texturas: la estantería es silueta, el color lo
  ponen los libros.
- Libro: caja 0,34 (x, ancho) × 0,10 (y, grosor) × 0,26 (z, profundidad) con un chaflán de 0,004
  aplicado por escala de vértices (no hay `RoundedBoxGeometry` por libro: 20 clones de una sola
  geometría).

### Materiales y el detalle que los hace leer como libros

- **Canto de páginas**: las caras laterales e inferior/superior van en crema (`#d8d2c4`, roughness
  0,95). Es lo que distingue un libro de una caja de color.
- **Lomo**: cara `+z`, con tela del color de la categoría y el título en el atlas de textura.
- **Un atlas, un material**: una sola `CanvasTexture` de 2048 × 1024 con 20 celdas de 96 × 1024
  (texto rotado 90°, tipografía monoespaciada, banda del editor abajo). Cada libro clona la
  geometría y remapea solo los UV de la cara `+z` a su celda; el material de lomo es uno solo para
  los 20, y las portadas usan 4 materiales (uno por categoría). Total: 5 materiales y 1 textura.
- **Placas de categoría**: 4 `CanvasTexture` de 512 × 128 en el frente del tablero superior de cada
  columna: `01 · MARKETING`, `02 · PROGRAMACIÓN`, `03 · ANÁLISIS DE DATOS`, `04 · IA & ML`.
- Sin `envMap` ni `RoomEnvironment`: 2 `DirectionalLight` + 1 `HemisphereLight` + un rim en
  `#c70039` desde atrás. Da un look editorial plano que encaja con el sitio y evita ~30 ms de PMREM
  en el arranque.
- Sin sombras en tiempo real. El contacto libro–tablero se resuelve con un plano de gradiente
  oscuro bajo cada pila.

### Cámara y composición

`PerspectiveCamera(30, …)` en `(0, 1.45, 7)`, mirando a `(0, 1, 0)`: leve contrapicado que hace
que los libros se lean desde abajo. En `< 640 px` la cámara retrocede y se sube el `lookAt` para
meter las 4 columnas en un encuadre vertical.

El hero es `items-end`: el título ocupa la franja inferior. Por eso las pilas viven en la mitad
superior y en los laterales, y el centro-bajo queda limpio para el `h1`. Un scrim radial
(`rgba(10,10,10,0.55)` al centro, opaco en los bordes) va entre el canvas y el texto: el título
sigue leyéndose aunque una pila quede detrás. Se mide contraste del `h1` contra el scrim (objetivo
≥ 4,5:1, con texto de 15vw el mínimo AA es 3:1).

---

## 7. Comportamiento paso a paso

| t | Qué pasa |
| --- | --- |
| 0 ms | Canvas monta transparente; el fondo `pattern` actual sigue visible debajo (nunca hay un hueco negro). |
| 150 ms | El mueble entra: opacidad 0 → 0,9 y sube 8 px. Se pintan las 4 placas. |
| 400 ms → | Caída de libros en round-robin (Marketing, Programación, Análisis, IA, Marketing, …), 180 ms entre libros. Cada uno arranca 2,2 u por encima de su pila con jitter de ±0,02 en x/z y yaw ±0,06 rad, cae en 480 ms con `easeInQuad`, y al aterrizar tiene un asentamiento de 120 ms con sobrepique de 3 %. |
| ~2,1 s | Última pila completa. Se encienden las placas y el texto de ayuda bajo el botón. |
| click | Raycast contra libros **y tableros**. Si pega, esa columna se derriba (§8). El cursor pasa a `pointer` sobre cualquier objetivo válido. |
| después | El botón cambia a «Reapilar». Al pulsarlo, las columnas derribadas repiten su caída desde el paso 400 ms. |

Si la columna ya está derribada, un click sobre ella no hace nada (los libros están en el piso).

---

## 8. El derribo (física)

1. Se toma la transformación mundial actual de cada libro de la columna.
2. Se crean cuerpos `cannon-es`: masa 0,18, `Box` con medio extensión igual a la del mesh,
   `restitution 0.08`, `friction 0.65`, `linearDamping 0.14`, `angularDamping 0.22`,
   `allowSleep: true` (`sleepSpeedLimit 0.12`, `sleepTimeLimit 0.6`).
3. Estáticos: el tablero de abajo, el tablero de arriba, las dos paredes laterales del hueco, un
   piso invisible y los libros de las columnas vecinas que estén apilados (para que el derrumbe no
   los atraviese).
4. Impulso: dirección = vector desde el centro de la pila hacia el libro, normalizado, más 0,35 en
   +y y algo de dispersión; magnitud 1,6–2,4. `angularVelocity` aleatorio de ±4 rad/s.
5. `world.step(1/60, dt, 3)` dentro del mismo rAF que ya dibuja la escena. Los meshes copian
   posición y cuaternión de su cuerpo, sin pasar por React ni por el DOM.
6. **Corte duro a los 4 s** o cuando todos los cuerpos duermen: se congelan los cuerpos, se
   eliminan del mundo y los meshes quedan en su última transformación. Nada de solver eterno.
7. Estado por columna (`stacked | falling | collapsed`) para que el botón sepa qué rearmar.

---

## 9. Accesibilidad y fallbacks

| Situación | Comportamiento |
| --- | --- |
| Sin JS | Hero idéntico al de hoy: fondo `pattern`, título, subtítulo y meta. El canvas no existe. |
| Sin WebGL | `try/catch` al crear el `WebGLRenderer` → mismo resultado: queda el `pattern`. Se loguea un `console.warn`, nada más. |
| `prefers-reduced-motion: reduce` | **No se instancia three.js ni cannon-es.** Queda el `pattern`. La lista de libros existe igual, como texto. |
| Lector de pantalla | El canvas va `aria-hidden="true"`. Encima, un `<div class="sr-only">` con los 4 grupos y sus 5 libros («Marketing: Influence, de Cialdini; …»). |
| Teclado | El botón «Derribar los estantes» / «Reapilar» es un `<button>` real, primer control del hero, con `focus-visible` en `#c70039`. Los 20 libros **no** son tab stops: 20 paradas en un hero es un secuestro de teclado. |
| Puntero táctil | El raycast funciona igual, pero el objetivo real es el botón; el texto de ayuda cambia según `(pointer: coarse)`. |
| Fuera de viewport o pestaña oculta | `IntersectionObserver` + `visibilitychange` cortan el rAF. Ningún frame con el hero fuera de pantalla. |

---

## 10. Rendimiento (presupuestos medibles)

| Métrica | Límite |
| --- | --- |
| Chunk de `three` en `/education` | ~150 KB gzip (es el mismo que ya baja `/skills`; Vercel lo cachea por chunk). |
| `cannon-es` | 74,5 KB gzip, en su propio chunk, solo tras estar en viewport + idle. |
| Texturas | 1 atlas 2048 × 1024 + 4 placas 512 × 128 ≈ 8,5 MB de VRAM. Sin imágenes de red. |
| DPR | `min(devicePixelRatio, 1.75)`; `1.5` en `(pointer: coarse)`. |
| CPU en reposo | 0 tras la coreografía: el rAF se apaga al terminar el asentamiento y se reenciende en hover/click. |
| Frames | objetivo ≥ 50 fps a 1440 × 900 en esta máquina; si no llega, se baja el DPR antes que recortar la escena. |

Nada de esto bloquea el HTML del hero: el título y el subtítulo son estáticos y se pintan con el
documento, con o sin canvas.

---

## 11. Verificación (definition of done)

| Check | Comando | Pasa si |
| --- | --- | --- |
| Tipos | `bun run check` | 0 errores (baseline actual: 0 errores / 15 hints) |
| Lint | `bun run lint` | 7 errores preexistentes, ninguno nuevo |
| Build | `bun run build` | exit 0 |
| Chunks | `ls -la dist/_astro/*.js` + `gzip -c` | `cannon-es` en chunk propio, fuera del entry del hero |
| Navegador real 1440 × 900 | dev server + browser | las 4 pilas se arman; click derriba la columna correcta; «Reapilar» la rearma; 0 errores de consola |
| Móvil 390 × 844 | viewport emulado | sin scroll horizontal, sin secuestro del scroll vertical, tap derriba, botón usable |
| Reduced motion | emular la media query | hero idéntico al actual; `three` no se descarga (verificar en Network) |
| Sin JS | desactivar JS | hero idéntico al actual |
| Sin WebGL | forzar el fallo | hero idéntico al actual + 1 warning en consola |
| Otras vistas | `/experience`, `/gallery` | hero sin cambios (diff de HTML contra el build anterior) |
| Fuga de rAF | devtools Performance | 0 frames con el hero fuera de viewport |

---

## 12. Riesgos

- **Medio — LCP**: el hero gana ~150 KB de three en su ruta. Mitigado con import dinámico, canvas
  transparente que aparece después y copy 100 % estático. Si el número real empeora el LCP en
  mobile, se corta la escena a 2 columnas y se baja el DPR.
- **Medio — jitter de `cannon-es`** al quedar 5 cajas juntas en el piso. Mitigado con fricción
  0,65, `restitution` baja, `allowSleep` agresivo y el corte duro a 4 s.
- **Bajo — contraste** del título sobre la estantería. Mitigado con el scrim y midiendo el
  contraste real en el navegador.
- **Bajo — colisión de CSS**: `PageHero` es compartido por 3 vistas. El cambio es aditivo (valores
  nuevos de un prop + dos slots vacíos por defecto) y se verifica con el diff de HTML de las otras
  dos páginas.
- **Bajo — CPU en equipos viejos**: 20 meshes y 5 materiales es poco, pero el rAF se corta fuera de
  viewport por si acaso.

---

## 13. Decisiones abiertas (default si no hay respuesta)

1. **¿Se arma también el mueble?** Default: las estanterías aparecen estáticas (fade 150 ms); solo
   los libros caen. Alternativa: tableros armándose tablero por tablero primero (+400 ms).
2. **Alcance del click**: Default: derriba **la columna clickeada**. Alternativa: derriba las
   cuatro a la vez.
3. **Orientación de los libros**: Default: pilas horizontales (lomos hacia cámara, texto chico pero
   real). Alternativa: libros parados de canto en fila, con lomos grandes y legibles — más
   «biblioteca», pero deja de ser «apilarse».
4. **¿Se toca el copy del hero?** Default: no. Título, subtítulo y meta quedan exactamente como
   están; solo cambia la capa de fondo.

---

## 14. As built (ejecutado)

Lo que cambió respecto del plan, con la evidencia que lo motivó.

**Medidas reales del bundle final** (no estimadas): `three` = 743 KB crudo / **184 KB gzip** (el plan decía ~150 KB);
`cannon-es` = 123 KB crudo / **34,8 KB gzip** tras el tree-shaking de Vite (el `npm pack` daba 74,5 KB, sin podar).
Ambos quedan en chunks propios; el entry del hero pesa 6,2 KB gzip.

**Geometría final**: nicho 1,55 × 1,16 × 0,82 (ancho interior / alto / profundidad), tablero 0,15,
libro 0,40 × grosor × 0,30. El nicho del plan (1,30 × 0,62 de fondo) resultó demasiado apretado: cinco
libros no tenían espacio para desparramarse y el derribo se leía como "pila inclinada". Se ensanchó a 1,55
y se profundizó a 0,82.

**Los libros caen dentro de su nicho**, no desde fuera del mueble. El plan los hacía caer desde 2,3 unidades
por encima del reposo, lo que los hacía **atravesar el tablero superior**. Ahora cada libro arranca justo
debajo del techo de su nicho y la caída se acorta a medida que la pila crece (`drop` por libro, duración
∝ √distancia), que además es lo físicamente correcto.

**Dentro de una categoría los libros caen en serie**, no en round-robin: con 120 ms de separación el
siguiente arrancaba antes de que aterrizara el anterior y se cruzaban en el aire. Las categorías se
desfasan 140 ms entre sí, así que las cuatro pilas crecen juntas igual.

**Derribo con velocidades explícitas** (`body.velocity.set`), no con `applyImpulse`. Con masa 0,35 el
impulso daba una Δv menor de la esperada y el resultado era una pila que se levantaba entera sin
desarmarse. Ahora: ~2,6–3,5 u/s lateral, ~2,1 u/s arriba, ±4,5 rad/s de giro.

**Placas de estante en papel claro** (`#dcd4c0` con tinta oscura). Las placas oscuras del plan eran
invisibles detrás del scrim: a la escala real no se leía ninguna de las cuatro. Con stock claro las
cuatro se leen (verificado a 1,5× en el navegador).

**Encabezado del libro**: se agregó `spine` (etiqueta corta ≤ 15 caracteres) a `src/data/bookshelf.ts`.
Sin eso, títulos como *Structure and Interpretation of Computer Programs* salían con elipsis.

**Encuadre**: el caso se ancla arriba y ocupa el 40 % del alto del hero (43 % en móvil, sin margen
superior). Con el título ocupando el 60 % inferior, un mueble más grande escondía las pilas detrás de
"EDUCATION". Verificado en 1440×900 y 390×844.

**Un solo slot** (`background`) en `PageHero`, no dos: el wrapper va sin `z-index`, así que no crea
contexto de apilamiento y el botón del hijo puede quedar en `z-20`, por encima del copy en `z-10`.

### Verificación observada

| Check | Resultado |
| --- | --- |
| `bun run check` | 0 errores / 15 hints (baseline) |
| `bun run lint` | 7 errores preexistentes, ninguno nuevo |
| `bun run build` | exit 0 |
| 1440×900 | 4 pilas, 4 placas legibles, click derriba la columna correcta, «Reapilar» la rearma, 0 errores de consola |
| 390×844 | layout 2×2, las 4 pilas sobre el titular, sin scroll horizontal (`scrollWidth` 390) |
| reduced motion | 0 canvas, 0 requests a `three`/`cannon-es`, botón oculto, hero idéntico al anterior |
| sin JS | hero idéntico, botón a `display:none` |
| `/experience`, `/gallery` | sin `data-shelf` en el HTML |

**Frente invisible** (hallazgo de la prueba real): con el nicho abierto, un derribo fuerte mandaba libros
por encima del borde delantero, fuera del mueble y al vacío (no hay piso debajo): la estantería quedaba
con un solo libro. Se agregó un colisionador frontal invisible (0,02 de espesor, a 0,06 del canto, detrás
de la placa) que los contiene. Verificado: los cinco libros quedan dentro y la pila se lee derribada.

**Derribo final**: velocidades explícitas (2,4–3,3 u/s lateral, 2,6–3,2 arriba) y giro de ±6 rad/s. Con
la estantería de 1,55 de ancho, cinco libros de 0,40 no caben en una fila: el resultado físico correcto
es un montón inclinado contra un extremo, no una fila desparramada. Se aceptó ese resultado por ser el
honesto para ese espacio, en lugar de forzar una dispersión falsa.

---

## 15. Segunda pasada — detalle (pedido: "más detalle, libros de colores, que cubra más espacio")

**Libros multicolor.** Cada libro tiene su propio `cloth` en `src/data/bookshelf.ts` (5 tonos por estante,
dentro de la familia de la categoría, más neutros). El atlas de lomos pinta cada celda con el color de su
volumen y las tapas usan un material por libro. La categoría ya no lo dice el color del lomo, lo dice la
placa.

**Muro de biblioteca de fondo.** Un quad pintado (2048×1024, 6 filas de estantes con ~240 lomos, luz
cálida al centro, viñeta a los lados y fundido a #0a0a0a abajo) detrás del mueble, a z = −2,4. Es
`MeshBasicMaterial`: **no recibe las luces**, así que subir la iluminación aclara la estantería y los
objetos sin aclarar el fondo. Sin geometría y sin pedidos de red.

**Objetos.** Por estante, colocados a mano en los extremos (la pila queda en el centro):
lápiz hexagonal (laca, madera, mina, virola, goma), lapicero (cuerpo, capuchón, clip, plumín), hojas
rayadas con un dibujo esquemático distinto por disciplina (embudo, wireframe, gráfico, red neuronal),
notas adhesivas, cuaderno con banda elástica y una nota clavada en el panel trasero con chincheta.
Son estáticos: no entran en la simulación.

**Lo que hubo que corregir para que se vieran** (cada uno salió de una captura, no de una suposición):

| Síntoma | Causa | Arreglo |
| --- | --- | --- |
| Hojas y notas invisibles | cámara nivelada: el plano de la repisa se ve de canto | inclinación de 11,5° hacia abajo (`CAMERA_TILT`) |
| El borde delantero tapaba media repisa | labio de 0,05 con cámara rasante: proyecta 0,4 de sombra | labio a 0,02; el frente invisible ya contiene los libros |
| Nada se apoyaba en nada | sin sombras, todo flotaba | sombra de contacto por pila + halo cálido en el panel trasero |
| Una hoja plana no se lee | — | además de la hoja acostada, una **hoja parada** con `rx` apoyada en el estante |
| Las pilas parecían de máquina | jitter simétrico | yaw alternado por índice (±0,03–0,13 rad) |
| Objetos fuera del nicho en móvil | offsets fijos para un nicho de 1,55 | `squeeze = nicheWidth / 1,55` sobre `dx` |

**Más espacio.** `PageHero` gana `height="tall"` (88vh en vez de 78vh) y el caso pasa a ocupar el 46 % del
alto (antes 40 %), con las pilas todavía por encima del titular: medido, el `h1` arranca a 0,465 del hero y
los libros terminan a 0,458.

**Rendimiento observado**: ~250 mallas, 30 fps estables (vsync del navegador de prueba, mediana y p90
idénticos) en 1440×900. El motor de física sigue durmiendo hasta el primer clic.

### Verificación (segunda pasada)

| Check | Resultado |
| --- | --- |
| `bun run check` | 0 errores / 15 hints |
| `bun run lint` | 7 errores preexistentes, ninguno nuevo |
| `bun run build` | exit 0 |
| 1440×900 | 4 pilas multicolor, 4 placas, lápiz/lapicero/hojas/notas/cuaderno visibles; click derriba la columna y los objetos quedan en su sitio; ningún libro escapa |
| 390×844 | 2×2 con objetos, las 4 pilas sobre el titular, `scrollWidth` = 390 |
| reduced motion | 0 canvas, 0 requests a motor, botón oculto, hero idéntico al anterior (solo más alto) |
| sin JS | ídem |

---

## 16. Incidente: el derribo dejó de responder en dev (2026-11-04)

**Síntoma**: clic sobre un libro o el botón «Derribar los estantes» no hacía nada. Sin errores en
consola visibles desde la página, sin cambios en el render.

**Causa**: la caché de dependencias de Vite. `node_modules/.vite/deps/cannon-es.js` no existía y el
servidor devolvía **504** a
`/node_modules/.vite/deps/cannon-es.js?v=e549e317`. El `import('cannon-es')` fallaba, `loadCannon()`
devolvía `null`, y `collapse()` revertía el estado a `stacked` sin decir nada: el botón quedaba igual y
la escena parecía rota sin ningún rastro.

**Por qué no se vio antes**: el `console.warn` del fallo ocurre en el prefetch por `requestIdleCallback`,
antes de que cualquier captura de consola empiece a escuchar. Y en el build de producción el chunk de
`cannon-es` existe (`dist/_astro/cannon-es.*.js`), así que el bug era **solo de dev**.

**Arreglo**:
1. `rm -rf node_modules/.vite` + reiniciar el dev server (reoptimiza).
2. `loadCannon()` ya no memoriza el fallo: limpia `cannonLoading` en el `catch` para que el siguiente
   clic reintente.
3. El contador de fallos vive en el `catch` del import, no en `collapse` (cuatro derribos en paralelo
   son una sola petición). Tras 3 cargas fallidas la escena **retira la interacción**: se ocultan el
   botón y el cursor, y `data-stage="no-physics"` lo deja legible en el DOM. Un botón que promete un
   derribo y no puede cumplirlo es peor que no tener botón.

**Verificado**: en dev y en `dist/`, clic sobre el estante de Marketing → «Reapilar» y el montón se
desarma; «Reapilar» vuelve al estado inicial. Con `Network.setBlockedURLs(['*cannon*'])` el botón se
retira tras el segundo clic, sin excepciones.

---

## 17. El estante responde más de una vez (2026-11-04)

**Pedido**: «sería excelente que se pudiera seguir haciendo click, no que solo sea un solo click y ya».

**Antes**: `collapse()` exigía `states[category] === 'stacked'`. Tras el primer derribo el estante quedaba
mudo: el único camino era el botón «Reapilar».

**Ahora**:
- `pump(category, origin)` concentra el trabajo: construye o reutiliza el mundo, arma los estáticos del
  resto de pilas y lanza los cuerpos de esa categoría. Devuelve `false` si el motor no cargó.
- `kick(body, index, origin)` define la energía. Sin `origin` es el derribo completo (2.4–3.3 u/s
  lateral, `±12` de giro). Con `origin` es un empujón: 0.9–1.8 lateral **alejándose del punto del clic**,
  1.5–2.2 vertical, `±7` de giro, para que la pila se sacuda sin salir del nicho.
- `collapse()` = primer clic; `shove()` = clics siguientes. `onPointerDown` elige según el estado.
- `pick()` guarda `lastPick` (el `hit.point` del raycast) para que el empujón salga de donde tocó el
  visitante.
- `rebuildStatics()` ahora recibe el mapa `dynamics` y salta los cuerpos ya simulados: antes, derribar
  un estante mientras otro caía duplicaba libros como estáticos y como dinámicos.

**Verificado**: 4 clics seguidos sobre Marketing en dev y en `dist/` → 4 estados distintos y la etiqueta
fija en «Reapilar»; dos estantes derribados + empujones + «Reapilar» vuelve a las cuatro pilas.
Móvil 390×844 con toques reales: igual. Reduced motion: 0 canvas, 0 requests.

**Trampa de verificación** (me costó dos rondas falsas): `Emulation.setDeviceMetricsOverride` no
sobrevive entre llamadas del navegador. Con el viewport reducido a ~776 px, el punto (219,380) caía
sobre el titular y no sobre los libros, y el síntoma era idéntico a «la física está rota». Fijar el
viewport en cada prueba y comprobar `document.elementFromPoint` antes de hacer clic.
