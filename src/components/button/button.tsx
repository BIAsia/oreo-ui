import * as React from "react";
import { useRender } from "@base-ui-components/react/use-render";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { button, type ButtonVariants } from "./button.variants";

export type ButtonProps = {
  /** Base UI render prop — make it an <a>, router <Link>, etc. Polymorphism. */
  render?: useRender.RenderProp;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Press-spring controls, exposed so each docs page can tune them live. */
  bounce?: number;
  duration?: number;
  tapScale?: number;
} & ButtonVariants &
  Omit<React.ComponentPropsWithoutRef<"button">, "type">;

export function Button({
  render,
  type,
  danger,
  disabled,
  leadingIcon,
  trailingIcon,
  children,
  className,
  bounce = 0.4,
  duration = 0.3,
  tapScale = 0.96,
  ...rest
}: ButtonProps) {
  // Default element is a motion.button so the press uses a real spring.
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
      className: cn(button({ type, danger, disabled }), className),
      disabled: Boolean(disabled),
      "data-disabled": disabled ? "" : undefined,
      ...rest,
      children: (
        <>
          {leadingIcon}
          <span>{children}</span>
          {trailingIcon}
        </>
      ),
    },
  });
}
