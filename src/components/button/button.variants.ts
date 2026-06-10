import { tv } from "@/lib/tv";
import { surfaceBase, typeVariants, dangerCompounds, disabledCompounds } from "./surface";

/**
 * Oreo UI Button.
 *
 * Composes the shared button surface (type palettes + state layers, see
 * `surface.ts`) with text-specific layout: gap, padding, and a size scale.
 * `md` (32px tall) matches Oreo's control height.
 */
export const button = tv({
  base: [
    ...surfaceBase,
    "gap-[var(--space-x2)] rounded-[var(--radius-control)]",
    "font-medium leading-[20px] whitespace-nowrap",
  ],
  variants: {
    type: typeVariants,
    size: {
      sm: "h-7 px-2.5 text-[13px]",
      md: "h-8 px-3 text-[14px]",
      lg: "h-10 px-4 text-[15px]",
    },
    danger: { true: "", false: "" },
    disabled: { true: "text-[var(--color-text-disabled)]", false: "" },
  },
  compoundVariants: [...dangerCompounds, ...disabledCompounds],
  defaultVariants: { type: "primary", size: "md", danger: false, disabled: false },
});

export type ButtonVariants = Parameters<typeof button>[0];
