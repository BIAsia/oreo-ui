import { tv } from "@/lib/tv";
import { paletteSurface } from "@/lib/palette";

/**
 * Oreo UI Tag — a small, colored label for metadata, filters, and categorized
 * attributes. Palette-driven (soft bg + matching text), tiny radius, dense
 * padding. Supports an optional leading icon and a trailing remove action.
 */
export const tag = tv({
  base: [
    "inline-flex items-center gap-[var(--space-x1)] align-middle",
    "rounded-[var(--radius-control-tiny)] font-medium leading-none whitespace-nowrap",
    "[&_svg]:size-3",
  ],
  variants: {
    color: paletteSurface,
    size: {
      sm: "h-5 px-1.5 text-[12px]",
      md: "h-6 px-2 text-[13px]",
    },
  },
  defaultVariants: { color: "default", size: "sm" },
});

export type TagVariants = Parameters<typeof tag>[0];
