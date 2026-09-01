import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { SettingsAppearanceProvider } from "./appearance";
import { SettingsNav } from "./SettingsNav";
import { settingsShell } from "./settings.variants";
import type { SettingsAppearance, SettingsNavGroup } from "./types";
import "./settings.css";

/** The iOS-like drawer curve — mirrors `--ease-drawer`. */
const easeDrawer = [0.32, 0.72, 0, 1] as const;

export type SettingsShellProps = {
  appearance: SettingsAppearance;
  groups: SettingsNavGroup[];
  active: string;
  onNavigate: (id: string) => void;
  /**
   * Identity of the current content — page slug. Changing it slides the fresh
   * page in and resets the scroll position.
   */
  contentKey: string;
  children: React.ReactNode;
};

/**
 * The settings frame: nav rail + scrollable content panel, laid out by the
 * `scheme` axis. In the `drawer` scheme (and whenever the container is too
 * narrow for a rail) the nav collapses behind a hamburger and slides in as an
 * overlay — the same drawer serves as the pattern's responsive behavior.
 */
export function SettingsShell({ appearance, groups, active, onNavigate, contentKey, children }: SettingsShellProps) {
  const { scheme } = appearance;
  const slots = settingsShell({ scheme });
  const reduce = useReducedMotion();
  const scroller = React.useRef<HTMLDivElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const drawerOnly = scheme === "drawer";

  React.useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [contentKey]);

  // The drawer is gone once a rail scheme is picked; don't leave it open.
  React.useEffect(() => {
    if (!drawerOnly) setDrawerOpen(false);
  }, [drawerOnly]);

  React.useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const navigate = (id: string) => {
    setDrawerOpen(false);
    onNavigate(id);
  };

  const nav = <SettingsNav groups={groups} active={active} onNavigate={navigate} />;

  return (
    <SettingsAppearanceProvider value={appearance}>
      <div className={cn(slots.root(), "@container")} data-scheme={scheme}>
        {!drawerOnly && <aside className={cn(slots.nav(), "hidden @2xl:flex")}>{nav}</aside>}

        {/* Hamburger — the only way in when the rail is hidden. */}
        <div className={cn("absolute left-3 top-3 z-10", drawerOnly ? "" : "@2xl:hidden")}>
          <IconButton
            type="tertiary"
            size="sm"
            shape="rectangle"
            className="oreo-squircle [--squircle-radius:var(--radius-control)]"
            aria-label="Open settings navigation"
            aria-expanded={drawerOpen}
            icon={<Icon name="list" weight="light" />}
            onClick={() => setDrawerOpen(true)}
          />
        </div>

        <main ref={scroller} className={slots.content()}>
          <motion.div
            key={contentKey}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(6px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.25, ease: easeOut }}
            className={slots.column()}
          >
            {children}
          </motion.div>
        </main>

        <AnimatePresence>
          {drawerOpen && (
            <React.Fragment key="drawer">
              <motion.div
                key="scrim"
                className="absolute inset-0 z-20 bg-[var(--color-overlay-subtle)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeOut" } }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={() => setDrawerOpen(false)}
              />
              <motion.div
                key="panel"
                role="dialog"
                aria-modal="true"
                aria-label="Settings navigation"
                className="absolute inset-y-0 left-0 z-30 flex w-[260px] flex-col bg-[var(--settings-nav-bg)] shadow-[var(--shadow-overlay)]"
                initial={reduce ? { opacity: 0 } : { transform: "translateX(-100%)" }}
                animate={reduce ? { opacity: 1 } : { transform: "translateX(0%)" }}
                exit={
                  reduce
                    ? { opacity: 0, transition: { duration: 0.15 } }
                    : { transform: "translateX(-100%)", transition: { duration: 0.3, ease: easeDrawer } }
                }
                transition={{ duration: 0.45, ease: easeDrawer }}
              >
                {nav}
              </motion.div>
            </React.Fragment>
          )}
        </AnimatePresence>
      </div>
    </SettingsAppearanceProvider>
  );
}
