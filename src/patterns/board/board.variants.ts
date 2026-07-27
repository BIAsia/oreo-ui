import { tv } from "@/lib/tv";

/**
 * Onboarding board styles — same `tv()` + token approach as the Oreo
 * components, so the board re-skins for dark mode with zero extra work.
 */
export const column = tv({
  base: [
    "flex w-72 shrink-0 flex-col rounded-2xl",
    "border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]",
    "transition-colors duration-150",
  ],
  variants: {
    over: { true: "border-[var(--color-border-default)] bg-[var(--color-state-hover)]", false: "" },
  },
  defaultVariants: { over: false },
});

export const card = tv({
  base: [
    "group/card relative rounded-xl bg-[var(--color-bg-base)] p-3 text-left",
    "border border-[var(--color-border-subtle)]",
    "transition-shadow duration-150 hover:border-[var(--color-border-default)]",
  ],
  variants: {
    // Lifted clone shown in the DragOverlay.
    overlay: { true: "shadow-[var(--shadow-panel)] cursor-grabbing", false: "" },
    // Source card while its clone is being dragged.
    ghost: { true: "opacity-40", false: "" },
  },
  defaultVariants: { overlay: false, ghost: false },
});
