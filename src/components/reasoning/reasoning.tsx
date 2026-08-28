import * as React from "react";
import { Collapsible } from "@base-ui-components/react/collapsible";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useRevealUnit } from "@/lib/motion";
import { useRevealTicker } from "@/lib/use-reveal";
import { ActivityLabel } from "@/components/activity-label";
import { SpinnerDots } from "@/components/attachment";
import { Icon, type IconName } from "@/components/icon";
import { reasoning, type ReasoningVariants } from "./reasoning.variants";

export type ReasoningProps = {
  /** `running` shimmers the label and spins the trailing indicator. */
  status?: "running" | "finished";
  /** Leading glyph at rest — `brain` for thinking, `pencil` for editing. */
  icon?: IconName;
  /** Resting summary — "Thought for 6s", "Edited files". */
  label?: React.ReactNode;
  /** In-progress caption, shimmered. Defaults to `label`. */
  activeLabel?: React.ReactNode;
  /** The thing being worked on — a file path, a query. Rendered after the label. */
  file?: React.ReactNode;
  /** Diff counts, shown alongside the file. */
  additions?: number;
  deletions?: number;
  /** `container` only: trailing time once finished. */
  elapsed?: React.ReactNode;
  /** `container` only: revealed on hover in place of the elapsed time. */
  actions?: React.ReactNode;
  /** Put the row on its own card. */
  container?: boolean;
  /** Close the disclosure the moment the work finishes. Uncontrolled only. */
  collapseOnComplete?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: React.ReactNode;
} & ReasoningVariants;

export function Reasoning({
  status = "finished",
  icon = "brain",
  label = "Thought process",
  activeLabel,
  file,
  additions,
  deletions,
  elapsed,
  actions,
  container = false,
  collapseOnComplete = false,
  defaultOpen,
  open,
  onOpenChange,
  className,
  children,
}: ReasoningProps) {
  const slots = reasoning({ container });
  const running = status === "running";

  // Uncontrolled disclosures still need a handle for `collapseOnComplete`, so
  // the open state lives here and `open` (when passed) simply wins.
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen ?? false);
  const isOpen = open ?? innerOpen;
  const setOpen = (next: boolean) => {
    setInnerOpen(next);
    onOpenChange?.(next);
  };

  const wasRunning = React.useRef(running);
  React.useEffect(() => {
    if (wasRunning.current && !running && collapseOnComplete) setInnerOpen(false);
    wasRunning.current = running;
  }, [running, collapseOnComplete]);

  const hasBody = children != null;
  const showTrailing = container && (running || elapsed != null || actions != null);

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setOpen} className={cn(slots.root(), className)}>
      <div className={slots.header()}>
        <Collapsible.Trigger className={slots.trigger()} disabled={!hasBody}>
          <span className={slots.iconFrame()}>
            {/* No body means nothing to disclose — the glyph stays put rather
                than promising a chevron that opens onto nothing. */}
            <Icon name={icon} aria-hidden className={cn(slots.glyph(), hasBody && slots.brain())} />
            {hasBody && (
              <Icon
                name="chevron-right"
                weight="bold"
                aria-hidden
                className={cn(slots.glyph(), slots.chevron())}
              />
            )}
          </span>
          <span className={slots.title()}>
            <ActivityLabel
              active={running}
              activeLabel={activeLabel ?? label}
              label={label}
              className={slots.label()}
            />
            {file != null && <span className={slots.file()}>{file}</span>}
            {additions != null && <span className={slots.additions()}>+{additions}</span>}
            {deletions != null && <span className={slots.deletions()}>-{deletions}</span>}
          </span>
        </Collapsible.Trigger>
        {showTrailing && (
          <span className={slots.trailing()}>
            <span
              className={cn(
                slots.trailingLayer(),
                actions != null && "group-hover/row:opacity-0 group-focus-within/row:opacity-0",
              )}
            >
              {running ? <SpinnerDots className={slots.spinner()} /> : <span className={slots.elapsed()}>{elapsed}</span>}
            </span>
            {actions != null && (
              <span
                className={cn(
                  slots.trailingLayer(),
                  slots.actions(),
                  "pointer-events-none opacity-0",
                  "group-hover/row:pointer-events-auto group-hover/row:opacity-100",
                  "group-focus-within/row:pointer-events-auto group-focus-within/row:opacity-100",
                )}
              >
                {actions}
              </span>
            )}
          </span>
        )}
      </div>
      {hasBody && (
        <Collapsible.Panel className={slots.panel()}>
          <div className={slots.bodyRow()}>
            {!container && (
              <span aria-hidden className={slots.rail()}>
                {/* Drawn rather than just present: the rule grows down from the
                    glyph as the panel opens, so it reads as an extension of the
                    row instead of a line that was always there. */}
                <motion.span
                  initial={{ transform: "scaleY(0)" }}
                  animate={{ transform: "scaleY(1)" }}
                  transition={{ duration: 0.16, ease: "linear" }}
                  className={slots.railLine()}
                />
              </span>
            )}
            <div className={slots.body()}>{children}</div>
          </div>
        </Collapsible.Panel>
      )}
    </Collapsible.Root>
  );
}

/** A file path inside reasoning prose — underlined, not a link. */
export function ReasoningFile({ className, children, ...rest }: React.ComponentPropsWithoutRef<"span">) {
  const slots = reasoning();
  return (
    <span className={cn(slots.fileToken(), className)} {...rest}>
      {children}
    </span>
  );
}

export type ReasoningGroupProps = {
  /**
   * Reveal the rows one at a time instead of all at once — the streaming log
   * treatment. Ignored when `revealed` is passed, which implies it.
   */
  stream?: boolean;
  /** Drive the reveal from real events; switches the internal ticker off. */
  revealed?: number;
  /** Gap between rows after the first. */
  stepInterval?: number;
  /** Holds the first row back so it doesn't land with the user's turn. */
  startDelay?: number;
  /** Fires once, when the last row has landed. */
  onComplete?: () => void;
  className?: string;
  children?: React.ReactNode;
};

/**
 * A run's worth of activity as one block — thinking, then editing, then the
 * summary. Streaming reveals a row at a time so the log grows the way the work
 * does; without it the group is just a stack and renders whole.
 */
export function ReasoningGroup({
  stream = false,
  revealed,
  stepInterval,
  startDelay,
  onComplete,
  className,
  children,
}: ReasoningGroupProps) {
  const rows = React.Children.toArray(children);
  const streaming = stream || revealed !== undefined;
  const { revealed: count } = useRevealTicker({
    total: rows.length,
    run: streaming,
    revealed,
    stepInterval,
    startDelay,
    onComplete,
  });

  return (
    <div className={cn("flex w-full flex-col gap-[var(--space-x4)]", className)}>
      {rows.map((row, i) => {
        if (!streaming) return row;
        if (i >= count) return null;
        const key = React.isValidElement(row) ? row.key : i;
        return <RevealedRow key={key}>{row}</RevealedRow>;
      })}
    </div>
  );
}

/** One row arriving: grows its own height behind a soft bottom edge. */
function RevealedRow({ children }: { children: React.ReactNode }) {
  const reveal = useRevealUnit();
  return <motion.div {...reveal}>{children}</motion.div>;
}
