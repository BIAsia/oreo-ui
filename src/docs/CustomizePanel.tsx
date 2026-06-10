import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "@phosphor-icons/react";
import { Slider, Segmented } from "./primitives";
import { Icon, type IconWeight } from "@/components/icon";

const ICON_WEIGHTS: readonly IconWeight[] = ["regular", "bold", "fill", "duotone"];

export type CustomizeState = {
  dark: boolean;
  setDark: (v: boolean) => void;
  radius: number;
  setRadius: (v: number) => void;
  bounce: number;
  setBounce: (v: number) => void;
  duration: number;
  setDuration: (v: number) => void;
  tapScale: number;
  setTapScale: (v: number) => void;
  weight: IconWeight;
  setWeight: (v: IconWeight) => void;
};

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between text-[13px]"
    >
      <span>{label}</span>
      <span className="toggle" data-on={checked} />
    </button>
  );
}

export function CustomizePanel(s: CustomizeState) {
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="popLayout" initial={false}>
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.35 }}
            style={{ transformOrigin: "bottom right", boxShadow: "var(--shadow-panel)" }}
            className="w-[288px] overflow-hidden rounded-2xl bg-[var(--color-bg-base)] text-[var(--color-text-primary)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-3">
              <span className="flex items-center gap-2 text-[13px] font-semibold">
                <Icon icon={SlidersHorizontal} size="sm" /> Make them yours
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Collapse"
                className="grid size-6 place-items-center rounded-md text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-state-hover)] hover:text-[var(--color-text-primary)]"
              >
                <Icon icon={X} className="size-3" />
              </button>
            </div>

            <div className="space-y-5 p-4">
              <div className="space-y-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Theme &amp; shape
                </div>
                <Toggle checked={s.dark} onChange={s.setDark} label="Dark theme" />
                <Slider label="radius" value={s.radius} min={0} max={999} step={1} onChange={s.setRadius} suffix="px" />
              </div>

              <div className="space-y-3 border-t border-[var(--color-border-subtle)] pt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Press spring
                </div>
                <Slider label="bounce" value={s.bounce} min={0} max={1} step={0.05} onChange={s.setBounce} />
                <Slider label="duration" value={s.duration} min={0.1} max={1} step={0.05} onChange={s.setDuration} suffix="s" />
                <Slider label="tapScale" value={s.tapScale} min={0.8} max={1} step={0.01} onChange={s.setTapScale} />
              </div>

              <div className="space-y-3 border-t border-[var(--color-border-subtle)] pt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Icon
                </div>
                <Segmented label="weight" value={s.weight} options={ICON_WEIGHTS} onChange={s.setWeight} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="fab"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.3 }}
            whileTap={{ scale: 0.94 }}
            style={{ boxShadow: "var(--shadow-panel)" }}
            className="flex items-center gap-2 rounded-full bg-[var(--color-bg-inverse)] px-4 py-2.5 text-[13px] font-medium text-[var(--color-text-on-inverse)]"
          >
            <Icon icon={SlidersHorizontal} size="sm" /> Make them yours
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
