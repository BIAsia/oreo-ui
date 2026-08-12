import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut, useHidden } from "@/lib/motion";
import { Icon } from "@/components/icon";

export type TerminalProps = {
  /** The command line, shown after the prompt glyph. */
  command: string;
  /** Still executing — spinner in the header, block caret after output. */
  running?: boolean;
  /** Exit status once done; non-zero renders in the error tone. */
  exitCode?: number;
  /** Output lines. */
  children?: React.ReactNode;
  className?: string;
};

/**
 * Oreo UI Terminal — a shell run in the transcript.
 *
 * Same ink surface as CodeBlock: prompt + command up top with a live status
 * (spinner ↔ exit code), dimmed output below, and a blinking caret while the
 * process runs.
 */
export function Terminal({ command, running = false, exitCode = 0, children, className }: TerminalProps) {
  const failed = !running && exitCode !== 0;
  const hidden = useHidden({ transform: "scale(0.9)" });
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl bg-[var(--color-code-bg)] font-mono text-[12px] text-[var(--color-code-fg)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 px-3.5 pt-3 pb-1.5">
        <span className="min-w-0 truncate">
          <span aria-hidden className="me-2 select-none text-[var(--color-code-fg)]/40">
            $
          </span>
          {command}
        </span>
        <span className="flex shrink-0 items-center gap-1 text-[11px] tracking-tight text-[var(--color-code-fg)]/40 tabular-nums">
          {running ? (
            <Icon name="spinner" size="sm" weight="bold" className="animate-spin motion-reduce:animate-none" />
          ) : failed ? (
            <span className="text-[var(--color-status-error)]">exit {exitCode}</span>
          ) : (
            <motion.span
              initial={hidden}
              animate={{ opacity: 1, transform: "scale(1)" }}
              transition={{ duration: 0.2, ease: easeOut }}
              className="flex items-center gap-1"
            >
              <Icon name="check" size="sm" weight="bold" className="text-[var(--color-palette-mint-text)]" />
              exit 0
            </motion.span>
          )}
        </span>
      </div>
      <div className="flex flex-col gap-1 overflow-x-auto px-3.5 pt-1 pb-3.5 whitespace-pre text-[var(--color-code-fg)]/55 [&>*:last-child]:text-[var(--color-code-fg)]/90">
        {children}
        {running && (
          <span
            aria-hidden
            className="inline-block h-3 w-1.5 animate-[oreo-caret_1s_steps(1)_infinite] rounded-[1px] bg-[var(--color-code-fg)]/70 motion-reduce:animate-none"
          />
        )}
      </div>
    </div>
  );
}

/** One output line with a fade-in entrance — for streamed logs. */
export function TerminalLine({ className, ...rest }: React.ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: easeOut }}
      className={cn("min-h-4", className)}
      {...rest}
    />
  );
}
