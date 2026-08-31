import * as React from "react";
import { DEFAULT_SETTINGS_APPEARANCE, type SettingsAppearance } from "./types";

/**
 * The three axes flow down through context so rows, cards and the nav can
 * restyle themselves without prop-drilling — `SettingsShell` provides it,
 * everything below reads it.
 */
const SettingsAppearanceContext = React.createContext<SettingsAppearance>(DEFAULT_SETTINGS_APPEARANCE);

export function SettingsAppearanceProvider({
  value,
  children,
}: {
  value: SettingsAppearance;
  children: React.ReactNode;
}) {
  return <SettingsAppearanceContext.Provider value={value}>{children}</SettingsAppearanceContext.Provider>;
}

export function useSettingsAppearance() {
  return React.useContext(SettingsAppearanceContext);
}
