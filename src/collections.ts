import { matchPlatform } from "./platforms";
import { getSettings, NONE_PLATFORM, PluginSettings } from "./settings";

/**
 * Minimal typings for Steam's global `collectionStore`. It is a bare global
 * (not declared by @decky/ui), so we declare only what we use. Shape confirmed
 * against the community-canonical typings used by TabMaster / MicroSDeck and the
 * deobfuscated Steam UI.
 */
interface SteamCollection {
  id: string;
  displayName: string;
  apps?: Map<number, unknown>;
}
interface CollectionStore {
  userCollections?: SteamCollection[];
  GetCollectionListForAppID?: (appId: number) => SteamCollection[];
}

declare global {
  // eslint-disable-next-line no-var
  var collectionStore: CollectionStore | undefined;
}

function store(): CollectionStore | undefined {
  return (
    (globalThis as unknown as { collectionStore?: CollectionStore })
      .collectionStore ?? (window as unknown as { collectionStore?: CollectionStore }).collectionStore
  );
}

export interface UserCollection {
  id: string;
  name: string;
}

/** All user-created collections (Steam "Categories"). */
export function getUserCollections(): UserCollection[] {
  const cs = store();
  if (!cs?.userCollections) return [];
  return cs.userCollections
    .filter((c) => c && c.id && c.displayName)
    .map((c) => ({ id: c.id, name: c.displayName }));
}

/** User collections that contain the given app. */
function collectionsForApp(appId: number): SteamCollection[] {
  const cs = store();
  if (!cs) return [];
  if (typeof cs.GetCollectionListForAppID === "function") {
    try {
      return cs.GetCollectionListForAppID(appId) || [];
    } catch {
      /* fall through to manual membership scan */
    }
  }
  const res: SteamCollection[] = [];
  for (const c of cs.userCollections ?? []) {
    try {
      if (c?.apps?.has?.(appId)) res.push(c);
    } catch {
      /* ignore malformed collection */
    }
  }
  return res;
}

/**
 * Resolve which platform badge to show for an app. Priority per the app's
 * collections: an explicit platform override wins immediately; "none" hides that
 * collection's contribution; otherwise auto-detection matches the collection
 * name. When nothing matches, fall back to `fallbackPlatform` (e.g. Steam) so
 * uncategorised titles still get a badge — unless the user explicitly hid one of
 * the app's collections with "none".
 */
export function getPlatformIdForApp(
  appId: number,
  settings: PluginSettings = getSettings(),
): string | null {
  if (!settings.enabled) return null;
  const cols = collectionsForApp(appId);

  let autoMatch: string | null = null;
  let explicitlyHidden = false;
  for (const col of cols) {
    const ov = settings.overrides[col.id];
    if (ov === NONE_PLATFORM) {
      explicitlyHidden = true;
      continue;
    }
    if (ov) return ov;
    if (settings.autoDetect && !autoMatch) {
      const p = matchPlatform(col.displayName);
      if (p) autoMatch = p.id;
    }
  }
  if (autoMatch) return autoMatch;
  if (explicitlyHidden) return null;
  if (settings.fallbackPlatform && settings.fallbackPlatform !== NONE_PLATFORM) {
    return settings.fallbackPlatform;
  }
  return null;
}
