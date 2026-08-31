import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Oreo UI Streaming Text — plain text arriving token by token.
 *
 * Feed it the growing string on every render (exactly like Response) and it
 * diffs out what was appended, animates just those tokens in, then folds them
 * back into an inert text node once the entrance settles — so a long stream
 * never accumulates thousands of animated spans.
 *
 * Plain text only: markdown streams belong in <Response>, which tolerates
 * incomplete syntax on its own.
 */

export type StreamingTextVariant = "plain" | "fade" | "gradient";

export type StreamingTextProps = Omit<React.ComponentPropsWithoutRef<"span">, "children"> & {
  /** The streamed text so far — re-render with the growing string. */
  children: string;
  /**
   * "plain" appends with no animation, "fade" eases each token in (default),
   * "gradient" reveals tokens through a sliding gradient mask so the stream
   * carries a soft fading tail while text is arriving.
   */
  variant?: StreamingTextVariant;
};

/** Longest per-token entrance plus a beat — after this a token is inert text. */
const SETTLE_MS = 700;

type Segment = { key: number; text: string; at: number };
type StreamState = { settled: string; segments: Segment[] };

const segmentClass: Record<Exclude<StreamingTextVariant, "plain">, string> = {
  fade: "oreo-stream-fade",
  gradient: "oreo-stream-gradient",
};

/** Split an appended chunk into word-ish tokens (whitespace rides along). */
function tokenize(chunk: string): string[] {
  return chunk.match(/\s*\S+|\s+$/g) ?? [];
}

export function StreamingText({ children: text, variant = "fade", className, ...rest }: StreamingTextProps) {
  // First paint renders whatever arrived as settled text — a static string
  // (or a remount mid-stream) must not replay its entrance.
  const [state, setState] = React.useState<StreamState>(() => ({ settled: text, segments: [] }));
  const prevText = React.useRef(text);
  const prevVariant = React.useRef(variant);

  // Diff after commit, not during render: a render-phase setState here makes
  // React rebase the PARENT's in-flight updates (replaying its updaters
  // against a stale base), which corrupts innocent-looking callers. Layout
  // timing so the reset case repaints before the stale frame is shown; the
  // appended tokens themselves start transparent, so they lose nothing.
  React.useLayoutEffect(() => {
    const prev = prevText.current;
    const variantChanged = prevVariant.current !== variant;
    prevText.current = text;
    prevVariant.current = variant;
    // "plain" renders the prop directly — no state to maintain. A later switch
    // to an animated variant lands in the reset branch below via variantChanged.
    if (variant === "plain") return;
    if (!variantChanged && text === prev) return;
    if (!variantChanged && text.length > prev.length && text.startsWith(prev)) {
      // Token keys are character offsets into the full string — stable and
      // unique for as long as the stream only grows.
      const base = prev.length;
      const fresh: Segment[] = [];
      let offset = 0;
      const at = Date.now();
      for (const token of tokenize(text.slice(base))) {
        fresh.push({ key: base + offset, text: token, at });
        offset += token.length;
      }
      setState((s) => ({ settled: s.settled, segments: [...s.segments, ...fresh] }));
    } else {
      // Replaced or truncated text, or a variant switch: swap instantly.
      setState({ settled: text, segments: [] });
    }
  }, [text, variant]);

  // Fold segments whose entrance has finished back into the settled string.
  React.useEffect(() => {
    if (state.segments.length === 0) return undefined;
    const due = state.segments[0].at + SETTLE_MS - Date.now();
    const timer = window.setTimeout(() => {
      setState((s) => {
        const cutoff = Date.now() - SETTLE_MS;
        let count = 0;
        let folded = "";
        while (count < s.segments.length && s.segments[count].at <= cutoff) {
          folded += s.segments[count].text;
          count += 1;
        }
        if (count === 0) return s;
        return { settled: s.settled + folded, segments: s.segments.slice(count) };
      });
    }, Math.max(due, 0) + 20);
    return () => window.clearTimeout(timer);
  }, [state]);

  return (
    <span className={cn("whitespace-pre-wrap", className)} {...rest}>
      {variant === "plain" ? (
        text
      ) : (
        <>
          {state.settled}
          {state.segments.map((segment) => (
            <span key={segment.key} className={segmentClass[variant]}>
              {segment.text}
            </span>
          ))}
        </>
      )}
    </span>
  );
}
