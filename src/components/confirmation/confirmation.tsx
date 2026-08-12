import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";
import { confirmation } from "./confirmation.variants";

export type ConfirmationState = "pending" | "approved" | "denied";

export type ConfirmationProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Detail slot — a CodeBlock, diff, or payload preview. */
  children?: React.ReactNode;
  state?: ConfirmationState;
  /** Style the approve action as destructive. */
  danger?: boolean;
  approveLabel?: React.ReactNode;
  denyLabel?: React.ReactNode;
  onApprove?: () => void;
  onDeny?: () => void;
  /** Resolution captions. */
  approvedLabel?: React.ReactNode;
  deniedLabel?: React.ReactNode;
  className?: string;
};

export function Confirmation({
  title,
  description,
  children,
  state = "pending",
  danger = false,
  approveLabel = "Approve",
  denyLabel = "Deny",
  onApprove,
  onDeny,
  approvedLabel = "Approved",
  deniedLabel = "Denied",
  className,
}: ConfirmationProps) {
  const slots = confirmation({ state });
  return (
    <div className={cn(slots.root(), className)}>
      <div className={slots.body()}>
        <p className={slots.title()}>{title}</p>
        {description != null && <p className={slots.description()}>{description}</p>}
      </div>
      {children != null && <div className={slots.detail()}>{children}</div>}
      <div className={slots.footer()}>
        <AnimatePresence mode="wait" initial={false}>
          {state === "pending" ? (
            <motion.div
              key="actions"
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: easeOut }}
              className="flex items-center gap-2"
            >
              <Button type="secondary" size="sm" onClick={onDeny}>
                {denyLabel}
              </Button>
              <Button type="primary" size="sm" danger={danger} onClick={onApprove}>
                {approveLabel}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="resolution"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: easeOut }}
              className={slots.resolution()}
            >
              {state === "approved" ? (
                <>
                  <Icon name="check" size="sm" weight="bold" />
                  <span>{approvedLabel}</span>
                </>
              ) : (
                <>
                  <Icon name="prohibit" size="sm" weight="bold" />
                  <span>{deniedLabel}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
