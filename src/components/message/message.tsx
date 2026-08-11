import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useCopy } from "@/lib/use-copy";
import { Icon } from "@/components/icon";
import { IconButton, type IconButtonProps } from "@/components/button";
import { message, type MessageVariants } from "./message.variants";

type Slots = ReturnType<typeof message>;
const MessageContext = React.createContext<Slots | null>(null);

function useMessageSlots(part: string): Slots {
  const slots = React.useContext(MessageContext);
  if (!slots) throw new Error(`<${part}> must be used inside <Message>`);
  return slots;
}

export type MessageProps = {
  role: "user" | "assistant";
  /** Leading avatar column — typically the Oreo Avatar. */
  avatar?: React.ReactNode;
} & MessageVariants &
  React.ComponentPropsWithoutRef<"div">;

export function Message({ role, variant, avatar, className, children, ...rest }: MessageProps) {
  const slots = message({ role, variant });
  return (
    <div className={cn(slots.root(), className)} {...rest}>
      {avatar && <div className="shrink-0 pt-0.5">{avatar}</div>}
      <MessageContext.Provider value={slots}>
        <div className={slots.body()}>{children}</div>
      </MessageContext.Provider>
    </div>
  );
}

export function MessageContent({ className, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  const slots = useMessageSlots("MessageContent");
  return <div className={cn(slots.content(), className)} {...rest} />;
}

export function MessageActions({ className, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  const slots = useMessageSlots("MessageActions");
  return <div className={cn(slots.actions(), className)} {...rest} />;
}

/** Ghost icon action sized for the hover-revealed row. */
export function MessageAction(props: IconButtonProps) {
  return <IconButton type="tertiary" size="sm" shape="rectangle" {...props} />;
}

export type MessageCopyActionProps = {
  text: string;
  "aria-label"?: string;
  className?: string;
} & Pick<IconButtonProps, "size" | "type" | "shape">;

/** Copy-the-turn action with the copy → check swap. */
export function MessageCopyAction({
  text,
  "aria-label": ariaLabel = "Copy message",
  ...rest
}: MessageCopyActionProps) {
  const { copied, copy } = useCopy();
  return (
    <MessageAction
      {...rest}
      aria-label={ariaLabel}
      onClick={() => copy(text)}
      icon={
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "check" : "copy"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="grid place-items-center"
          >
            <Icon name={copied ? "check" : "copy"} weight={copied ? "bold" : "regular"} />
          </motion.span>
        </AnimatePresence>
      }
    />
  );
}
