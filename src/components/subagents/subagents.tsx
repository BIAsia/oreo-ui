import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";

export type SubagentStatus = "running" | "done" | "error";

export type SubagentProps = {
  name: React.ReactNode;
  /** Right-edge caption — model, role, duration. */
  meta?: React.ReactNode;
  status?: SubagentStatus;
  /** 0–100; the bar eases to it. Defaults to 100 when done. */
  progress?: number;
  className?: string;
};

const STATUS_ICON: Record<SubagentStatus, React.ReactNode> = {
  running: <Icon name="spinner" size="sm" weight="bold" className="animate-spin text-[var(--color-text-secondary)] motion-reduce:animate-none" />,
  done: <Icon name="check" size="sm" weight="bold" className="text-[var(--color-palette-mint-text)]" />,
  error: <Icon name="warning-circle" size="sm" weight="bold" className="text-[var(--color-status-error)]" />,
};

/** One delegated agent: status, name, meta, and an eased progress bar. */
export function Subagent({ name, meta, status = "running", progress, className }: SubagentProps) {
  const width = progress ?? (status === "running" ? 0 : 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col gap-2 rounded-xl px-3.5 py-2.5",
        "bg-[var(--color-bg-base)] ring-1 ring-inset ring-[var(--color-border-subtle)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-[13.5px]">
        <span className="grid size-4 shrink-0 place-items-center">{STATUS_ICON[status]}</span>
        <span className="min-w-0 flex-1 truncate text-[var(--color-text-primary)]">{name}</span>
        {meta != null && (
          <span className="shrink-0 font-mono text-[11px] tracking-tight text-[var(--color-text-disabled)]">{meta}</span>
        )}
      </div>
      <span className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-state-press)]">
        <span
          className={cn(
            "block h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none",
            status === "done" && "bg-[var(--color-palette-mint-text)]/70",
            status === "running" && "bg-[var(--color-bg-inverse)]/70",
            status === "error" && "bg-[var(--color-status-error)]/70",
          )}
          style={{ width: `${width}%` }}
        />
      </span>
    </motion.div>
  );
}

/**
 * Oreo UI Subagents — parallel delegated work as a stack of agent cards.
 * Complements Plan: Plan is one agent's checklist, Subagents is the fan-out.
 */
export function SubagentList({ className, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex w-full flex-col gap-2", className)} {...rest} />;
}
