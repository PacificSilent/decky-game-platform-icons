import { findModule, findSP, getReactInstance } from "@decky/ui";
import { getPlatformIdForApp } from "./collections";
import { PLATFORM_GLYPHS } from "./generated-icons";
import { PLATFORMS } from "./platforms";
import { BadgePosition, getSettings, PluginSettings } from "./settings";

const STYLE_ID = "decky-game-platform-icons-style";
const ATTR = "data-dgpi";

/**
 * Steam's hashed CSS-module class names, resolved at runtime by the shape of the
 * module (the values themselves change every Steam build). Resolved lazily and
 * cached so a failed early lookup can be retried.
 */
let _assetClasses: Record<string, string> | null | undefined;
let _carouselClasses: Record<string, string> | null | undefined;

function assetClasses(): Record<string, string> | null {
  if (_assetClasses === undefined) {
    _assetClasses = findModule(
      (m: unknown) =>
        typeof m === "object" &&
        m !== null &&
        (m as Record<string, unknown>).PortraitImage != null &&
        (m as Record<string, unknown>).Container != null &&
        (m as Record<string, unknown>).LandscapeImage != null,
    ) as Record<string, string> | null;
  }
  return _assetClasses ?? null;
}
function carouselClass(): string | null {
  if (_carouselClasses === undefined) {
    _carouselClasses = findModule(
      (m: unknown) =>
        typeof m === "object" &&
        m !== null &&
        (m as Record<string, unknown>).Featured != null &&
        (m as Record<string, unknown>).CarouselGameLabelWrapper != null,
    ) as Record<string, string> | null;
  }
  return _carouselClasses?.Featured ?? null;
}

function containerClass(): string | null {
  return assetClasses()?.Container ?? null;
}

// ----------------------------- glyph + colour -----------------------------

function glyphDataUri(platformId: string, fill: string): string {
  const g = PLATFORM_GLYPHS[platformId];
  if (!g) return "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${g.viewBox}" fill="${fill}">${g.inner}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function relLuminance(hex: string): number {
  const c = hex.replace("#", "");
  if (c.length < 6) return 0;
  const ch = (i: number) => parseInt(c.slice(i, i + 2), 16) / 255;
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(ch(0)) + 0.7152 * lin(ch(2)) + 0.0722 * lin(ch(4));
}
/** Pick a readable glyph colour for a coloured chip background. */
function glyphOnChip(hex: string): string {
  return relLuminance(hex) > 0.6 ? "#16181d" : "#ffffff";
}

function positionCss(pos: BadgePosition, offset: number): string {
  const o = `${offset}px`;
  switch (pos) {
    case "top-left":
      return `top:${o};left:${o}`;
    case "bottom-left":
      return `bottom:${o};left:${o}`;
    case "bottom-right":
      return `bottom:${o};right:${o}`;
    case "top-right":
    default:
      return `top:${o};right:${o}`;
  }
}

function buildCss(settings: PluginSettings, cls: string): string {
  const size = settings.size;
  const offset = Math.max(4, Math.round(size * 0.16));
  const radius = Math.round(size * 0.26);
  const pos = positionCss(settings.position, offset);
  const sel = `.${cls}`;

  let css = `${sel}[${ATTR}]{position:relative;}\n`;
  for (const p of PLATFORMS) {
    let bg: string;
    let fill: string;
    let extra: string;
    if (settings.showChip) {
      bg = settings.useColor ? p.color : "rgba(18,20,25,0.92)";
      fill = settings.useColor ? glyphOnChip(p.color) : "#ffffff";
      extra = `border-radius:${radius}px;box-shadow:0 2px 6px rgba(0,0,0,0.55),inset 0 0 0 1px rgba(255,255,255,0.14);`;
    } else {
      bg = "transparent";
      fill = settings.useColor ? p.color : "#ffffff";
      extra = `filter:drop-shadow(0 1px 2px rgba(0,0,0,0.9));`;
    }
    const uri = glyphDataUri(p.id, fill);
    const bgSize = settings.showChip ? "62%" : "88%";
    css +=
      `${sel}[${ATTR}="${p.id}"]::after{content:"";position:absolute;${pos};` +
      `width:${size}px;height:${size}px;background-color:${bg};` +
      `background-image:url("${uri}");background-size:${bgSize};background-repeat:no-repeat;` +
      `background-position:center;${extra}opacity:${settings.opacity};pointer-events:none;z-index:10;}\n`;
  }
  return css;
}

// ----------------------------- style injection ----------------------------

export function applyStyles(): void {
  const cls = containerClass();
  if (!cls) return;
  const doc = findSP().window.document;
  let el = doc.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = doc.createElement("style");
    el.id = STYLE_ID;
    doc.head.appendChild(el);
  }
  el.textContent = buildCss(getSettings(), cls);
}

export function removeStyles(): void {
  const doc = findSP().window.document;
  doc.getElementById(STYLE_ID)?.remove();
  doc.querySelectorAll(`[${ATTR}]`).forEach((e) => e.removeAttribute(ATTR));
}

// ----------------------------- appid from fiber ---------------------------

function appIdFromElement(el: Element): number | null {
  // The fiber is walked dynamically, so it is intentionally untyped.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fiber: any = getReactInstance(el);
  let depth = 0;
  while (fiber && depth < 25) {
    const props = fiber.memoizedProps;
    if (props) {
      if (typeof props.appid === "number") return props.appid;
      const ov = props.appOverview;
      if (ov) {
        const a = ov.appid;
        if (typeof a === "number") return a;
        if (typeof a === "string" && a) {
          const n = Number(a);
          if (!Number.isNaN(n)) return n;
        }
      }
    }
    fiber = fiber.return;
    depth++;
  }
  return null;
}

// ----------------------------- tagging ------------------------------------

/** (Re)compute and set the platform data-attribute on every visible capsule. */
export function tagCapsules(): void {
  const cls = containerClass();
  if (!cls) return;
  const settings = getSettings();
  const doc = findSP().window.document;
  const carousel = settings.showOnHome ? null : carouselClass();

  doc.querySelectorAll(`.${cls}`).forEach((el) => {
    const cur = el.getAttribute(ATTR);
    let pid: string | null = null;

    if (settings.enabled) {
      // When Home badges are disabled, skip capsules inside Home carousels.
      const allowed = !carousel || el.closest(`.${carousel}`) == null;
      if (allowed) {
        const appId = appIdFromElement(el);
        if (appId != null) pid = getPlatformIdForApp(appId, settings);
      }
    }

    if (pid) {
      if (cur !== pid) el.setAttribute(ATTR, pid);
    } else if (cur !== null) {
      el.removeAttribute(ATTR);
    }
  });
}

// ----------------------------- observer -----------------------------------

let observer: MutationObserver | null = null;
let scheduled = false;

export function startObserver(): void {
  if (observer) return;
  const win = findSP().window;
  const doc = win.document;

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    win.requestAnimationFrame(() => {
      scheduled = false;
      try {
        tagCapsules();
      } catch (e) {
        console.error("[GamePlatformIcons] tagCapsules failed", e);
      }
    });
  };

  observer = new win.MutationObserver(() => schedule());
  // childList/subtree catches new + recycled capsules; the `src` attribute
  // filter catches image swaps when a virtualised cell is reused. We never
  // observe our own `data-dgpi` writes, so there is no feedback loop.
  observer.observe(doc.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src"],
  });
  schedule();
}

export function stopObserver(): void {
  observer?.disconnect();
  observer = null;
}
