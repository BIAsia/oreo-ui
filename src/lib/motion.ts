import { useReducedMotion } from "motion/react";

/**
 * Shared motion values — the JS half of the curves declared in `index.css`.
 *
 * Motion's tween default is `easeInOut`, which starts slow; entrances and exits
 * pass `ease: easeOut` so the first frames move. Keep these in sync with the
 * `--ease-*` tokens so CSS- and JS-driven motion match.
 */

/** Strong ease-out. Mirrors `--ease-out`. Entrances, exits, and swaps. */
export const easeOut = [0.23, 1, 0.32, 1] as const;

/** Press feedback. Buttons expose `bounce`/`duration` so docs can tune it live. */
export const pressSpring = { type: "spring", bounce: 0.4, duration: 0.3 } as const;

/**
 * The hidden keyframe an element enters from and exits to.
 *
 * Under `prefers-reduced-motion` the movement is dropped and only the fade
 * survives — reduced motion means gentler, not none, and the fade is what
 * tells you something arrived. Motion defaults to `reducedMotion: "never"`,
 * and a copy-paste library can't assume the app wraps it in `<MotionConfig>`,
 * so each component opts in here.
 *
 *   const hidden = useHidden({ transform: "translateY(4px)" });
 *   <motion.li initial={hidden} animate={{ opacity: 1, transform: "translateY(0px)" }} />
 *
 * Animate to an explicit identity transform, never `"none"` — Motion mixes the
 * numbers inside two matching transform strings, and `"none"` isn't one.
 *
 * Prefer a full `transform` string over Motion's `x`/`y`/`scale` shorthands on
 * anything that animates while the page is busy: the shorthands run on the
 * main thread and drop frames under load.
 */
export function useHidden<T extends Record<string, unknown>>(movement: T) {
  const reduce = useReducedMotion();
  return reduce ? { opacity: 0 } : { opacity: 0, ...movement };
}
