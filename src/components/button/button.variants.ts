import { tv } from "@/lib/tv";

/**
 * Oreo UI Button.
 *
 * State model = Material-style "state layers": a full-bleed `::after` overlay
 * sits on top of the base background. Hover / press only change that overlay's
 * color (semi-transparent black on light fills, semi-transparent white on the
 * dark `primary` fill). This matches the Figma interaction tokens exactly.
 */
export const button = tv({
  base: [
    "relative isolate inline-flex items-center justify-center",
    "gap-[var(--space-x2)] px-[var(--space-x6)] py-[var(--space-x3)]",
    "rounded-[var(--radius-control)]",
    "font-medium text-[14px] leading-[20px] whitespace-nowrap select-none",
    "outline-none transition-[box-shadow,color] duration-150",
    "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-black/40",
    // the state layer
    "after:absolute after:inset-0 after:-z-10 after:rounded-[inherit]",
    "after:bg-transparent after:transition-colors after:duration-150",
    "disabled:pointer-events-none disabled:after:bg-transparent",
  ],
  variants: {
    type: {
      primary: [
        "bg-[var(--color-bg-inverse)] text-[var(--color-text-on-inverse)]",
        "hover:after:bg-[var(--color-state-hover-inverse)]",
        "active:after:bg-[var(--color-state-press-inverse)]",
      ],
      secondary: [
        "bg-[var(--color-bg-base)] text-[var(--color-text-primary)]",
        "ring-1 ring-inset ring-[var(--color-border-default)]",
        "hover:after:bg-[var(--color-state-hover)]",
        "active:after:bg-[var(--color-state-press)]",
      ],
      tertiary: [
        "bg-transparent text-[var(--color-text-secondary)]",
        "hover:after:bg-[var(--color-state-hover)]",
        "active:after:bg-[var(--color-state-press)]",
      ],
    },
    danger: { true: "", false: "" },
    disabled: {
      true: "text-[var(--color-text-disabled)]",
      false: "",
    },
  },
  compoundVariants: [
    // danger recolors the fill / text per type
    {
      type: "primary",
      danger: true,
      class: "bg-[var(--color-status-error)] text-white",
    },
    {
      type: "secondary",
      danger: true,
      class: "text-[var(--color-status-error)] ring-[color-mix(in_srgb,var(--color-status-error)_30%,transparent)]",
    },
    {
      type: "tertiary",
      danger: true,
      class: "text-[var(--color-status-error)]",
    },
    // disabled neutralizes fills
    {
      type: "primary",
      disabled: true,
      class: "bg-[color-mix(in_srgb,var(--color-bg-inverse)_12%,transparent)] text-[var(--color-text-disabled)]",
    },
    {
      type: "secondary",
      disabled: true,
      class: "bg-[var(--color-bg-elevated)] ring-[var(--color-border-subtle)]",
    },
    {
      type: "primary",
      danger: true,
      disabled: true,
      class: "bg-[color-mix(in_srgb,var(--color-status-error)_20%,transparent)] text-white/70",
    },
  ],
  defaultVariants: { type: "primary", danger: false, disabled: false },
});

export type ButtonVariants = Parameters<typeof button>[0];
