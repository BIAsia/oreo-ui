import { tv } from "@/lib/tv";

/**
 * Oreo UI Reasoning.
 *
 * One line of agent activity: a leading glyph, a label that shimmers while the
 * work runs, and an optional disclosure holding what was thought or touched.
 * The same row narrates thinking ("Thought for 6s") and doing ("Edited files
 * +106 -0") — only the glyph and the title parts change.
 *
 * Two surfaces. Bare, it's a text-weight line in the transcript with a hairline
 * rail under it. `container` puts it on its own card, trailing a spinner while
 * it runs and the elapsed time once it's done.
 */
export const reasoning = tv({
  slots: {
    /* Hover swaps the glyph for a chevron and the elapsed time for the actions,
       so the whole component — not just the trigger — is the hover group: the
       trailing actions are siblings of the trigger (a button can't nest
       buttons), and on the card variant the body is most of what you point at. */
    root: "group/row w-full",
    header: "flex w-full items-center",
    trigger: [
      "group/trigger flex min-w-0 flex-1 items-center rounded-[var(--radius-control)]",
      "text-start outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)]/40",
    ],
    /* Both glyphs occupy the same cell and cross-fade — swapping them in flow
       would shift the title by however much their widths differ. */
    iconFrame: "grid shrink-0 place-items-center text-[var(--color-text-tertiary)]",
    /* `rotate`, not `transform`: Tailwind v4 emits `rotate-90` as the standalone
       `rotate` property, and a transition list naming `transform` would let the
       chevron's quarter-turn snap while its cross-fade animated. */
    glyph: [
      "col-start-1 row-start-1 size-4",
      "transition-[opacity,rotate] duration-200 ease-out motion-reduce:transition-none",
    ],
    brain: "opacity-100 group-hover/row:opacity-0 group-data-[panel-open]/trigger:opacity-0",
    chevron: [
      "opacity-0 group-hover/row:opacity-100 group-data-[panel-open]/trigger:opacity-100",
      "group-data-[panel-open]/trigger:rotate-90",
    ],
    title: "flex min-w-0 items-center gap-[var(--space-x2)] text-[14px] leading-5 font-medium",
    label: "text-[var(--color-text-secondary)]",
    file: "truncate text-[var(--color-text-primary)]",
    additions: "shrink-0 text-[var(--color-status-success)] tabular-nums",
    deletions: "shrink-0 text-[var(--color-status-error)] tabular-nums",
    /* Grid-stacked so the row reserves the wider of the two up front: the
       actions must not shove the title sideways on hover. */
    trailing: "grid shrink-0 items-center justify-items-end",
    trailingLayer: [
      "col-start-1 row-start-1 flex items-center",
      "transition-opacity duration-200 ease-out motion-reduce:transition-none",
    ],
    spinner: "size-4 animate-[spin_0.8s_steps(8)_infinite] text-[var(--color-text-waiting)] motion-reduce:animate-none",
    elapsed: "text-[12px] leading-4 text-[var(--color-text-disabled)] tabular-nums",
    actions: "flex items-center gap-[var(--space-x2)]",
    panel: [
      "h-[var(--collapsible-panel-height)] overflow-hidden",
      "transition-[height] duration-300 ease-drawer motion-reduce:transition-none",
      "data-[ending-style]:h-0 data-[starting-style]:h-0",
    ],
    /* Bare variant only: a 20px gutter whose hairline lines up with the centre
       of the glyph above it, so the thought hangs off the row that opened it. */
    bodyRow: "",
    rail: "relative w-5 shrink-0 self-stretch",
    railLine: "absolute inset-y-0 left-1/2 w-[0.5px] -translate-x-1/2 origin-top bg-[var(--color-border-subtle)]",
    body: "min-w-0 flex-1 text-[var(--color-text-tertiary)] [&_p+p]:mt-3",
    fileToken: "underline decoration-[var(--color-border-default)] underline-offset-2",
  },
  variants: {
    container: {
      false: {
        header: "gap-[var(--space-x1)]",
        trigger: "gap-[var(--space-x1)] py-0.5",
        iconFrame: "size-5",
        bodyRow: "flex min-h-[10px] gap-[var(--space-x1)] pt-[var(--space-x2)]",
        body: "py-[var(--space-x2)] text-[12px] leading-4",
      },
      true: {
        root: [
          "overflow-hidden rounded-[var(--radius-card-small)] bg-[var(--color-bg-base)]",
          "border-[0.5px] border-[var(--color-border-default)] shadow-[var(--shadow-default)]",
        ],
        header: "gap-[var(--space-x3)] p-[var(--space-x6)]",
        trigger: "gap-[var(--space-x3)]",
        iconFrame: "size-4",
        bodyRow: "border-t-[0.5px] border-[var(--color-border-default)] p-[var(--space-x6)]",
        body: "text-[14px] leading-5",
      },
    },
  },
  defaultVariants: { container: false },
});

export type ReasoningVariants = Parameters<typeof reasoning>[0];
