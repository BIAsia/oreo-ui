import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useHidden } from "@/lib/motion";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/button";

type ConversationCtx = {
  atBottom: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
};
const ConversationContext = React.createContext<ConversationCtx | null>(null);

function useConversation(part: string): ConversationCtx {
  const ctx = React.useContext(ConversationContext);
  if (!ctx) throw new Error(`<${part}> must be used inside <Conversation>`);
  return ctx;
}

export type ConversationProps = {
  /** Follow new content while the user is at the bottom. */
  autoScroll?: boolean;
} & React.ComponentPropsWithoutRef<"div">;

/** How close to the end still counts as "at the bottom". */
const STICK_THRESHOLD = 32;

/**
 * Oreo UI Conversation — the transcript viewport.
 *
 * Sticks to the bottom while new content streams in, releases the moment the
 * user scrolls up (so reading is never hijacked), and re-sticks when they
 * return. ConversationScrollButton floats over the bottom edge when detached.
 */
export function Conversation({ autoScroll = true, className, children, ...rest }: ConversationProps) {
  const viewport = React.useRef<HTMLDivElement>(null);
  const stick = React.useRef(true);
  const [atBottom, setAtBottom] = React.useState(true);

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = viewport.current;
    if (!el) return;
    stick.current = true;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const onScroll = () => {
    const el = viewport.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    stick.current = distance < STICK_THRESHOLD;
    setAtBottom(distance < STICK_THRESHOLD);
  };

  // Follow content growth (streaming) while stuck to the bottom. Mutations
  // cover streamed text (microtask delivery — works even in hidden tabs);
  // resizes cover late layout changes like images loading.
  React.useEffect(() => {
    const el = viewport.current;
    if (!el || !autoScroll) return;
    const follow = () => {
      if (stick.current) el.scrollTop = el.scrollHeight;
    };
    const resizes = new ResizeObserver(follow);
    for (const child of el.children) resizes.observe(child);
    const mutations = new MutationObserver(follow);
    mutations.observe(el, { childList: true, subtree: true, characterData: true });
    return () => {
      resizes.disconnect();
      mutations.disconnect();
    };
  }, [autoScroll]);

  return (
    <ConversationContext.Provider value={{ atBottom, scrollToBottom }}>
      <div
        ref={viewport}
        onScroll={onScroll}
        role="log"
        aria-live="polite"
        className={cn("relative overflow-y-auto overscroll-contain", className)}
        {...rest}
      >
        {children}
      </div>
    </ConversationContext.Provider>
  );
}

/** The message column — spacing and measure for the transcript. */
export function ConversationContent({ className, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-4", className)} {...rest} />;
}

/** Floats over the bottom edge whenever the user has scrolled away. */
export function ConversationScrollButton({ className }: { className?: string }) {
  const { atBottom, scrollToBottom } = useConversation("ConversationScrollButton");
  const hidden = useHidden({ transform: "translateY(8px) scale(0.9)" });
  return (
    <div className={cn("pointer-events-none sticky bottom-3 z-10 flex justify-center", className)}>
      <AnimatePresence>
        {!atBottom && (
          <motion.div
            initial={hidden}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={hidden}
            transition={{ type: "spring", bounce: 0.3, duration: 0.35 }}
            className="pointer-events-auto"
          >
            <IconButton
              type="secondary"
              floating
              aria-label="Scroll to bottom"
              onClick={() => scrollToBottom()}
              icon={<Icon name="arrow-down" />}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
