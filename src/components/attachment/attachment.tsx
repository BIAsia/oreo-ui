import * as React from "react";
import { motion } from "motion/react";
import { CircleNotch, File, X } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { attachment, type AttachmentVariants } from "./attachment.variants";

export type AttachmentProps = {
  name: string;
  /** Small caption under the name — "PDF · 1.2 MB". */
  meta?: React.ReactNode;
  /** Image URL — renders a thumbnail instead of the file square. */
  src?: string;
  /** Custom file-square icon; defaults to a file glyph. */
  icon?: React.ReactNode;
  /** When set, a floating × appears on hover. */
  onRemove?: () => void;
  /** Dim the chip under a spinner while the upload is in flight. */
  uploading?: boolean;
} & AttachmentVariants &
  Omit<React.ComponentPropsWithoutRef<"div">, "children">;

export function Attachment({
  name,
  meta,
  src,
  icon,
  onRemove,
  uploading = false,
  className,
  ...rest
}: AttachmentProps) {
  const slots = attachment({ uploading });
  return (
    <div className={cn(slots.root(), className)} {...rest}>
      <span className={slots.thumb()}>
        {src ? <img src={src} alt="" className={slots.image()} /> : (icon ?? <Icon icon={File} size="sm" />)}
        {uploading && (
          <span className={slots.spinner()}>
            <Icon icon={CircleNotch} size="sm" weight="bold" className="animate-spin motion-reduce:animate-none" />
          </span>
        )}
      </span>
      <span className={slots.info()}>
        <span className={slots.name()}>{name}</span>
        {meta != null && <span className={slots.meta()}>{meta}</span>}
      </span>
      {onRemove && (
        <motion.button
          type="button"
          aria-label={`Remove ${name}`}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.3 }}
          onClick={onRemove}
          className={slots.remove()}
        >
          <X weight="bold" className="size-3" />
        </motion.button>
      )}
    </div>
  );
}

/** Wrapping row for attachment chips — composer bar or message header. */
export function AttachmentList({ className, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex flex-wrap gap-2", className)} {...rest} />;
}
