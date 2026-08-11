import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { plan } from "./plan.variants";

export type PlanStepStatus = "done" | "active" | "pending";

export type PlanStepProps = {
  status?: PlanStepStatus;
  className?: string;
  children: React.ReactNode;
};

export function PlanStep({ status = "pending", className, children }: PlanStepProps) {
  const slots = plan({ status });
  return (
    <li className={cn(slots.step(), className)}>
      <span className={slots.stepIcon()}>
        {status === "done" ? (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid place-items-center"
          >
            <Icon name="check" size="sm" weight="bold" className="text-[var(--color-text-disabled)]" />
          </motion.span>
        ) : status === "active" ? (
          <Icon name="spinner" size="sm" weight="bold" className="animate-spin motion-reduce:animate-none" />
        ) : (
          <span aria-hidden className="size-1.5 rounded-full bg-[var(--color-border-default)]" />
        )}
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

export type PlanProps = {
  title?: React.ReactNode;
  /** PlanStep children — progress is derived from their status props. */
  children: React.ReactNode;
  className?: string;
};

export function Plan({ title = "Plan", className, children }: PlanProps) {
  const slots = plan();
  const steps = React.Children.toArray(children);
  const total = steps.length;
  const completed = steps.filter(
    (child) => React.isValidElement<PlanStepProps>(child) && child.props.status === "done",
  ).length;
  const progress = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className={cn(slots.root(), className)}>
      <div className={slots.header()}>
        <span className={slots.title()}>{title}</span>
        <span className={slots.fraction()}>
          {completed} of {total}
        </span>
      </div>
      <div className={slots.track()} role="progressbar" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={total}>
        <span className={slots.bar()} style={{ width: `${progress}%` }} />
      </div>
      <ul className={slots.list()}>{children}</ul>
    </div>
  );
}
