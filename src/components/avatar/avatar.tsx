import * as React from "react";
import { cn } from "@/lib/cn";
import { paletteSurface, type PaletteColor } from "@/lib/palette";
import { agentGradient, type AgentName } from "./agents";
import { avatar, type AvatarVariants } from "./avatar.variants";

/** Alphabet fills — palette tones plus the two neutral extremes. */
export type AvatarColor = PaletteColor | "black" | "white";

const alphabetSurface: Record<AvatarColor, string> = {
  ...paletteSurface,
  black: "bg-[var(--color-bg-inverse)] text-[var(--color-text-on-inverse)]",
  white: "bg-[var(--color-bg-base)] text-[var(--color-text-primary)] ring-1 ring-inset ring-[var(--color-border-default)]",
};

/** Up to two uppercase letters from a name ("Oreo UI" → "OR", "Nova" → "NO"). */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : name.trim().slice(0, 2);
  return letters.toUpperCase();
}

export type AvatarProps = {
  /** Photo URL — renders the "portrait" type. */
  src?: string;
  /** Display name: used for initials (alphabet) and as the image alt text. */
  name?: string;
  /** Alphabet fill color. Ignored unless the avatar resolves to initials. */
  color?: AvatarColor;
  /** Gradient agent identity — renders the "agent" type. */
  agent?: AgentName;
  /** A logo/brand mark — renders the "logo" type (centered, on elevated bg). */
  logo?: React.ReactNode;
} & AvatarVariants &
  Omit<React.ComponentPropsWithoutRef<"span">, "color">;

/**
 * Oreo UI Avatar — represents users, agents, models, and brands as a circle.
 *
 * The type is inferred from props, in priority order: `src` → portrait,
 * `agent` → gradient, `logo` → brand mark, `name` → initials, otherwise an
 * empty placeholder.
 */
export function Avatar({ src, name, color = "default", agent, logo, size, className, ...rest }: AvatarProps) {
  let content: React.ReactNode = null;
  let fill = "";
  let style: React.CSSProperties | undefined;

  if (src) {
    content = <img src={src} alt={name ?? ""} className="size-full object-cover" />;
  } else if (agent) {
    style = { background: agentGradient[agent] };
  } else if (logo) {
    content = <span className="flex size-1/2 items-center justify-center text-[var(--color-text-primary)]">{logo}</span>;
    fill = "bg-[var(--color-bg-elevated)] ring-1 ring-inset ring-[var(--color-border-subtle)]";
  } else if (name) {
    content = <span>{initials(name)}</span>;
    fill = alphabetSurface[color];
  } else {
    fill = "bg-[var(--color-bg-elevated)] ring-1 ring-inset ring-[var(--color-border-subtle)]";
  }

  return (
    <span
      role="img"
      aria-label={name ?? (agent ? `${agent} agent` : undefined)}
      className={cn(avatar({ size }), fill, className)}
      style={style}
      {...rest}
    >
      {content}
    </span>
  );
}
