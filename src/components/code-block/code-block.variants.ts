import { tv } from "@/lib/tv";

/**
 * Oreo UI Code Block.
 *
 * A dark code surface in BOTH themes — `--color-code-*` tokens are
 * intentionally not re-skinned in dark mode, so code always reads the same.
 * The header is quiet: language/filename label left, actions right.
 */
export const codeBlock = tv({
  slots: {
    root: "overflow-hidden rounded-xl bg-[var(--color-code-bg)] text-[var(--color-code-fg)]",
    header:
      "flex h-9 items-center justify-between gap-2 border-b border-white/10 pl-3.5 pr-1.5",
    label:
      "truncate font-mono text-[11px] tracking-wider text-[var(--color-code-fg)]/50",
    body: "overflow-x-auto p-3.5 font-mono text-[12.5px] leading-[1.65]",
  },
  variants: {
    wrap: {
      true: { body: "whitespace-pre-wrap break-words" },
      false: { body: "" },
    },
  },
  defaultVariants: { wrap: false },
});

export type CodeBlockVariants = Parameters<typeof codeBlock>[0];
