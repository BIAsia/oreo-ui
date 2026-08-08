import * as React from "react";
import { Collapsible } from "@base-ui-components/react/collapsible";
import { AnimatePresence, motion } from "motion/react";
import { CaretRight, Check, WarningCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { ActivityLabel } from "@/components/activity-label";
import { toolCall, type ToolCallVariants } from "./tool-call.variants";

type Slots = ReturnType<typeof toolCall>;
const ToolCallContext = React.createContext<Slots | null>(null);

export type ToolCallProps = {
  /** Resting name — "Searched the web". */
  name: React.ReactNode;
  /** In-progress caption, shimmered while state="running". Defaults to name. */
  activeLabel?: React.ReactNode;
  /** Argument summary chip next to the label — a query, a file path. */
  badge?: React.ReactNode;
  state?: "running" | "complete" | "error";
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: React.ReactNode;
} & ToolCallVariants;

export function ToolCall({
  name,
  activeLabel,
  badge,
  state = "complete",
  defaultOpen,
  open,
  onOpenChange,
  className,
  children,
}: ToolCallProps) {
  const slots = toolCall({ state });
  const running = state === "running";

  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cn(slots.root(), className)}
    >
      <Collapsible.Trigger className={slots.trigger()}>
        <CaretRight weight="bold" aria-hidden className={slots.chevron()} />
        <ActivityLabel active={running} activeLabel={activeLabel ?? name} label={name} />
        {badge != null && <span className={slots.badge()}>{badge}</span>}
        <span className={slots.status()}>
          <AnimatePresence>
            {state === "complete" && (
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="grid place-items-center"
              >
                <Icon icon={Check} size="sm" weight="bold" className="text-[var(--color-palette-mint-text)]" />
              </motion.span>
            )}
            {state === "error" && (
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="grid place-items-center"
              >
                <Icon icon={WarningCircle} size="sm" weight="bold" className="text-[var(--color-status-error)]" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </Collapsible.Trigger>
      {children != null && (
        <Collapsible.Panel className={slots.panel()}>
          <ToolCallContext.Provider value={slots}>
            <div className={slots.body()}>{interleaveDividers(children, slots)}</div>
          </ToolCallContext.Provider>
        </Collapsible.Panel>
      )}
    </Collapsible.Root>
  );
}

function interleaveDividers(children: React.ReactNode, slots: Slots) {
  const items = React.Children.toArray(children);
  return items.flatMap((child, i) =>
    i === 0 ? [child] : [<div key={`divider-${i}`} aria-hidden className={slots.divider()} />, child],
  );
}

export type ToolCallRowProps = {
  label: React.ReactNode;
  /** Render the content in mono — for raw arguments and payloads. */
  mono?: boolean;
} & React.ComponentPropsWithoutRef<"div">;

export function ToolCallRow({ label, mono, className, children, ...rest }: ToolCallRowProps) {
  const slots = React.useContext(ToolCallContext);
  if (!slots) throw new Error("<ToolCallRow> must be used inside <ToolCall>");
  return (
    <div className={cn(slots.row(), className)} {...rest}>
      <p className={slots.rowLabel()}>{label}</p>
      <div className={cn(mono && "font-mono text-[12px] text-[var(--color-text-secondary)]")}>{children}</div>
    </div>
  );
}
