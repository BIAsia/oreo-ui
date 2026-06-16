import { tv } from "@/lib/tv";

/**
 * Oreo UI Avatar — always a circle. Sizes map to Figma's avatar scale
 * (24 / 32 / 48 / 64px); the font scales with the circle for the "alphabet"
 * (initials) type. Color/fill is decided per type in avatar.tsx.
 */
export const avatar = tv({
  base: [
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
    "rounded-full font-semibold uppercase select-none",
    "bg-[var(--color-bg-elevated)] text-[var(--color-text-on-inverse)]",
  ],
  variants: {
    size: {
      xs: "size-6 text-[10px]",
      sm: "size-8 text-[12px]",
      md: "size-12 text-[16px]",
      lg: "size-16 text-[22px]",
    },
  },
  defaultVariants: { size: "md" },
});

export type AvatarVariants = Parameters<typeof avatar>[0];
