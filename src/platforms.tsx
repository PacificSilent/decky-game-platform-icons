import { ComponentType } from "react";
import {
  FaApple,
  FaGamepad,
  FaSteam,
  FaWindows,
  FaXbox,
} from "react-icons/fa6";
import {
  SiAndroid,
  SiAtari,
  SiCommodore,
  SiEpicgames,
  SiGogdotcom,
  SiPlaystation,
  SiPlaystation2,
  SiPlaystation3,
  SiPlaystation4,
  SiPlaystation5,
  SiPlaystationportable,
  SiPlaystationvita,
  SiRetroarch,
  SiSega,
} from "react-icons/si";
import {
  CartridgeGlyph,
  DPadGlyph,
  GlyphProps,
  makeTextGlyph,
  SwitchGlyph,
} from "./glyphs";

export type PlatformIcon = ComponentType<GlyphProps>;

export type PlatformGroup =
  | "Sony"
  | "Microsoft"
  | "Nintendo"
  | "Sega"
  | "Retro"
  | "PC & Stores"
  | "Other";

export interface Platform {
  /** Stable id persisted in settings. Never change these. */
  id: string;
  /** Human readable name shown in the config UI. */
  label: string;
  /** Logical grouping for the config dropdown. */
  group: PlatformGroup;
  /** Brand colour used for the chip / glyph tint. */
  color: string;
  /** The glyph component. */
  icon: PlatformIcon;
  /** Names (collection titles) that should auto-map to this platform. */
  aliases: string[];
}

/**
 * The curated platform registry. Order matters only for stable listing; the
 * matcher below scores aliases so specificity — not order — decides winners.
 */
