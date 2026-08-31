import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui-components/react/switch";
import { cn } from "@/lib/cn";
import { switchStyles } from "./switch.variants";

const slots = switchStyles();

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  /**
   * Accessible name. Required unless the switch is labelled from outside
   * (e.g. wrapped in a <label> or referenced by a row's aria-labelledby).
   */
  "aria-label"?: string;
} & Omit<
  React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>,
  "checked" | "defaultChecked" | "onCheckedChange" | "disabled" | "className"
>;

/**
 * A Base UI switch on the Oreo track/thumb surface. State comes through Base
 * UI's `data-checked` / `data-disabled` attributes, so the variants file owns
 * every visual and this component stays wiring only.
 */
export function Switch({ checked, defaultChecked, onCheckedChange, disabled, className, ...rest }: SwitchProps) {
  return (
    <BaseSwitch.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(slots.root(), className)}
      {...rest}
    >
      <BaseSwitch.Thumb className={slots.thumb()} />
    </BaseSwitch.Root>
  );
}
