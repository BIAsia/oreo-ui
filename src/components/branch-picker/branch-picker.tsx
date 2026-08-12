import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/button";

export type BranchPickerProps = {
  /** 1-based index of the branch being shown. */
  current: number;
  total: number;
  onPrevious?: () => void;
  onNext?: () => void;
  className?: string;
};

/**
 * Oreo UI Branch Picker — pager for regenerated message branches.
 * Sits in the message action row; the counter slides as you page.
 */
export function BranchPicker({ current, total, onPrevious, onNext, className }: BranchPickerProps) {
  const direction = React.useRef(1);
  return (
    <div className={cn("flex items-center gap-0.5 text-[var(--color-text-secondary)]", className)}>
      <IconButton
        type="tertiary"
        size="sm"
        shape="rectangle"
        aria-label="Previous branch"
        disabled={current <= 1}
        onClick={() => {
          direction.current = -1;
          onPrevious?.();
        }}
        icon={<Icon name="chevron-left" weight="bold" />}
      />
      <span className="flex items-center gap-0.5 font-mono text-[11px] tracking-tight tabular-nums" aria-live="polite">
        <span className="grid overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={current}
              initial={{ y: direction.current * 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: direction.current * -10, opacity: 0 }}
              transition={{ duration: 0.15, ease: easeOut }}
            >
              {current}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="text-[var(--color-text-disabled)]">/ {total}</span>
      </span>
      <IconButton
        type="tertiary"
        size="sm"
        shape="rectangle"
        aria-label="Next branch"
        disabled={current >= total}
        onClick={() => {
          direction.current = 1;
          onNext?.();
        }}
        icon={<Icon name="chevron-right" weight="bold" />}
      />
    </div>
  );
}
