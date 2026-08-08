import * as React from "react";
import { Collapsible } from "@base-ui-components/react/collapsible";
import { motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { ActivityLabel } from "@/components/activity-label";
import { reasoning } from "./reasoning.variants";

const ReasoningContext = React.createContext<{ streaming: boolean } | null>(null);

export type ReasoningProps = {
  /** True while thoughts are still streaming — shimmers the caption. */
  streaming?: boolean;
  /** In-progress caption. */
  activeLabel?: React.ReactNode;
  /** Resting summary — "Thought for 8 seconds". */
  label?: React.ReactNode;
  /** Timer text shown next to the in-progress caption. */
  elapsed?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: React.ReactNode;
};

export function Reasoning({
  streaming = false,
  activeLabel = "Thinking",
  label = "Thought process",
  elapsed,
  defaultOpen,
  open,
  onOpenChange,
  className,
  children,
}: ReasoningProps) {
  const slots = reasoning();
  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cn(slots.root(), className)}
    >
      <Collapsible.Trigger className={slots.trigger()}>
        <ActivityLabel
          active={streaming}
          activeLabel={
            <>
              {activeLabel}
              {elapsed !== undefined && <span className={slots.elapsed()}>{elapsed}</span>}
            </>
          }
          label={label}
        />
        <CaretDown weight="bold" aria-hidden className={slots.chevron()} />
      </Collapsible.Trigger>
      <Collapsible.Panel className={slots.panel()}>
        <ReasoningContext.Provider value={{ streaming }}>
          <ol className={slots.list()}>{children}</ol>
        </ReasoningContext.Provider>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

export type ReasoningStepProps = {
  title: React.ReactNode;
  /** Highlight as the step currently being thought through. */
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function ReasoningStep({ title, active = false, className, children }: ReasoningStepProps) {
  const ctx = React.useContext(ReasoningContext);
  if (!ctx) throw new Error("<ReasoningStep> must be used inside <Reasoning>");
  const slots = reasoning({ active });
  return (
    <motion.li
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(slots.step(), className)}
    >
      <span aria-hidden className={slots.dot()} />
      <span className="flex min-w-0 flex-col">
        <p className={slots.stepTitle()}>{title}</p>
        {children != null && <p className={slots.stepBody()}>{children}</p>}
      </span>
    </motion.li>
  );
}
