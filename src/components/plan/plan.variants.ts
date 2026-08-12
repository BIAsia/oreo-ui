import { tv } from "@/lib/tv";

/**
 * Oreo UI Plan.
 *
 * The agent's task list: header with progress fraction, a thin animated
 * progress bar, and a step list with done / active / pending states.
 * Progress is derived from the steps — no separate counters to keep in sync.
 */
export const plan = tv({
  slots: {
    root: "flex w-full flex-col gap-3",
    header: "flex items-center justify-between",
    title: "text-[13.5px] font-medium text-[var(--color-text-primary)]",
    fraction: "font-mono text-[11px] tracking-tight text-[var(--color-text-disabled)] tabular-nums",
    track: "h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-state-press)]",
    // Progress advances via scaleX, not width: transform stays on the compositor
    // and never triggers layout. Eased, because the bar jumps between discrete
    // fractions as steps land — that's a state change, not constant motion.
    bar: "block h-full w-full origin-left rounded-full bg-[var(--color-bg-inverse)] transition-transform duration-300 ease-out motion-reduce:transition-none",
    list: "flex flex-col gap-2.5",
    step: "flex items-center gap-2.5 text-[13.5px]",
    stepIcon: "flex size-4 shrink-0 items-center justify-center",
  },
  variants: {
    status: {
      done: { step: "text-[var(--color-text-disabled)]" },
      active: { step: "text-[var(--color-text-primary)]" },
      pending: { step: "text-[var(--color-text-secondary)]" },
    },
  },
  defaultVariants: { status: "pending" },
});

export type PlanVariants = Parameters<typeof plan>[0];
