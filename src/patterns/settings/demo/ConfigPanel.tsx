import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { Switch } from "@/components/switch";
import {
  SETTINGS_CARD_STYLES,
  SETTINGS_SCHEMES,
  type SettingsAppearance,
  type SettingsCardStyle,
  type SettingsScheme,
} from "../types";

const SCHEME_LABELS: Record<SettingsScheme, string> = {
  "sunken-nav": "Sunken nav",
  "sunken-content": "Sunken content",
  "card-panel": "Card panel",
  drawer: "Drawer",
};

const CARD_LABELS: Record<SettingsCardStyle, string> = {
  outline: "Outline",
  surface: "Surface",
  divider: "Divider",
};

function OptionGrid<T extends string>({
  value,
  options,
  labels,
  columns,
  onChange,
}: {
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  columns: 2 | 3;
  onChange: (value: T) => void;
}) {
  return (
    <div className={cn("grid gap-1 rounded-lg bg-[var(--color-state-press)] p-1", columns === 2 ? "grid-cols-2" : "grid-cols-3")}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-md px-2 py-1 text-[12px] font-medium transition-colors",
            value === option
              ? "bg-[var(--color-bg-base)] text-[var(--color-text-primary)] shadow-sm"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
          )}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}

function PanelToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}

/**
 * The floating axis switcher — the settings pattern's "Make them yours".
 * Flips the three appearance axes and the theme live on the frame above.
 */
export function ConfigPanel({
  appearance,
  setAppearance,
  dark,
  setDark,
}: {
  appearance: SettingsAppearance;
  setAppearance: (next: SettingsAppearance) => void;
  dark: boolean;
  setDark: (dark: boolean) => void;
}) {
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
            className="w-[272px] overflow-hidden rounded-2xl bg-[var(--color-bg-base)] text-[var(--color-text-primary)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-3">
              <span className="flex items-center gap-2 text-[13px] font-semibold">
                <Icon name="sliders" size="sm" /> Frame the settings
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Collapse"
                className="grid size-6 place-items-center rounded-md text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-state-hover)] hover:text-[var(--color-text-primary)]"
              >
                <Icon name="x" className="size-3" />
              </button>
            </div>

            <div className="space-y-5 p-4">
              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Background hierarchy
                </div>
                <OptionGrid
                  value={appearance.scheme}
                  options={SETTINGS_SCHEMES}
                  labels={SCHEME_LABELS}
                  columns={2}
                  onChange={(scheme) => setAppearance({ ...appearance, scheme })}
                />
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Card style
                </div>
                <OptionGrid
                  value={appearance.card}
                  options={SETTINGS_CARD_STYLES}
                  labels={CARD_LABELS}
                  columns={3}
                  onChange={(card) => setAppearance({ ...appearance, card })}
                />
              </div>

              <div className="space-y-3 border-t border-[var(--color-border-subtle)] pt-4">
                <PanelToggle
                  label="Nav icons"
                  checked={appearance.navIcons}
                  onChange={(navIcons) => setAppearance({ ...appearance, navIcons })}
                />
                <PanelToggle label="Dark theme" checked={dark} onChange={setDark} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.3 }}
            style={{ boxShadow: "var(--shadow-panel)" }}
            onClick={() => setOpen(true)}
            aria-label="Open frame controls"
            className="grid size-11 place-items-center rounded-full bg-[var(--color-bg-base)] text-[var(--color-text-primary)]"
          >
            <Icon name="sliders" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
