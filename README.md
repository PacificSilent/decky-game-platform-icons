# Game Platform Icons

Plugin de [Decky Loader](https://decky.xyz/) para Steam Deck que añade el **logo
de la plataforma** (Xbox, PlayStation, Switch, y muchas más) en la esquina de
cada card de juego, según la **colección de Steam** a la que pertenece.

> Si tienes una colección llamada **«Xbox 360»**, todos los juegos de esa
> colección mostrarán el logo de Xbox. Si tienes una colección **«Switch»**,
> todos esos juegos mostrarán el logo de Switch. Ideal para organizar juegos
> emulados por consola.

## Capturas

**Biblioteca** — cada juego con el logo de su plataforma según su colección:

![Biblioteca de Steam Deck con un logo de plataforma en la esquina de cada card](assets/library.png)

**Inicio** — también en los carruseles de la pantalla principal:

![Pantalla de Inicio con los iconos de plataforma](assets/home.png)

**Ajustes** (menú de Acceso rápido → Game Platform Icons):

![Panel de ajustes del plugin en el menú de Acceso rápido](assets/settings.png)

## Características

- 🎮 **46 plataformas** reconocidas: Nintendo (Switch, Wii U/Wii, GameCube, N64,
  SNES, NES, Game Boy/Color/Advance, DS, 3DS), Sony (PS1–PS5, PSP, Vita),
  Microsoft (Xbox, 360, One, Series), Sega (Genesis/Mega Drive, Saturn,
  Dreamcast, Master System, Game Gear), retro (Atari, Neo Geo, TurboGrafx/PC
  Engine, 3DO, Commodore/Amiga, MS-DOS, Arcade/MAME), tiendas (Steam, Epic, GOG)
  y más.
- ✨ **Detección automática** por el nombre de la colección: «Xbox 360», «Nintendo
  Switch», «PS2», «Super Nintendo»… se reconocen solas (con desambiguación
  inteligente, p. ej. *Xbox 360* gana a *Xbox*).
- ✏️ **Mapeo manual** por colección desde el menú de Acceso rápido: elige el logo
  exacto o **oculta** el badge para una colección concreta.
- 🏷️ **Icono por defecto** para juegos sin categoría (por defecto el logo de
  Steam), configurable, para que todo el catálogo tenga su badge.
- 🎨 **Colores de marca representativos** para cada plataforma.
- ⚙️ **Personalizable**: esquina (4 posiciones), tamaño, opacidad, con/sin fondo
  (chip), logo en color de marca o blanco, y mostrar u ocultar en la pantalla de
  Inicio.
- 🛡️ **Robusto**: los badges se dibujan con CSS sobre las cards existentes. Si una
  actualización de Steam cambia la interfaz, en el peor caso faltarían badges
  — **nunca rompe ni bloquea la biblioteca**.

## Uso

1. En tu biblioteca de Steam, organiza tus juegos en **colecciones** (Steam las
   llama «Categorías»): mantén pulsado un juego → **Administrar** →
   **Colecciones**, y crea/asigna una colección por consola (p. ej. «Xbox 360»,
   «Switch», «PS2»…).
2. Abre el **menú de Acceso rápido** (botón `...`) → **Game Platform Icons**.
3. La **detección automática** ya asigna un logo a cada colección reconocida. Si
   alguna no coincide, o quieres cambiarla, usa el desplegable de esa colección
   para elegir el logo manualmente (o «Ocultar logo»).
4. Ajusta posición, tamaño, opacidad y estilo a tu gusto.

> Un juego puede estar en varias colecciones. Si defines un logo manual para
> alguna de ellas, ese gana; si no, se usa la primera colección reconocida
> automáticamente.

## Cómo funciona

- Lee las colecciones del usuario desde el `collectionStore` global de Steam y,
  para cada card visible, obtiene su `appid` del fiber de React.
- Resuelve la plataforma (override manual → auto-detección por nombre) y marca la
  card con un atributo `data-dgpi`.
- Inyecta CSS que dibuja el badge (un `::after` con el logo como `data:` URI SVG)
  en la esquina de las cards marcadas. Un `MutationObserver` mantiene las marcas
  al día al desplazar o navegar por la biblioteca.

Los logos provienen de [react-icons](https://react-icons.github.io/react-icons/)
(marcas disponibles) y de glifos SVG propios para las consolas que no tienen icono
de marca (toda la familia Nintendo, entre otras), que se representan con una
abreviatura clara en su color.

## Desarrollo

Requisitos: Node.js 18+ y [pnpm](https://pnpm.io/) 9.

```bash
pnpm install        # instala dependencias
pnpm build          # regenera los iconos y compila a dist/
pnpm watch          # build en modo watch
pnpm typecheck      # comprobación de tipos
```

- `src/platforms.tsx` — registro de plataformas (id, nombre, color, icono,
  aliases para auto-detección). **Fuente única de verdad.**
- `src/generated-icons.ts` — **autogenerado** por `scripts/gen-icons.mjs` a partir
  de `platforms.tsx` (se ejecuta solo en `pnpm build`). No editar a mano.
- `src/glyphs.tsx` — glifos SVG propios (Switch, D-pad, cartucho, texto).
- `src/cardBadges.ts` — CSS de los badges + observer que marca las cards.
- `src/collections.ts` — acceso a `collectionStore` y resolución de plataforma.
- `src/QuickAccess.tsx` — panel de ajustes del menú de Acceso rápido.
- `main.py` — backend mínimo (solo registra eventos de ciclo de vida; la
  configuración se guarda en el `localStorage` del cliente de Steam).

### Añadir o ajustar una plataforma

Edita `src/platforms.tsx`: añade/edita una entrada de `PLATFORMS` (color, icono,
`aliases`) y ejecuta `pnpm build` (regenera los iconos automáticamente).

## Desarrollo asistido por IA

El desarrollo de este plugin fue **asistido por IA** (Claude Code): diseño,
código, tests y documentación se realizaron con su ayuda y revisión humana.

## Licencia

**MIT** — consulta [LICENSE](./LICENSE).

### Aviso legal y marcas

Este es un plugin **no oficial** y no está afiliado, patrocinado ni respaldado
por Valve, Microsoft, Sony, Nintendo, Sega ni ninguna otra empresa. Todos los
nombres de plataformas y logotipos son **marcas registradas de sus respectivos
propietarios** y se usan aquí únicamente con fines identificativos (uso
nominativo) para indicar a qué sistema pertenece cada juego.

### Atribuciones

- Iconos de marca vía [react-icons](https://github.com/react-icons/react-icons),
  que empaqueta **Font Awesome Free** (iconos con licencia CC BY 4.0) y **Simple
  Icons** (CC0).
- Los glifos de la familia Nintendo y otros sistemas sin icono de marca son
  **SVG propios** incluidos en este repositorio.
