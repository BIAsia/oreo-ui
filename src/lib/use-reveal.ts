import { useEffect, useRef, useState } from "react";

export type RevealTickerOptions = {
  /** How many units the stream will emit in total. */
  total: number;
  /** Pause the ticker without resetting what has already landed. */
  run?: boolean;
  /** Gap between units after the first. */
  stepInterval?: number;
  /** Holds the first unit so it doesn't land on the same frame as the turn. */
  startDelay?: number;
  /** Drive the reveal yourself — passing this switches the timer off entirely. */
  revealed?: number;
  /** Fires once, when the last unit lands. */
  onComplete?: () => void;
};

/**
 * Paces a streamed reveal, one unit at a time.
 *
 * A demo needs a timer; a real agent doesn't — its steps land when tool calls
 * resolve, and they don't take equal time. Passing `revealed` hands the count
 * over to the caller and the internal timer stops running, so the same
 * component animates identically whether it's a docs preview or a live stream.
 *
 * `startDelay` exists because a log that appears on the same frame as the user's
 * message reads as pre-baked rather than as work starting.
 */
export function useRevealTicker({
  total,
  run = true,
  stepInterval = 850,
  startDelay = 320,
  revealed,
  onComplete,
}: RevealTickerOptions) {
  const controlled = revealed !== undefined;
  const [ticked, setTicked] = useState(0);
  const count = controlled ? Math.max(0, Math.min(revealed, total)) : ticked;

  useEffect(() => {
    if (controlled || !run || count >= total) return undefined;
    const timer = window.setTimeout(
      () => setTicked((n) => n + 1),
      count === 0 ? startDelay : stepInterval,
    );
    return () => window.clearTimeout(timer);
  }, [controlled, run, count, total, startDelay, stepInterval]);

  // Latch, so a re-render at full count doesn't fire the callback again.
  const fired = useRef(false);
  useEffect(() => {
    if (total === 0 || count < total) {
      fired.current = false;
      return;
    }
    if (fired.current) return;
    fired.current = true;
    onComplete?.();
  }, [count, total, onComplete]);

  /** Reset the internal timer — no-op while controlled. */
  const replay = () => setTicked(0);

  return { revealed: count, done: total > 0 && count >= total, replay };
}
