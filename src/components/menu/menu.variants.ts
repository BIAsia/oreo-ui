import { tv } from "@/lib/tv";

/**
 * Oreo UI Menu — floating list surface + rows, per the Figma Menu primitive.
 *
 * The popup is a `--color-bg-surface` card with the Shadow/Overlay elevation
 * and a 16px radius; rows are 36px tall (20px line + 8px vertical padding),
 * 10px side padding, 10px radius, highlighted with the hover state layer.
 * Row metrics come from the kit's Primitives namespace (one-off values, not
 * part of the token ladder) so they stay as literals here.
 */
export const menu = tv({
  slots: {
    popup: [
      "min-w-[180px] rounded-[var(--radius-card-medium)] bg-[var(--color-bg-surface)] p-[6px]",
      "shadow-[var(--shadow-overlay)] outline-none",
      // grow/fade from the anchor; Base UI sets --transform-origin on the popup
      "origin-[var(--transform-origin)] transition-[transform,opacity] duration-150 ease-out",
      "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
      "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
      "motion-reduce:transition-none",
    ],
    item: [
      "flex w-full cursor-default select-none items-center gap-[6px]",
      "rounded-[10px] px-[10px] py-[8px] text-[14px] font-medium leading-5",
      "text-[var(--color-text-primary)] outline-none",
      "data-[highlighted]:bg-[var(--color-state-hover)]",
      "data-[disabled]:text-[var(--color-text-disabled)]",
    ],
    itemIcon: "grid size-5 shrink-0 place-items-center [&_svg]:size-5 [&_img]:size-5",
    itemLabel: "min-w-0 flex-1 truncate text-left",
    itemTrailing: "flex shrink-0 items-center gap-[4px] text-[var(--color-text-secondary)]",
    separator: "mx-[6px] my-[8px] h-[0.5px] bg-[var(--color-border-subtle)]",
  },
});

export type MenuSlots = ReturnType<typeof menu>;
