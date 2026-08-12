import { tv } from "@/lib/tv";

/**
 * Oreo UI Reasoning.
 *
 * The "thinking" disclosure: a shimmered caption while reasoning streams,
 * swapping to a resting summary ("Thought for 8s"), with a step timeline
 * inside the panel. Same quiet text-weight header language as Tool Call.
 */
export const reasoning = tv({
  slots: {
    root: "w-full",
    trigger: [
      "group/trigger flex items-center gap-1.5 rounded-lg py-1 text-[13.5px]",
      "text-[var(--color-text-secondary)] outline-none",
      "transition-[color,scale] hover:text-[var(--color-text-primary)] active:scale-[0.98]",
      "focus-visible:ring-2 focus-visible:ring-black/40",
    ],
    elapsed: "font-mono text-[11px] tracking-tight text-[var(--color-text-disabled)] tabular-nums",
    chevron: [
      "size-3.5 shrink-0 opacity-60",
      "transition-transform duration-200 ease-drawer motion-reduce:transition-none",
      "group-data-[panel-open]/trigger:rotate-180",
    ],
    panel: [
      "h-[var(--collapsible-panel-height)] overflow-hidden",
      "transition-[height] duration-200 ease-drawer motion-reduce:transition-none",
      "data-[ending-style]:h-0 data-[starting-style]:h-0",
    ],
    list: "flex flex-col gap-4 pt-3 pb-1",
    step: "flex gap-3",
    dot: "mt-[7px] size-[5px] shrink-0 rounded-full transition-colors duration-300",
    stepTitle: "text-[13.5px] font-medium text-[var(--color-text-primary)]",
    stepBody: "mt-0.5 text-[13px] leading-relaxed text-[var(--color-text-secondary)]",
  },
  variants: {
    active: {
      true: { dot: "animate-pulse bg-[var(--color-text-primary)] motion-reduce:animate-none" },
      false: { dot: "bg-[var(--color-border-default)]" },
    },
  },
  defaultVariants: { active: false },
});

export type ReasoningVariants = Parameters<typeof reasoning>[0];
