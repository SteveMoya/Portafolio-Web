# Hero de /experience — Tren de engranajes

**Estado**: propuesta, pendiente de aprobación.
**Rama**: `redesign/personalblog-v2`. **Runner**: `bun` (no hay tests en el proyecto).

## 1. Objetivo

Sustituir el `background="pattern"` del hero de `/experience` por una escena 3D: un banco de relojería
en penumbra con un **tren de tres engranajes de latón**, uno por etapa profesional. El tren gira, se
puede arrastrar con el puntero, y al hacer clic en una rueda se abre la tarjeta de ese puesto en la
cronología.

Con esto cada vista queda con un objeto físico distinto: **Education** = estantería con libros y
objetos; **Skills** = visor en el espacio; **Contact** = las cuatro fases; **Experience** = un
mecanismo. Ninguna repite el vocabulario de otra.

## 2. Dónde

**En el hero**, no en la cronología. Razones:

- El slot `background` de `PageHero` ya existe y no hay que tocar las otras tres vistas.
- La sección `#cronologia` es una rejilla de dos columnas con años pegajosos, barra de filtros y
  tarjetas; un canvas detrás pelea con la lectura y con el scroll.
- Las cuatro vistas ya tienen su escena en el hero; mover una sola a media página rompe el patrón.

El hero conserva `motion="scroll"`, el titular y el subtítulo. La escena va detrás, con el mismo velo
que se usó en Education.

## 3. El mecanismo (lo que hay que hacer bien)

Un engranaje mal montado se nota a simple vista: dientes que se atraviesan o que flotan. Por eso la
geometría y la cinemática salen a un módulo puro y se verifican numéricamente antes de dibujar nada.

**Regla de tamaño**: el número de dientes es proporcional al tiempo trabajado. El tamaño *es* la
duración; no es decoración.

| Etapa | Periodo | Meses* | Dientes | Radio de paso |
| --- | --- | --- | --- | --- |
| AI & Data | 2023-06 → 2024-12 (cerrada) | 19 | 22 | 1,10 |
| Freelance | 2024-01 → hoy | 34 | 29 | 1,45 |
| ICC | 2025-09 → hoy | 14 | 19 | 0,95 |

\* contra `REFERENCE_DATE = 2026-11-01`, constante en el archivo de datos: los builds son deterministas
aunque pasen meses.

- **Módulo único** `m = 0,10` para las tres: sin módulo igual no engranan.
- **Distancia entre centros** `= m·(N₁+N₂)/2`. Orden cronológico de izquierda a derecha.
- **Relación** `ω₂ = −ω₁·N₁/N₂` (signo opuesto: giran en sentidos contrarios).
- **Fase**: cada rueda se gira para que un diente del conductor caiga en el hueco del conducido sobre
  la línea de centros. Se calcula, no se ajusta a ojo.
- **Corona, radios, cubo, radios de rueda** derivados de `m` y `N` (addendum `m`, dedendum `1,25m`).

**Una corrección a lo que te propuse**: dije que la rueda de 2023 quedaría quieta. No puede: si
engrana, gira. La rueda que engrana y no se mueve es una mentira física y se lee como un bug. En su
lugar, «completada» se dice con tres cosas que sí son ciertas:

1. La manivela está montada en **ICC** (el rol en curso): hoy es lo que mueve el mecanismo.
2. La placa de latón de cada rueda dice `EN CURSO` o `COMPLETADA` con las fechas reales.
3. La rueda cerrada va en latón **patinado** (más oscuro, rugoso); las activas, latón pulido.

## 4. Lo que se ve

- **El banco**: madera oscura con vetas y marcas de uso, un paño de terciopelo granate bajo las ruedas,
  virutas de latón, una lupa de relojero, una lata de aceite, un destornillador y pinzas.
- **Las ruedas**: latón torneado con **marcas concéntricas de torno** (esto es lo que las hace parecer
  mecanizadas y no extruidas), vaciados de rueda (5 huecos), cubo, eje de acero y tornillo con ranura.
  Bisel suave en los dientes para que la luz los lea.
- **La manivela** en ICC: brazo de latón + empuñadura de madera, girando con la rueda.
- **Fondo**: plano pintado con la misma penumbra y viñeta que el muro de la biblioteca, para que se
  sienta la misma casa. Es `MeshBasicMaterial`: subir luces no lo aclara.
