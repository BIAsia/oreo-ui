/**
 * Oreo UI palette — the soft bg + readable text pairs shared by Tag and the
 * Avatar "alphabet" type. Names map 1:1 to the `--color-palette-*` tokens, so
 * theming happens entirely in CSS (see index.css).
 */
export const PALETTE = ["default", "mint", "pink", "blue", "purple", "orange", "brown"] as const;
export type PaletteColor = (typeof PALETTE)[number];

/** bg + text classes for a palette color (soft surface). */
export const paletteSurface: Record<PaletteColor, string> = {
  default: "bg-[var(--color-palette-default-bg)] text-[var(--color-palette-default-text)]",
  mint: "bg-[var(--color-palette-mint-bg)] text-[var(--color-palette-mint-text)]",
  pink: "bg-[var(--color-palette-pink-bg)] text-[var(--color-palette-pink-text)]",
  blue: "bg-[var(--color-palette-blue-bg)] text-[var(--color-palette-blue-text)]",
  purple: "bg-[var(--color-palette-purple-bg)] text-[var(--color-palette-purple-text)]",
  orange: "bg-[var(--color-palette-orange-bg)] text-[var(--color-palette-orange-text)]",
  brown: "bg-[var(--color-palette-brown-bg)] text-[var(--color-palette-brown-text)]",
};
