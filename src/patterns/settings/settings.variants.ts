import { tv } from "@/lib/tv";

/**
 * Settings pattern surfaces. Colors come exclusively from the `--settings-*`
 * layer (see settings.css) so scheme changes are a data-attribute swap, and
 * every surface transitions its colors so live axis switches glide instead of
 * snapping.
 */
export const settingsShell = tv({
  slots: {
    root: [
      "oreo-settings relative flex h-full w-full overflow-hidden",
      "bg-[var(--settings-canvas)] text-[var(--color-text-primary)]",
      "transition-colors duration-200 ease-out",
    ],
    nav: [
      "flex h-full w-[236px] shrink-0 flex-col bg-[var(--settings-nav-bg)]",
      "transition-colors duration-200 ease-out",
    ],
    content: [
      "relative min-w-0 flex-1 overflow-y-auto bg-[var(--settings-content-bg)]",
      "transition-[background-color,border-color] duration-200 ease-out",
    ],
    column: "mx-auto w-full max-w-[760px] px-8 pb-10 pt-12",
  },
  variants: {
    scheme: {
      "sunken-nav": { nav: "border-r-[0.5px] border-[var(--settings-hairline)]" },
      "sunken-content": { nav: "border-r-[0.5px] border-[var(--settings-hairline)]" },
      "card-panel": {
        content: [
          "my-3 mr-3 rounded-[var(--radius-card-medium)]",
          "border border-[var(--settings-hairline)] shadow-[var(--shadow-default)]",
        ],
      },
      drawer: {},
    },
  },
  defaultVariants: { scheme: "sunken-nav" },
});

/** The section container under a heading — the axis-C surface. */
export const settingsCard = tv({
  base: "oreo-squircle border-[0.5px] border-transparent transition-[background-color,border-color,box-shadow] duration-200 ease-out",
  variants: {
    card: {
      outline: [
        "rounded-[var(--radius-card-medium)] border-[var(--color-border-default)] px-4",
        "bg-[var(--settings-card-bg)] shadow-[var(--shadow-default)]",
      ],
      surface: "rounded-[var(--radius-card-medium)] bg-[var(--settings-raised-bg)] px-4",
      divider: "",
    },
  },
  defaultVariants: { card: "outline" },
});
