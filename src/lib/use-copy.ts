import { useCallback, useRef, useState } from "react";

/**
 * Clipboard copy with a transient "copied" flag — shared by Code Block,
 * Message actions, and anything else with a copy → check swap.
 */
export function useCopy(resetAfter = 1600) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const copy = useCallback(
    (text: string) => {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), resetAfter);
      }, () => {});
    },
    [resetAfter],
  );

  return { copied, copy };
}
