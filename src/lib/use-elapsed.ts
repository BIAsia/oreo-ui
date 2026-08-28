import { useEffect, useRef, useState } from "react";

/**
 * A live "1.2s" clock for work that is still in flight.
 *
 * Ticks at 100ms and reads from `performance.now()` rather than accumulating —
 * a background tab throttles the interval, and a counter that adds a fixed step
 * per tick would silently fall behind the real elapsed time.
 *
 * Freezes at its last value when `running` goes false, so the resting label can
 * keep showing what the run cost. Render it in `tabular-nums` — the tenths
 * digit changes ten times a second and proportional figures jitter the row.
 */
export function useElapsed(running: boolean, precision = 1) {
  const [seconds, setSeconds] = useState(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      start.current = null;
      return undefined;
    }
    start.current = performance.now();
    setSeconds(0);
    const timer = window.setInterval(() => {
      if (start.current !== null) setSeconds((performance.now() - start.current) / 1000);
    }, 100);
    return () => window.clearInterval(timer);
  }, [running]);

  return { seconds, label: `${seconds.toFixed(precision)}s` };
}
