import type { ComponentType, SVGProps } from "react";

/** Icon sets Oreo can render. Swappable at runtime via `IconLibraryProvider`. */
export type IconLibrary = "phosphor" | "lucide";

/**
 * Semantic weight scale, borrowed from Phosphor's vocabulary because it reads
 * as design intent rather than as an implementation detail. Lucide has no
 * weights, so `Icon` translates these into `strokeWidth` — see `LUCIDE_STROKE`.
 */
export type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";

/**
 * The shape both libraries' components satisfy. Phosphor takes `weight`,
 * Lucide takes `strokeWidth` (already part of `SVGProps`); each ignores the
 * other's prop, so `Icon` only ever passes the one its active library uses.
 */
export type IconGlyph = ComponentType<SVGProps<SVGSVGElement> & { weight?: IconWeight }>;