- **Luz**: clave cálida desde arriba-izquierda, contraluz ámbar y el rojo `#c70039` como acento, igual
  que en Education.
- **Cámara**: inclinada ~8° hacia abajo para ver los dientes y no el canto de las ruedas (el error que
  costó una pasada entera en la estantería).

## 5. Interacción

| Gesto | Qué pasa |
| --- | --- |
| Sin interacción | El tren gira lento y constante (6°/s en el conductor) |
| Arrastrar horizontal | La manivela sigue al puntero con inercia; todo el tren respeta las relaciones |
| Hover en una rueda | Esa rueda sube de brillo y su placa se ilumina |
| Clic en una rueda | Scroll suave a su tarjeta en `#cronologia` y la expande |

El clic no abre un panel propio: reutiliza la tarjeta que ya existe (`ExpandableExperienceCard`). Si la
tarjeta ya está abierta no la cierra; si el filtro activo la ocultó, primero vuelve a `Todos`.

## 6. Accesibilidad y fallbacks

- El canvas es `aria-hidden="true"`: la información vive en el titular, el subtítulo y la cronología.
- **No hay elementos enfocables nuevos**. El clic en la rueda es una mejora para puntero; el teclado ya
  tiene las tarjetas.
- Cursor `grab` / `grabbing` sobre la escena.
- `prefers-reduced-motion: reduce` → no se crea canvas ni se importa `three` (el motor no se descarga).
- Sin JS → queda el dot grid actual, idéntico.
- `document.hidden` y fuera de viewport → se pausa el bucle (el mismo pitfall que ya está documentado
  en la skill `interactive-3d-web`).

## 7. Rendimiento

- **Sin dependencias nuevas**: solo `three`, que ya se carga en otras vistas (184,6 KB gzip, chunk
  diferido). No entra `cannon-es`: esto es cinemática, no simulación.
- ~30–40 mallas (3 ruedas + 3 ejes + manivela + props), DPR limitado a 1,5 con puntero grueso.
- Carga tras `IntersectionObserver` + `requestIdleCallback`, igual que la estantería.
- El bucle se detiene al salir del viewport.

## 8. Archivos

| Archivo | Estado |
| --- | --- |
| `src/lib/gears.ts` | **nuevo** — matemática pura: perfil de diente, módulo, centros, fases, relaciones. Sin `three`. |
| `src/data/experienceGears.ts` | **nuevo** — las tres etapas mapeadas a dientes/estado/placa, derivadas de `src/data/experiences.ts` |
| `src/components/sections/experience/GearTrainHero.astro` | **nuevo** — escena, materiales, props, interacción |
| `src/components/ui/PageHero.astro` | `background` acepta `'gears'` (aditivo, no rompe las otras vistas) |
| `src/pages/experience.astro` | monta el componente en el slot `background` |
| `.hermes/plans/experience-gears.md` | este documento |

## 9. Verificación

| Check | Cómo |
| --- | --- |
| **El engrane es correcto** | Script de scratch que importa `src/lib/gears.ts`, muestrea 360 ángulos del conductor y comprueba, por par engranado: (a) polígonos de dientes sin intersección, (b) contacto real (hueco mínimo < 0,02·m), (c) relación angular `N₁/N₂` dentro de 1e-9 |
| Render 1440×900 | Zoom 2,5× sobre cada par de dientes: sin atravesarse, sin flotar |
| Interacción | Arrastrar 90° en el conductor → medir el giro de las otras dos en el DOM |
| Clic | Abre la tarjeta correcta de la cronología, con el filtro en `Todos` |
| 390×844 | Tren vertical (o módulo reducido): las tres ruedas legibles sobre el titular, `scrollWidth` = 390 |
| reduced motion / sin JS | 0 canvas, 0 requests al motor, hero igual al actual |
| `bun run check` / `lint` / `build` | 0 errores nuevos; lint con los 7 preexistentes; build exit 0 |
| Peso | `three` sin cambios; el script de la escena por debajo de 10 KB gzip |

## 10. Riesgos

- **La matemática del diente**: es lo único que puede salir mal de forma visible. Mitigado por el
  módulo puro y el test geométrico antes de abrir el navegador.
- **La rueda cerrada ya no está quieta**: cambio respecto de la propuesta; explicado en §3.
- **Móvil**: un tren de tres ruedas en fila no entra en 390 px. Plan: girar la disposición a vertical,
  que además refuerza la lectura de abajo hacia arriba en el tiempo.
