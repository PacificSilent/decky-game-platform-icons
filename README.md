# Game Platform Icons

Plugin de [Decky Loader](https://decky.xyz/) para Steam Deck que añade el **logo
de la plataforma** (Xbox, PlayStation, Switch, y muchas más) en la esquina de
cada card de juego, según la **colección de Steam** a la que pertenece.

> Si tienes una colección llamada **«Xbox 360»**, todos los juegos de esa
> colección mostrarán el logo de Xbox. Si tienes una colección **«Switch»**,
> todos esos juegos mostrarán el logo de Switch. Ideal para organizar juegos
> emulados por consola.

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
- `main.py` — backend que persiste la configuración.

### Añadir o ajustar una plataforma

Edita `src/platforms.tsx`: añade/edita una entrada de `PLATFORMS` (color, icono,
`aliases`) y ejecuta `pnpm build` (regenera los iconos automáticamente).

## Licencia

BSD-3-Clause. Consulta [LICENSE](./LICENSE).
