import * as React from "react";
import { cn } from "@/lib/cn";

export type DiffLineType = "add" | "remove" | "context";
export type DiffLine = { type: DiffLineType; content: string };

export type CodeDiffProps = {
  /** Filename shown in the header. */
  title: React.ReactNode;
  lines: readonly DiffLine[];
  className?: string;
};

const GUTTER: Record<DiffLineType, string> = { add: "+", remove: "−", context: "" };

const LINE_TONE: Record<DiffLineType, string> = {
  context: "text-[var(--color-text-secondary)]",
  add: "bg-[var(--color-palette-mint-bg)] text-[var(--color-palette-mint-text)]",
  remove:
    "bg-[color-mix(in_srgb,var(--color-status-error)_10%,transparent)] text-[var(--color-status-error)]",
};

/**
 * Oreo UI Code Diff — a proposed change as a compact unified diff.
 *
 * Light surface (unlike CodeBlock's ink) so add/remove tints read clearly;
 * the +N −N tally in the header is derived from the lines.
 */
export function CodeDiff({ title, lines, className }: CodeDiffProps) {
  const additions = lines.filter((l) => l.type === "add").length;
  const deletions = lines.filter((l) => l.type === "remove").length;

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl font-mono text-[12px]",
        "bg-[var(--color-bg-base)] ring-1 ring-inset ring-[var(--color-border-subtle)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 px-3.5 pt-2.5 pb-2">
        <span className="truncate text-[var(--color-text-primary)]">{title}</span>
        <span className="shrink-0 text-[11px] tracking-tight tabular-nums">
          <span className="text-[var(--color-palette-mint-text)]">+{additions}</span>{" "}
          <span className="text-[var(--color-status-error)]">−{deletions}</span>
        </span>
      </div>
      <div className="overflow-x-auto pb-1.5">
        {lines.map((line, i) => (
          <div key={i} className={cn("flex px-3.5 py-0.5 leading-relaxed whitespace-pre", LINE_TONE[line.type])}>
            <span aria-hidden className="w-4 shrink-0 select-none">
              {GUTTER[line.type]}
            </span>
            <span>{line.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
