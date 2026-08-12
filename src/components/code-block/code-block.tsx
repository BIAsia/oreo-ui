import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut, pressSpring, useHidden } from "@/lib/motion";
import { useCopy } from "@/lib/use-copy";
import { highlight } from "@/lib/highlight";
import { Icon } from "@/components/icon";
import { codeBlock, type CodeBlockVariants } from "./code-block.variants";

export type CodeBlockProps = {
  code: string;
  /** Language label in the header, e.g. "tsx". */
  language?: string;
  /** Filename — replaces the language label when set. */
  title?: string;
  /** Hide the header for a bare code surface (inside Response lists, etc.). */
  header?: boolean;
  /** Extra header actions, rendered before the copy button. */
  actions?: React.ReactNode;
  /** Hide the copy button. */
  copyable?: boolean;
  /** Syntax highlighting (lazy shiki) — on when a language is set. */
  highlight?: boolean;
} & CodeBlockVariants &
  Omit<React.ComponentPropsWithoutRef<"div">, "children">;

/**
 * Ghost icon action tuned for the dark code surface — the standard
 * IconButton palettes assume the app background, so this stays local.
 */
export function CodeBlockAction({
  className,
  "aria-label": ariaLabel,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<typeof motion.button>) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      transition={pressSpring}
      aria-label={ariaLabel}
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-lg text-[var(--color-code-fg)]/60",
        "transition-colors hover:bg-white/10 hover:text-[var(--color-code-fg)]",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

/** Copy button with the copy → check zoom swap. Reused by docs and Response. */
export function CopyCodeButton({ code }: { code: string }) {
  const { copied, copy } = useCopy();
  const hidden = useHidden({ transform: "scale(0.9)" });
  return (
    <CodeBlockAction aria-label="Copy code" onClick={() => copy(code)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={hidden}
          animate={{ opacity: 1, transform: "scale(1)" }}
          exit={hidden}
          transition={{ duration: 0.12, ease: easeOut }}
          className="grid place-items-center"
        >
          <Icon name={copied ? "check" : "copy"} size="sm" weight={copied ? "bold" : "regular"} />
        </motion.span>
      </AnimatePresence>
    </CodeBlockAction>
  );
}

export function CodeBlock({
  code,
  language,
  title,
  header = true,
  actions,
  copyable = true,
  highlight: highlightEnabled = true,
  wrap,
  className,
  ...rest
}: CodeBlockProps) {
  const slots = codeBlock({ wrap });
  const label = title ?? language;
  // No explicit language? Infer from the filename extension.
  const lang = language ?? (typeof title === "string" ? /\.(\w+)$/.exec(title)?.[1] : undefined);
  const [html, setHtml] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!lang || !highlightEnabled) {
      setHtml(null);
      return;
    }
    let alive = true;
    highlight(code, lang).then((result) => {
      if (alive) setHtml(result);
    });
    return () => {
      alive = false;
    };
  }, [code, lang, highlightEnabled]);

  return (
    <div className={cn(slots.root(), className)} {...rest}>
      {header && (
        <div className={slots.header()}>
          <span className={cn(slots.label(), !title && "uppercase")}>{label ?? "code"}</span>
          <div className="flex items-center gap-0.5">
            {actions}
            {copyable && <CopyCodeButton code={code} />}
          </div>
        </div>
      )}
      {html ? (
        // Shiki output is trusted local generation from `code`, not remote HTML.
        <div className={slots.body()} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className={slots.body()}>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
