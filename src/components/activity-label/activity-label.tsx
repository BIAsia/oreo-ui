import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Motion primitives for "the assistant is doing something" labels — the
 * shimmering in-progress caption that swaps to a resting summary when done.
 * Shared by Tool Call and Reasoning; exported for custom agent chrome.
 */

/** Dimmed label with a light sweep — the in-progress treatment. */
export function ShimmerText({ className, children, ...rest }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span className={cn("relative inline-block leading-none", className)} {...rest}>
      <span>{children}</span>
      <span aria-hidden className="oreo-shimmer pointer-events-none absolute inset-0">
        {children}
      </span>
    </span>
  );
}

export type SwapLabelProps = {
  /** Which layer is showing. */
  active: 0 | 1;
  /** Exactly two layers; the container width-animates between them. */
  children: [React.ReactNode, React.ReactNode];
  className?: string;
};

const layerBase =
  "col-start-1 row-start-1 flex w-max items-center gap-1.5 leading-none " +
  "transition-[opacity,filter,translate] duration-300 ease-out motion-reduce:transition-none " +
  "motion-reduce:translate-y-0";

/* The two layers pass each other rather than dissolving in place: the earlier
   label leaves upward, the later one arrives from below. A pure cross-fade
   reads as a glitch when the two strings are similar ("Thinking" → "Thought
   for 6s"); the 4px of travel says one replaced the other. */
const layerOffset = ["-translate-y-1", "translate-y-1"] as const;

/**
 * Cross-fades between two labels while animating the container to the width
 * of the visible one — a blur-tinged swap with no layout jump.
 */
export function SwapLabel({ active, children, className }: SwapLabelProps) {
  const first = React.useRef<HTMLSpanElement>(null);
  const second = React.useRef<HTMLSpanElement>(null);
  const [width, setWidth] = React.useState<number | null>(null);

  React.useLayoutEffect(() => {
    const target = (active === 0 ? first : second).current;
    if (!target) return undefined;
    const measure = () => setWidth(Math.ceil(target.getBoundingClientRect().width));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    return () => observer.disconnect();
  }, [active]);

  return (
    <span
      style={width === null ? undefined : { width }}
      className={cn(
        "grid overflow-x-clip transition-[width] duration-300 ease-out motion-reduce:transition-none",
        className,
      )}
    >
      {children.map((layer, index) => (
        <span
          key={index}
          ref={index === 0 ? first : second}
          aria-hidden={active !== index}
          className={cn(
            layerBase,
            active === index
              ? "translate-y-0 opacity-100 blur-none"
              : `pointer-events-none opacity-0 blur-[2px] ${layerOffset[index]}`,
          )}
        >
          {layer}
        </span>
      ))}
    </span>
  );
}

export type ActivityLabelProps = {
  /** True while the work is in flight. */
  active: boolean;
  /** In-progress caption, shimmered — "Searching the web". */
  activeLabel: React.ReactNode;
  /** Resting summary — "Searched the web" / "Thought for 8s". */
  label: React.ReactNode;
  className?: string;
};

/** The composed treatment: shimmering caption ↔ resting summary. */
export function ActivityLabel({ active, activeLabel, label, className }: ActivityLabelProps) {
  return (
    <SwapLabel active={active ? 0 : 1} className={cn("text-start", className)}>
      <ShimmerText>{activeLabel}</ShimmerText>
      <>{label}</>
    </SwapLabel>
  );
}
