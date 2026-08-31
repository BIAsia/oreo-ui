import type { IconName } from "@/components/icon";

/* ----------------------------------------------------------------------------
 * The three appearance axes. Together they express most mainstream settings
 * pages: ChatGPT desktop = sunken-nav + icons + outline, macOS System
 * Settings = sunken-content + icons + surface, Claude's modal = drawer +
 * no icons + divider, Linear/Vercel = sunken-content/base + no icons.
 * -------------------------------------------------------------------------- */

/** Which surface each region sits on — the background hierarchy. */
export const SETTINGS_SCHEMES = ["sunken-nav", "sunken-content", "card-panel", "drawer"] as const;
export type SettingsScheme = (typeof SETTINGS_SCHEMES)[number];

/** How a section's rows are boxed on the content surface. */
export const SETTINGS_CARD_STYLES = ["outline", "surface", "divider"] as const;
export type SettingsCardStyle = (typeof SETTINGS_CARD_STYLES)[number];

export type SettingsAppearance = {
  scheme: SettingsScheme;
  card: SettingsCardStyle;
  /** Leading 16px glyph on nav items. */
  navIcons: boolean;
};

export const DEFAULT_SETTINGS_APPEARANCE: SettingsAppearance = {
  scheme: "sunken-nav",
  card: "outline",
  navIcons: true,
};

/* ------------------------------- Navigation ------------------------------- */

export type SettingsNavItem = {
  id: string;
  label: string;
  icon?: IconName;
  /** External destination — renders a link-out row with a trailing arrow. */
  href?: string;
};

export type SettingsNavGroup = {
  /** Muted caption above the group. Omit for an untitled first group. */
  title?: string;
  items: SettingsNavItem[];
};
