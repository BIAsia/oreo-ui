import * as React from "react";
import { useRender } from "@base-ui-components/react/use-render";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { chip, type ChipVariants } from "./chip.variants";

export type ChipProps = {
  /** Base UI render prop — swap the element (e.g. an <a>). Polymorphism. */
  render?: useRender.RenderProp;
  /** Leading icon, typically an <Icon icon={…} />. */
  icon?: React.ReactNode;
  /** Press-spring controls, exposed so docs can tune them live. */
  bounce?: number;
  duration?: number;
  tapScale?: number;
} & ChipVariants &
  Omit<React.ComponentPropsWithoutRef<"button">, "type">;

export function Chip({
  render,
  size,
  selected,
  disabled,
  icon,
  children,
  className,
  bounce = 0.4,
  duration = 0.3,
  tapScale = 0.96,
  ...rest
}: ChipProps) {
  const defaultRender = (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: tapScale }}
      transition={{ type: "spring", bounce, duration }}
    />
  );

  return useRender({
    render: render ?? defaultRender,
    props: {
      className: cn(chip({ size, selected, disabled }), className),
      disabled: Boolean(disabled),
      "aria-pressed": selected ? true : undefined,
      "data-disabled": disabled ? "" : undefined,
      ...rest,
      children: (
        <>
          {icon}
          <span>{children}</span>
        </>
      ),
    },
  });
}

/**
 * Horizontal, scrollable row of chips — the canonical layout at conversation
 * entry points. Hides the scrollbar but stays swipe/scroll-able.
 */
export function ChipGroup({ className, children, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
