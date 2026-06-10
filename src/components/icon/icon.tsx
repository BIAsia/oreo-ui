import * as React from "react";
import type { Icon as PhosphorIcon, IconWeight } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

/**
 * Oreo UI Icon — a thin adapter over Phosphor icons.
 *
 * Sizing and color are driven by Tailwind tokens (via `currentColor`) rather
 * than Phosphor's numeric `size`/`color` props, so icons inherit color from
 * their container and stay consistent with the rest of the system. Inside
 * surfaces like `IconButton` the parent's `[&_svg]:size-*` rule wins, so an
 * `<Icon>` placed there scales automatically.
 *
 * Pass any Phosphor glyph as `icon`:
 *   import { Paperclip } from "@phosphor-icons/react";
 *   <Icon icon={Paperclip} weight="bold" />
 */
const sizeMap = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
} as const;

export type IconSize = keyof typeof sizeMap;
export type { IconWeight };

export type IconProps = {
  /** The Phosphor icon component to render. */
  icon: PhosphorIcon;
  /** Token size; ignored when a parent sets `[&_svg]:size-*`. */
  size?: IconSize;
  /** Phosphor weight — the lever for visual hierarchy (regular/bold/fill…). */
  weight?: IconWeight;
  className?: string;
  /**
   * Accessible name. When omitted the icon is hidden from assistive tech
   * (decorative), which is the right default inside labelled buttons.
   */
  "aria-label"?: string;
} & Omit<
  React.ComponentProps<PhosphorIcon>,
  "size" | "color" | "weight" | "ref"
>;

export function Icon({
  icon: Glyph,
  size = "md",
  weight,
  className,
  "aria-label": ariaLabel,
  ...rest
}: IconProps) {
  return (
    <Glyph
      weight={weight}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn(sizeMap[size], className)}
      {...rest}
    />
  );
}