- **Escena continua**: el bucle nunca se asienta (las ruedas giran siempre). Se pausa fuera de viewport
  y con la pestaña oculta; si el consumo se nota, se baja a 30 fps.

## 11. Fuera de alcance

- No se toca la cronología, ni las tarjetas, ni `SkillsHero.astro` (que ya venía modificado).
- No se agregan dependencias.
- No se commitea: el árbol queda con los cambios para que los revises.

---

## 12. As built (ejecutado)

### Lo que cambió respecto del plan

| Plan | Construido | Por qué |
| --- | --- | --- |
| Placas de latón en 3D | **Chip de hover en HTML** | Las placas comían el 25 % del alto disponible y quedaban detrás del titular. El chip es texto real, nítido, y en reposo la escena es mecanismo puro. |
| Rueda cerrada quieta | **Todo el tren gira** | Un engranaje engranado no puede quedarse quieto; "completada" se dice con la pátina y la fecha. |
| Placas bajo el tren | **Marco de máquina** (viga + postes hasta el banco) | Sin él los ejes flotaban en el aire: era el defecto más visible del primer render. |
| `height` por defecto | **`height="tall"` (88vh)** | Con 78vh el copy empezaba a 0,362 y no había sitio por encima. Ahora empieza a 0,435 y el tren termina a 0,40. |

### Números reales

- Dientes: **22 / 30 / 20** (22 = IA, 30 = Freelance, 20 = ICC), módulo 0,10. La regla
  `round(meses/2) + 12` con `REFERENCE_DATE = 2026-11-01` da 22 / 30 / 20.
- El tren ocupa ~48 % del ancho y 0,38 del alto; el copy arranca a 0,435.
- Script de la escena: **7,3 KB gzip**. `three`, 184,6 KB gzip, sigue en su chunk diferido y compartido.
  Sin dependencias nuevas.

### Tres defectos que solo aparecieron al probar

1. **Las tarjetas no se abrían en producción.** La tarjeta es una isla `client:visible`: si el clic
   sintético llega antes de la hidratación, es un no-op silencioso. Se resolvió reintentando hasta que
   `aria-expanded` cambia de verdad, y con un scroll propio (más una corrección a los 760 ms) porque un
   scroll suave se quedaba corto cuando las animaciones de revelado crecían la página a mitad de vuelo.
2. **El test de engrane escondía el par malo.** Reportaba el mínimo global entre pares; un par media
   vuelta fuera se esconde detrás del que sí engrana. Ahora se reporta y se afirma por par.
3. **La prueba de clic fallaba por el entorno, no por el código.** Chrome restaura el scroll al
   recargar: el clic a coordenadas fijas caía fuera del hero. Hay que `scrollTo(0, 0)` tras navegar.

### Verificación

| Check | Resultado |
| --- | --- |
| `scratch/verify-gears.ts` (row + column, 72 muestras) | `ai/freelance` gap 0,0031–0,0047 · `freelance/icc` 0,0031–0,0041 · **0 cruces** en ambos · relación y fase exactas sobre 50 vueltas |
| Zoom 6× en la unión | diente dentro del valle; la lectura "no engranan" a 1× es artefacto de resolución |
| 1440×900 | 3 engranajes, marco, banco y props; hover muestra el chip correcto; **cada engranaje abre su propia tarjeta** (verificado los tres, en `dist/`) |
| Arrastrar | el render cambia (hash distinto antes/después) y el tren mantiene la relación |
| 390×844 | tren **vertical**, 3 ruedas sobre el titular, `scrollWidth` 390, sin recorte lateral |
| reduced motion | 0 canvas, 0 requests a `three` |
| sin JS | canvas 0, hero y titular intactos |
| `bun run check` | 0 errores · 16 hints |
| `bun run lint` | 7 errores preexistentes (ChatbotWidget, ExperienceStickyScroll, CleanFilmGrid), ninguno nuevo |
| `bun run build` | 49 páginas, exit 0 |

**Risk: item 3** — `PageHero` es compartido: el tipo `background` gana `'gears'` (aditivo, con default) y
la condición del slot pasa a `'shelves' || 'gears'`. `/education`, `/skills` y `/gallery` conservan su
markup. La página `/experience` además gana `height="tall"` y `data-exp-id` en las tarjetas (atributo
nuevo, no cambia comportamiento).