export const PLATFORMS: Platform[] = [
  // ---------------- Sony ----------------
  {
    id: "ps1",
    label: "PlayStation",
    group: "Sony",
    color: "#5677A5",
    icon: SiPlaystation,
    aliases: ["playstation", "playstation 1", "ps1", "psone", "ps one", "psx", "sony playstation"],
  },
  {
    id: "ps2",
    label: "PlayStation 2",
    group: "Sony",
    color: "#2E6DB4",
    icon: SiPlaystation2,
    aliases: ["playstation 2", "ps2"],
  },
  {
    id: "ps3",
    label: "PlayStation 3",
    group: "Sony",
    color: "#1B4C8C",
    icon: SiPlaystation3,
    aliases: ["playstation 3", "ps3"],
  },
  {
    id: "ps4",
    label: "PlayStation 4",
    group: "Sony",
    color: "#1F62B8",
    icon: SiPlaystation4,
    aliases: ["playstation 4", "ps4"],
  },
  {
    id: "ps5",
    label: "PlayStation 5",
    group: "Sony",
    color: "#0E5AD6",
    icon: SiPlaystation5,
    aliases: ["playstation 5", "ps5"],
  },
  {
    id: "psp",
    label: "PSP",
    group: "Sony",
    color: "#2B2F63",
    icon: SiPlaystationportable,
    aliases: ["psp", "playstation portable"],
  },
  {
    id: "psvita",
    label: "PS Vita",
    group: "Sony",
    color: "#0072CE",
    icon: SiPlaystationvita,
    aliases: ["ps vita", "psvita", "playstation vita", "vita"],
  },
  // ---------------- Microsoft ----------------
  {
    id: "xbox",
    label: "Xbox",
    group: "Microsoft",
    color: "#107C10",
    icon: FaXbox,
    aliases: ["xbox", "microsoft xbox", "og xbox", "xbox original", "xbox classic"],
  },
  {
    id: "xbox360",
    label: "Xbox 360",
    group: "Microsoft",
    color: "#0E9D0E",
    icon: FaXbox,
    aliases: ["xbox 360", "x360", "360"],
  },
  {
    id: "xboxone",
    label: "Xbox One",
    group: "Microsoft",
    color: "#0B6A0B",
    icon: FaXbox,
    aliases: ["xbox one", "xbone"],
  },
  {
    id: "xboxseries",
    label: "Xbox Series",
    group: "Microsoft",
    color: "#0A7D0A",
    icon: FaXbox,
    aliases: ["xbox series", "xbox series x", "xbox series s", "series x", "series s", "xsx"],
  },
  // ---------------- Nintendo ----------------
  {
    id: "switch",
    label: "Nintendo Switch",
    group: "Nintendo",
    color: "#E60012",
    icon: SwitchGlyph,
    aliases: ["nintendo switch", "switch", "nsw"],
  },
  {
    id: "wiiu",
    label: "Wii U",
    group: "Nintendo",
    color: "#0AB9E6",
    icon: makeTextGlyph("WiiU"),
    aliases: ["wii u", "wiiu"],
  },
  {
    id: "wii",
    label: "Nintendo Wii",
    group: "Nintendo",
    color: "#00A0E9",
    icon: makeTextGlyph("Wii"),
    aliases: ["nintendo wii", "wii"],
  },
  {
    id: "gamecube",
    label: "GameCube",
    group: "Nintendo",
    color: "#6A5FBB",
    icon: makeTextGlyph("GC"),
    aliases: ["gamecube", "game cube", "ngc", "gcn", "nintendo gamecube", "dolphin"],
  },
  {
    id: "n64",
    label: "Nintendo 64",
    group: "Nintendo",
    color: "#E4000F",
    icon: makeTextGlyph("N64"),
    aliases: ["nintendo 64", "n64"],
  },
  {
    id: "snes",
    label: "Super Nintendo",
    group: "Nintendo",
    color: "#514689",
    icon: makeTextGlyph("SNES"),
    aliases: ["super nintendo", "snes", "super nes", "super famicom", "sfc"],
  },
  {
    id: "nes",
    label: "Nintendo Entertainment System",
    group: "Nintendo",
    color: "#B0392E",
    icon: makeTextGlyph("NES"),
    aliases: ["nintendo entertainment system", "nes", "famicom"],
  },
  {
    id: "gba",
    label: "Game Boy Advance",
    group: "Nintendo",
    color: "#4E2A84",
    icon: makeTextGlyph("GBA"),
    aliases: ["game boy advance", "gameboy advance", "gba"],
  },
  {
    id: "gbc",
    label: "Game Boy Color",
    group: "Nintendo",
    color: "#AE2896",
    icon: makeTextGlyph("GBC"),
    aliases: ["game boy color", "gameboy color", "gbc"],
  },
  {
    id: "gb",
    label: "Game Boy",
    group: "Nintendo",
    color: "#306230",
    icon: makeTextGlyph("GB"),
    aliases: ["game boy", "gameboy", "gb", "dmg"],
  },
  {
    id: "n3ds",
    label: "Nintendo 3DS",
    group: "Nintendo",
    color: "#CE181E",
    icon: makeTextGlyph("3DS"),
    aliases: ["nintendo 3ds", "3ds", "new 3ds", "citra"],
  },
  {
    id: "nds",
    label: "Nintendo DS",
    group: "Nintendo",
    color: "#C4161C",
    icon: makeTextGlyph("DS"),
    aliases: ["nintendo ds", "nds", "ds", "nintendo dsi", "dsi"],
  },
  {
    id: "nintendo",
    label: "Nintendo",
    group: "Nintendo",
    color: "#E60012",
    icon: DPadGlyph,
    aliases: ["nintendo"],
  },
  // ---------------- Sega ----------------
  {
    id: "genesis",
    label: "Sega Genesis / Mega Drive",
    group: "Sega",
    color: "#0072BC",
    icon: SiSega,
    aliases: ["sega genesis", "genesis", "mega drive", "megadrive", "sega mega drive", "md"],
  },
  {
    id: "saturn",
    label: "Sega Saturn",
    group: "Sega",
    color: "#26315F",
    icon: makeTextGlyph("SAT"),
    aliases: ["sega saturn", "saturn"],
  },
  {
    id: "dreamcast",
    label: "Dreamcast",
    group: "Sega",
    color: "#EB6E1F",
    icon: makeTextGlyph("DC"),
    aliases: ["dreamcast", "sega dreamcast"],
  },
  {
    id: "mastersystem",
    label: "Master System",
    group: "Sega",
    color: "#1D6FB8",
    icon: makeTextGlyph("SMS"),
    aliases: ["master system", "sega master system", "sms"],
  },
  {
    id: "gamegear",
    label: "Game Gear",
    group: "Sega",
    color: "#12A0D7",
    icon: makeTextGlyph("GG"),
    aliases: ["game gear", "gamegear"],
  },
  {
    id: "sega",
    label: "Sega",
    group: "Sega",
    color: "#0072BC",
    icon: SiSega,
    aliases: ["sega"],
  },
  // ---------------- Retro / Arcade ----------------
  {
    id: "atari",
    label: "Atari",
    group: "Retro",
    color: "#E01A22",
    icon: SiAtari,
    aliases: ["atari", "atari 2600", "2600", "atari 5200", "atari 7800", "atari lynx", "lynx", "atari jaguar", "jaguar"],
  },
  {
    id: "neogeo",
    label: "Neo Geo",
    group: "Retro",
    color: "#C8102E",
    icon: makeTextGlyph("NEO"),
    aliases: ["neo geo", "neogeo", "snk", "neo geo aes", "neo geo mvs"],
  },
  {
    id: "tg16",
    label: "TurboGrafx-16 / PC Engine",
    group: "Retro",
    color: "#F26522",
    icon: makeTextGlyph("TG16"),
    aliases: ["turbografx", "turbografx 16", "turbografx-16", "tg16", "pc engine", "pcengine", "turbo grafx"],
  },
  {
    id: "3do",
    label: "3DO",
    group: "Retro",
    color: "#58595B",
    icon: makeTextGlyph("3DO"),
    aliases: ["3do", "panasonic 3do"],
  },
  {
    id: "commodore",
    label: "Commodore / Amiga",
    group: "Retro",
    color: "#1F4E9B",
    icon: SiCommodore,
    aliases: ["commodore", "commodore 64", "c64", "amiga", "commodore amiga"],
  },
  {
    id: "dos",
    label: "MS-DOS",
    group: "Retro",
    color: "#111827",
    icon: makeTextGlyph("DOS"),
    aliases: ["dos", "ms-dos", "msdos", "dosbox"],
  },
  {
    id: "arcade",
    label: "Arcade",
    group: "Retro",
    color: "#F59E0B",
    icon: makeTextGlyph("ARC"),
    aliases: ["arcade", "mame", "fbneo", "final burn", "coin op", "coin-op", "neogeo mvs"],
  },
  {
    id: "retro",
    label: "Retro (generic)",
    group: "Retro",
    color: "#8B5CF6",
    icon: CartridgeGlyph,
    aliases: ["retro", "emulation", "emulated", "roms", "rom"],
  },
  // ---------------- PC & Stores ----------------
  {
    id: "steam",
    label: "Steam",
    group: "PC & Stores",
    color: "#1B2838",
    icon: FaSteam,
    aliases: ["steam", "valve"],
  },
  {
    id: "epic",
    label: "Epic Games",
    group: "PC & Stores",
    color: "#2F2D2E",
    icon: SiEpicgames,
    aliases: ["epic", "epic games", "epic games store", "egs"],
  },
  {
    id: "gog",
    label: "GOG",
    group: "PC & Stores",
    color: "#86328A",
    icon: SiGogdotcom,
    aliases: ["gog", "gog.com", "good old games"],
  },
  {
    id: "windows",
    label: "PC (Windows)",
    group: "PC & Stores",
    color: "#0078D6",
    icon: FaWindows,
    aliases: ["pc", "windows", "microsoft windows", "win", "non-steam"],
  },
  {
    id: "mac",
    label: "macOS",
    group: "PC & Stores",
    color: "#6E6E73",
    icon: FaApple,
    aliases: ["mac", "macos", "mac os", "osx", "apple mac"],
  },
  {
    id: "android",
    label: "Android",
    group: "Other",
    color: "#3DDC84",
    icon: SiAndroid,
    aliases: ["android"],
  },
  {
    id: "retroarch",
    label: "RetroArch",
    group: "Other",
    color: "#000000",
    icon: SiRetroarch,
    aliases: ["retroarch"],
  },
  {
    id: "gamepad",
    label: "Generic Console",
    group: "Other",
    color: "#4B5563",
    icon: FaGamepad,
    aliases: ["console", "emulator"],
  },
];

