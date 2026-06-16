import * as React from "react";
import { cn } from "@/lib/cn";
import { avatar } from "./avatar.variants";

type AvatarSize = "xs" | "sm" | "md" | "lg";

export type AvatarGroupProps = {
  /** Max avatars to show before collapsing the rest into a "+N" count. */
  max?: number;
  /** Size applied to the overflow count (match your avatars). */
  size?: AvatarSize;
} & React.ComponentPropsWithoutRef<"div">;

/**
 * Stacked, overlapping avatars with an optional "+N" overflow count. Each item
 * gets a ring in the base background so the circles read as separated.
 */
export function AvatarGroup({ max, size = "md", className, children, ...rest }: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const shown = max != null ? items.slice(0, max) : items;
  const overflow = max != null ? items.length - shown.length : 0;

  const ring = "ring-2 ring-[var(--color-bg-base)]";

  return (
    <div className={cn("flex items-center -space-x-2", className)} {...rest}>
      {shown.map((child, i) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ className?: string }>, {
              className: cn(ring, (child.props as { className?: string }).className),
            })
          : child,
      )}
      {overflow > 0 && (
        <span className={cn(avatar({ size }), ring, "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]")}>
          +{overflow}
        </span>
      )}
    </div>
  );
}
