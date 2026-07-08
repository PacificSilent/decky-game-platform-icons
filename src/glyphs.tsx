import { FC } from "react";

/**
 * Self-contained SVG glyphs used for platforms that react-icons does not ship
 * (most notably the whole Nintendo family, which was removed from Simple Icons
 * for trademark reasons). Every glyph is a single-colour silhouette that paints
 * with `currentColor`, so it tints cleanly whether the badge is drawn in the
 * platform brand colour or flat white.
 */

export type GlyphProps = {
  size?: number | string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
};

const svgBase = (
  props: GlyphProps,
): React.SVGProps<SVGSVGElement> & { viewBox: string } => ({
  width: props.size ?? "1em",
  height: props.size ?? "1em",
  viewBox: "0 0 24 24",
  fill: props.color ?? "currentColor",
  style: props.style,
  className: props.className,
  role: "img",
  "aria-hidden": true,
});

/** Nintendo Switch — the two Joy-Cons in silhouette, sticks cut out. */
export const SwitchGlyph: FC<GlyphProps> = (props) => (
  <svg {...svgBase(props)}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 2.5H6.5A3.5 3.5 0 0 0 3 6v12a3.5 3.5 0 0 0 3.5 3.5H9V2.5ZM6.4 6.6a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6ZM15 2.5h2.5A3.5 3.5 0 0 1 21 6v12a3.5 3.5 0 0 1-3.5 3.5H15V2.5Zm2.6 12.1a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z"
    />
  </svg>
);

/** A rounded D-pad cross — a generic stand-in for Nintendo / retro consoles. */
export const DPadGlyph: FC<GlyphProps> = (props) => (
  <svg {...svgBase(props)}>
    <path d="M9.5 3a1 1 0 0 0-1 1v4.5H4a1 1 0 0 0-1 1v4.9a1 1 0 0 0 1 1h4.5V20a1 1 0 0 0 1 1h4.9a1 1 0 0 0 1-1v-4.6H20a1 1 0 0 0 1-1V9.5a1 1 0 0 0-1-1h-4.6V4a1 1 0 0 0-1-1H9.5Z" />
  </svg>
);

/** A simple cartridge silhouette — generic retro cartridge-based systems. */
export const CartridgeGlyph: FC<GlyphProps> = (props) => (
  <svg {...svgBase(props)}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1V4a2 2 0 0 0-2-2H6Zm1.5 3h6v3h-6V5Z"
    />
  </svg>
);

/**
 * A text badge rendered as SVG so it scales identically to the icon glyphs and
 * inherits `currentColor`. Used for retro systems best identified by their
 * common abbreviation (NES, SNES, N64, GBA, ...). `textLength` forces the label
 * to fit the box no matter how many characters it has.
 */
export const makeTextGlyph = (label: string): FC<GlyphProps> => {
  const len = label.length;
  const fontSize = len <= 2 ? 12 : len === 3 ? 10 : len === 4 ? 8.5 : 7.5;
  const textLength = len <= 2 ? undefined : len === 3 ? 17 : len === 4 ? 20 : 21;
  const TextGlyph: FC<GlyphProps> = (props) => (
    <svg {...svgBase(props)}>
      <text
        x="12"
        y="12.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight={800}
        fill={props.color ?? "currentColor"}
        textLength={textLength}
        lengthAdjust="spacingAndGlyphs"
        style={{
          fontFamily:
            '"Motiva Sans", "Segoe UI", system-ui, -apple-system, sans-serif',
          letterSpacing: len <= 2 ? "0.5px" : "0px",
        }}
      >
        {label}
      </text>
    </svg>
  );
  return TextGlyph;
};
