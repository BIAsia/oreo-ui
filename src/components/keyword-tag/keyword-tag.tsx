import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { pressSpring } from "@/lib/motion";
import { keywordTag, type KeywordTagVariants } from "./keyword-tag.variants";

export type KeywordTagProps = {
  /** Leading 16px glyph — a brand `<img>` or an `<Icon>`. */
  icon?: React.ReactNode;
  /** Thumbnail URL — switches to the referenced-image form. */
  src?: string;
  /** When set, hover swaps the leading slot for an × that removes the tag. */
  onRemove?: () => void;
} & KeywordTagVariants &
  React.ComponentPropsWithoutRef<"span">;

/** The × glyph from the kit; geometry is the 9×9 union centered in a 16 box. */
function CloseGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      <path
        transform="translate(3.5 3.5)"
        fill="currentColor"
        d="M8.14645 0.146447C8.34171 -0.0488155 8.65822 -0.0488153 8.85348 0.146447C9.0487 0.341712 9.04873 0.658228 8.85348 0.853478L5.20699 4.49996L8.85348 8.14645C9.0487 8.34171 9.04873 8.65823 8.85348 8.85348C8.65823 9.04873 8.34171 9.0487 8.14645 8.85348L4.49996 5.20699L0.853478 8.85348C0.658228 9.04873 0.341712 9.0487 0.146447 8.85348C-0.0488153 8.65822 -0.0488155 8.34171 0.146447 8.14645L3.79293 4.49996L0.146447 0.853478C-0.0488155 0.658216 -0.0488155 0.341709 0.146447 0.146447C0.341709 -0.0488155 0.658216 -0.0488155 0.853478 0.146447L4.49996 3.79293L8.14645 0.146447Z"
      />
    </svg>
  );
}


/**
 * Inline keyword chip for composers and context rows ("Figma", "Create
 * Image"). Extends native `<span>` props, so `onClick` passes through; the
 * hover × is its own button and never triggers the tag's own click.
 */
export function KeywordTag({ icon, src, color, onRemove, className, children, ...rest }: KeywordTagProps) {
  const media = src != null;
  const removable = onRemove != null;
  const slots = keywordTag({ color, media, removable });
  const label = typeof children === "string" ? children : undefined;
  const removeLabel = label ? `Remove ${label}` : "Remove tag";
  const hasLeading = media || icon != null || removable;

  return (
    <span className={cn(slots.root(), className)} {...rest}>
      {hasLeading && (
        <span className={slots.leading()}>
          {media ? (
            <span className={slots.thumb()}>
              <img src={src} alt="" />
            </span>
          ) : icon != null ? (
            <span className={slots.icon()}>{icon}</span>
          ) : null}
          {removable && (
            <motion.button
              type="button"
              aria-label={removeLabel}
              whileTap={{ scale: 0.88 }}
              transition={pressSpring}
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
              className={slots.ghost()}
            >
              <CloseGlyph className="size-[14px]" />
            </motion.button>
          )}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
