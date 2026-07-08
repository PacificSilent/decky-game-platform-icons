import { callable } from "@decky/api";
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
  overrides: {},
};

const backendGetSettings = callable<[], Partial<PluginSettings>>("get_settings");
const backendSaveSettings = callable<[settings: PluginSettings], boolean>(
  "save_settings",
);

let current: PluginSettings = { ...DEFAULT_SETTINGS };
let loaded = false;
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

/** Synchronous access to the latest known settings. */
export function getSettings(): PluginSettings {
  return current;
}

export function isLoaded(): boolean {
  return loaded;
}

function normalize(raw: Partial<PluginSettings> | undefined): PluginSettings {
  const merged: PluginSettings = { ...DEFAULT_SETTINGS, ...(raw ?? {}) };
  if (!merged.overrides || typeof merged.overrides !== "object") {
    merged.overrides = {};
  }
  // Clamp numeric ranges defensively.
  merged.size = Math.min(96, Math.max(16, Math.round(merged.size)));
  merged.opacity = Math.min(1, Math.max(0.1, merged.opacity));
  return merged;
}

/** Load settings from the Python backend (once), then notify subscribers. */
export async function loadSettings(): Promise<PluginSettings> {
  try {
    const raw = await backendGetSettings();
    current = normalize(raw);
  } catch (e) {
    console.error("[GamePlatformIcons] failed to load settings", e);
    current = { ...DEFAULT_SETTINGS };
  }
  loaded = true;
  emit();
  return current;
}

/** Merge a partial patch into the settings, persist, and notify subscribers. */
export async function updateSettings(
  patch: Partial<PluginSettings>,
): Promise<void> {
  current = normalize({ ...current, ...patch });
  emit();
  try {
    await backendSaveSettings(current);
  } catch (e) {
    console.error("[GamePlatformIcons] failed to save settings", e);
  }
}

/** Set (or clear) the platform override for a single collection. */
export async function setOverride(
  collectionId: string,
  platformId: string | null,
): Promise<void> {
  const overrides = { ...current.overrides };
  if (platformId === null) {
    delete overrides[collectionId];
  } else {
    overrides[collectionId] = platformId;
  }
  await updateSettings({ overrides });
}

/** React hook that re-renders the caller whenever settings change. */
export function useSettings(): PluginSettings {
  const [, force] = useReducer((x: number) => x + 1, 0);
  useEffect(() => subscribeSettings(force), []);
  return current;
}
