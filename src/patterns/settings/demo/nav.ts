import type { SettingsNavGroup } from "../types";

/** The showcase's nav — each page exercises a different slice of the row
 * vocabulary. "Account" is the link-out row. */
export const DEMO_NAV: SettingsNavGroup[] = [
  {
    title: "Personal",
    items: [
      { id: "general", label: "General", icon: "gear" },
      { id: "appearance", label: "Appearance", icon: "sun" },
      { id: "personalization", label: "Personalization", icon: "paintbrush" },
      { id: "pets", label: "Pets", icon: "smiley" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { id: "shortcuts", label: "Keyboard shortcuts", icon: "keyboard" },
      { id: "usage", label: "Usage & billing", icon: "gauge" },
      { id: "account", label: "Account", icon: "at", href: "https://oreo-ui-preview.vercel.app" },
    ],
  },
];

export type DemoPageId = "general" | "appearance" | "personalization" | "pets" | "shortcuts" | "usage";

export const DEFAULT_DEMO_PAGE: DemoPageId = "general";
