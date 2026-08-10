import { tv } from "@/lib/tv";

/**
 * Oreo UI Prompt Box — the multi-state composer card for agent conversations.
 *
 * Geometry from the Figma `_Prompt Box` master: a `--radius-card-medium` card
 * on the base background with a hairline border and the Shadow/Default
 * elevation; 12px padding, 16px between the content area and the action row.
 * When a Context Bar is attached the bar tucks 16px underneath the card
 * (`headerSlot` / `footerSlot` pull margins) and the card paints above it.
 */
export const promptBox = tv({
  slots: {
    stack: "relative isolate flex w-full max-w-[800px] flex-col",
    headerSlot: "z-[1] -mb-[16px] w-full",
    footerSlot: "z-[1] -mt-[16px] w-full",
    card: [
      "z-[2] flex w-full max-w-[800px] flex-col items-start gap-[var(--space-x8)]",
      "rounded-[var(--radius-card-medium)] bg-[var(--color-bg-base)] p-[var(--space-x6)]",
      "border-[0.5px] border-[var(--color-border-default)] shadow-[var(--shadow-default)]",
    ],
    content: "flex w-full flex-col items-start gap-[var(--space-x4)]",
    inputWrap: "relative flex min-h-[60px] w-full flex-col items-start",
    textarea: [
      "w-full resize-none bg-transparent text-[14px] leading-5 text-[var(--color-text-primary)]",
      "outline-none placeholder:text-transparent",
    ],
    placeholder: [
      "pointer-events-none absolute top-0 left-0 flex items-center gap-[var(--space-x3)]",
      "text-[14px] leading-5 whitespace-nowrap text-[var(--color-text-placeholder)]",
    ],
    tags: "absolute -top-[2px] left-0 z-[1] flex items-center gap-[var(--space-x4)]",
    actions: "flex w-full items-center justify-between",
    actionCluster: "flex items-center gap-[var(--space-x4)]",
  },
  variants: {
    inset: {
      true: { headerSlot: "px-[var(--space-x6)]", footerSlot: "px-[var(--space-x6)]" },
      false: {},
    },
  },
  defaultVariants: { inset: false },
});

/**
 * The inline Keyword Tag from the `_Prompt` input — a 24px capsule-ish chip
 * that sits at the head of the first text line (`surface` look), or a palette
 * tone for generative keywords ("Create Image").
 */
export const keywordTag = tv({
  base: [
    "inline-flex h-6 min-w-6 items-center justify-center gap-[var(--space-x1)]",
    "rounded-[var(--radius-control)] py-[var(--space-x1)] pr-[var(--space-x4)] pl-[var(--space-x2)]",
    "text-[12px] leading-4 font-semibold whitespace-nowrap",
    "[&_svg]:size-4 [&_img]:size-4",
  ],
  variants: {
    color: {
      surface: [
        "bg-[var(--color-bg-surface)] text-[var(--color-text-primary)]",
        "border-[0.5px] border-[var(--color-border-default)]",
      ],
      purple: "bg-[var(--color-palette-purple-bg)] text-[var(--color-palette-purple-text)]",
      mint: "bg-[var(--color-palette-mint-bg)] text-[var(--color-palette-mint-text)]",
      pink: "bg-[var(--color-palette-pink-bg)] text-[var(--color-palette-pink-text)]",
      blue: "bg-[var(--color-palette-blue-bg)] text-[var(--color-palette-blue-text)]",
      orange: "bg-[var(--color-palette-orange-bg)] text-[var(--color-palette-orange-text)]",
    },
  },
  defaultVariants: { color: "surface" },
});

export type KeywordTagVariants = Parameters<typeof keywordTag>[0];
