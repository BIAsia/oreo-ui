import { tv } from "@/lib/tv";

/**
 * Oreo UI Attachment.
 *
 * A file chip for composers and messages: image thumb or file-type square,
 * name + meta, and a floating remove button that appears on hover. Uploading
 * dims the thumb under a spinner.
 */
export const attachment = tv({
  slots: {
    root: [
      "group/attachment relative flex w-fit max-w-60 items-center gap-2.5 rounded-xl p-2 pe-3",
      "bg-[var(--color-bg-base)] ring-1 ring-inset ring-[var(--color-border-subtle)]",
    ],
    thumb: [
      "relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg",
      "bg-[var(--color-state-press)] text-[var(--color-text-secondary)]",
    ],
    image: "size-full object-cover",
    info: "flex min-w-0 flex-col",
    name: "truncate text-[13px] font-medium text-[var(--color-text-primary)]",
    meta: "truncate font-mono text-[10.5px] tracking-tight text-[var(--color-text-disabled)] uppercase",
    remove: [
      "absolute -end-1.5 -top-1.5 grid size-5 place-items-center rounded-full",
      "bg-[var(--color-bg-inverse)] text-[var(--color-text-on-inverse)] shadow-sm",
      "opacity-0 transition-opacity duration-150",
      "group-hover/attachment:opacity-100 focus-visible:opacity-100",
      "outline-none focus-visible:ring-2 focus-visible:ring-black/40",
    ],
    spinner: "absolute inset-0 grid place-items-center bg-[var(--color-bg-base)]/60",
  },
  variants: {
    uploading: {
      true: { info: "opacity-60" },
      false: {},
    },
  },
  defaultVariants: { uploading: false },
});

export type AttachmentVariants = Parameters<typeof attachment>[0];
