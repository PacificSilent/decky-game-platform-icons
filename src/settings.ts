import { useEffect, useReducer } from "react";

export type BadgePosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface PluginSettings {
  /** Master on/off switch for the whole feature. */
  enabled: boolean;
  /** Which corner of the card the badge sits in. */
  position: BadgePosition;
  /** Badge size in px (icon box). */
  size: number;
  /** Badge opacity 0..1. */
  opacity: number;
  /** Also draw badges on the Home screen carousels (not just the Library). */
  showOnHome: boolean;
  /** Use each platform's brand colour instead of a flat white glyph. */
  useColor: boolean;
  /** Draw a rounded background chip behind the glyph for contrast. */
  showChip: boolean;
  /** Auto-match collection names to known platforms. */
  autoDetect: boolean;
  /**
   * Platform id shown for apps that don't match any collection (e.g. plain
   * Steam titles). "none" disables the fallback so only categorised games get a
   * badge. Defaults to "steam".
   */
  fallbackPlatform: string;
  /**
   * Per-collection manual mapping. Key is the Steam collection id, value is a
   * platform id from the registry, or the literal "none" to hide a badge for
   * that collection. Overrides always win over auto-detection.
   */
  overrides: Record<string, string>;
}

export const NONE_PLATFORM = "none";

export const DEFAULT_SETTINGS: PluginSettings = {
  enabled: true,
  position: "top-right",
  size: 34,
  opacity: 0.95,
  showOnHome: true,
  useColor: true,
  showChip: true,
  autoDetect: true,
  fallbackPlatform: "steam",
  overrides: {},
};

const STORAGE_KEY = "decky-game-platform-icons:settings";

function normalize(raw: Partial<PluginSettings> | undefined): PluginSettings {
  const merged: PluginSettings = { ...DEFAULT_SETTINGS, ...(raw ?? {}) };
  if (!merged.overrides || typeof merged.overrides !== "object") {
    merged.overrides = {};
  }
  merged.size = Math.min(96, Math.max(16, Math.round(merged.size)));
  merged.opacity = Math.min(1, Math.max(0.1, merged.opacity));
  return merged;
}

function readStored(): Partial<PluginSettings> | undefined {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Partial<PluginSettings>;
  } catch (e) {
    console.error("[GamePlatformIcons] failed to read settings", e);
  }
  return undefined;
}

function writeStored(settings: PluginSettings): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("[GamePlatformIcons] failed to save settings", e);
  }
}

// Settings persist in the Steam client's localStorage (like sibling plugins),
// so they load synchronously at startup — no async round-trip, no default flash.
let current: PluginSettings = normalize(readStored());
const listeners = new Set<() => void>();

function emit() {
  for (const fn of listeners) {
    try {
      fn();
    } catch (e) {
      console.error("[GamePlatformIcons] settings listener error", e);
    }
  }
}

/** Subscribe to settings changes. Returns an unsubscribe function. */
export function subscribeSettings(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Synchronous access to the latest settings. */
export function getSettings(): PluginSettings {
  return current;
}

/** Re-read settings from storage and notify subscribers. */
export function loadSettings(): PluginSettings {
  current = normalize(readStored());
  emit();
  return current;
}

/** Merge a partial patch into the settings, persist, and notify subscribers. */
export function updateSettings(patch: Partial<PluginSettings>): void {
  current = normalize({ ...current, ...patch });
  writeStored(current);
  emit();
}

/** Set (or clear) the platform override for a single collection. */
export function setOverride(
  collectionId: string,
  platformId: string | null,
): void {
  const overrides = { ...current.overrides };
  if (platformId === null) {
    delete overrides[collectionId];
  } else {
    overrides[collectionId] = platformId;
  }
  updateSettings({ overrides });
}

/** React hook that re-renders the caller whenever settings change. */
export function useSettings(): PluginSettings {
  const [, force] = useReducer((x: number) => x + 1, 0);
  useEffect(() => subscribeSettings(force), []);
  return current;
}
