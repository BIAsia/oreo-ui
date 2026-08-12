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
