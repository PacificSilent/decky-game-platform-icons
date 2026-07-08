// Behaviour test for the collection-name → platform auto-detection.
//
// It reads the real alias lists from src/platforms.tsx and runs the same
// scoring algorithm as matchPlatform(), then asserts a battery of realistic
// collection names map to the expected platform (and that unrelated names match
// nothing). Run with: node scripts/test-match.mjs  (also runs on `pnpm test`).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = fs.readFileSync(path.join(ROOT, "src/platforms.tsx"), "utf8");

// ---- read id + aliases from the real registry ----
const arrStart = src.indexOf("export const PLATFORMS: Platform[] = [");
const arrEnd = src.indexOf("\n];", arrStart);
const body = src.slice(arrStart, arrEnd);
const PLATFORMS = [];
const blockRe = /\{\s*id:\s*"([^"]+)",[\s\S]*?\},/g;
let m;
while ((m = blockRe.exec(body))) {
  const block = m[0];
  const id = block.match(/id:\s*"([^"]+)"/)[1];
  const aliasesRaw = (block.match(/aliases:\s*\[([\s\S]*?)\]/) || [])[1] || "";
  const aliases = [...aliasesRaw.matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  PLATFORMS.push({ id, aliases });
}

// ---- must mirror norm()/matchPlatform() in src/platforms.tsx ----
function norm(s) {
  const spaced = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  return { spaced, tight: spaced.replace(/ /g, "") };
}
function matchPlatform(name) {
  const target = norm(name);
  if (!target.tight) return null;
  const paddedSpaced = ` ${target.spaced} `;
  let best = null;
  for (const platform of PLATFORMS) {
    for (const alias of platform.aliases) {
      const a = norm(alias);
      if (!a.tight) continue;
      let score = 0;
      if (target.tight === a.tight || target.spaced === a.spaced) score = 1000 + a.tight.length;
      else if (paddedSpaced.includes(` ${a.spaced} `)) score = 500 + a.tight.length;
      else if (a.tight.length >= 4 && target.tight.includes(a.tight)) score = 100 + a.tight.length;
      if (score > 0 && (!best || score > best.score)) best = { id: platform.id, score };
    }
  }
  return best?.id ?? null;
}

const cases = [
  ["XBOX 360", "xbox360"], ["Xbox 360", "xbox360"], ["xbox360", "xbox360"],
  ["My Xbox 360 Games", "xbox360"], ["XBOX", "xbox"], ["Xbox One", "xboxone"],
  ["Xbox Series X", "xboxseries"], ["Switch", "switch"], ["Nintendo Switch", "switch"],
  ["Nintendo", "nintendo"], ["Super Nintendo", "snes"], ["SNES", "snes"],
  ["Super Famicom", "snes"], ["NES", "nes"], ["Famicom", "nes"],
  ["PS2", "ps2"], ["PlayStation 2", "ps2"], ["PlayStation", "ps1"], ["PS1", "ps1"],
  ["PS Vita", "psvita"], ["PSP", "psp"], ["PS5", "ps5"],
  ["PC Engine", "tg16"], ["TurboGrafx-16", "tg16"], ["Game Boy Advance", "gba"],
  ["GBA", "gba"], ["Game Boy", "gb"], ["Sega Genesis", "genesis"], ["Mega Drive", "genesis"],
  ["Dreamcast", "dreamcast"], ["Sega Saturn", "saturn"], ["Neo Geo", "neogeo"],
  ["Steam", "steam"], ["Epic Games", "epic"], ["GOG", "gog"], ["GOG.com", "gog"],
  ["PC", "windows"], ["PC Games", "windows"], ["Nintendo 64", "n64"], ["N64", "n64"],
  ["Wii", "wii"], ["Wii U", "wiiu"], ["GameCube", "gamecube"], ["Dolphin", "gamecube"],
  ["3DS", "n3ds"], ["Nintendo 3DS", "n3ds"], ["DS", "nds"], ["Retro", "retro"],
  ["Emulation", "retro"], ["Arcade", "arcade"], ["MAME", "arcade"], ["Atari 2600", "atari"],
  ["Commodore 64", "commodore"], ["Amiga", "commodore"], ["Android", "android"],
  ["RetroArch", "retroarch"], ["MS-DOS", "dos"], ["macOS", "mac"],
  // should NOT match anything:
  ["Topcat", null], ["Favorites", null], ["My Games", null], ["Best RPGs", null],
  ["Uncategorized", null], ["", null],
];

let pass = 0;
const failures = [];
for (const [input, expected] of cases) {
  const got = matchPlatform(input);
  if (got === expected) pass++;
  else failures.push(`  ✗ ${JSON.stringify(input)} → ${got} (expected ${expected})`);
}

if (failures.length) {
  console.error(`platform match: ${pass}/${cases.length} passed\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(`platform match: ${pass}/${cases.length} passed`);
