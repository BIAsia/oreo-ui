import * as React from "react";
import { cn } from "@/lib/cn";
import { shortcutCap, type ShortcutVariants } from "./shortcut.variants";

/**
 * Oreo UI Shortcut — renders a keyboard shortcut as one or more key "caps".
 *
 * Pass `keys` as an array of tokens. Modifier aliases are mapped to their
 * canonical glyphs (`cmd` → ⌘, `shift` → ⇧, `opt` → ⌥, `ctrl` → ⌃, …); any
 * other token (a letter, `F1`, `ESC`, `Tab`) renders as-is. By default each
 * key gets its own cap; `combine` merges them into a single cap (e.g. ⌘⇧A).
 */
const GLYPHS: Record<string, string> = {
  cmd: "⌘",
  command: "⌘",
  meta: "⌘",
  shift: "⇧",
  opt: "⌥",
  option: "⌥",
  alt: "⌥",
  ctrl: "⌃",
  control: "⌃",
  enter: "↵",
  return: "↵",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
  backspace: "⌫",
  space: "␣",
};

/** Resolve a token to its display glyph (modifiers map; everything else passes through). */
export function shortcutGlyph(token: string): string {
  return GLYPHS[token.toLowerCase()] ?? token;
}

export type ShortcutProps = {
  /** Tokens to render, e.g. `["cmd", "shift", "A"]`. */
  keys: string[];
  /** Merge all keys into one cap instead of one cap per key. */
  combine?: boolean;
} & ShortcutVariants &
  Omit<React.ComponentPropsWithoutRef<"span">, "children">;

export function Shortcut({ keys, combine = false, size, className, ...rest }: ShortcutProps) {
  const label = keys.map(shortcutGlyph).join(" ");

  if (combine) {
    return (
      <kbd aria-label={label} className={cn(shortcutCap({ size }), "font-sans", className)} {...rest}>
        {keys.map(shortcutGlyph).join("")}
      </kbd>
    );
  }

  return (
    <span aria-label={label} className={cn("inline-flex items-center gap-1 align-middle", className)} {...rest}>
      {keys.map((k, i) => (
        <kbd key={i} className={cn(shortcutCap({ size }), "font-sans")}>
          {shortcutGlyph(k)}
        </kbd>
      ))}
    </span>
  );
}