const byId = new Map(PLATFORMS.map((p) => [p.id, p]));

export function getPlatformById(id: string | undefined | null): Platform | null {
  if (!id) return null;
  return byId.get(id) ?? null;
}

interface NormName {
  spaced: string;
  tight: string;
}

function norm(s: string): NormName {
  const spaced = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  return { spaced, tight: spaced.replace(/ /g, "") };
}

/**
 * Match a collection name to the best platform. Scoring: an exact match beats a
 * whole-word phrase match, which beats a loose substring match; ties break on
 * the longer (more specific) alias. Returns null when nothing is confident.
 */
export function matchPlatform(name: string): Platform | null {
  const target = norm(name);
  if (!target.tight) return null;
  const paddedSpaced = ` ${target.spaced} `;
  let best: { platform: Platform; score: number } | null = null;

  for (const platform of PLATFORMS) {
    for (const alias of platform.aliases) {
      const a = norm(alias);
      if (!a.tight) continue;
      let score = 0;
      if (target.tight === a.tight || target.spaced === a.spaced) {
        score = 1000 + a.tight.length;
      } else if (paddedSpaced.includes(` ${a.spaced} `)) {
        score = 500 + a.tight.length;
      } else if (a.tight.length >= 4 && target.tight.includes(a.tight)) {
        score = 100 + a.tight.length;
      }
      if (score > 0 && (!best || score > best.score)) {
        best = { platform, score };
      }
    }
  }
  return best?.platform ?? null;
}

const GROUP_ORDER: PlatformGroup[] = [
  "Nintendo",
  "Sony",
  "Microsoft",
  "Sega",
  "Retro",
  "PC & Stores",
  "Other",
];

/** Platforms ordered by group then label — for the config dropdown. */
export const PLATFORMS_SORTED: Platform[] = [...PLATFORMS].sort((a, b) => {
  const ga = GROUP_ORDER.indexOf(a.group);
  const gb = GROUP_ORDER.indexOf(b.group);
  if (ga !== gb) return ga - gb;
  return a.label.localeCompare(b.label);
});
