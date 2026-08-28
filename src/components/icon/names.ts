/**
 * The Oreo icon vocabulary.
 *
 * Names describe *meaning*, not any one library's naming scheme — Phosphor
 * calls it `CaretDown`, Lucide calls it `ChevronDown`, we call it
 * `chevron-down`. Call sites reference these names so the whole system can be
 * repointed at a different icon set without touching a single component.
 *
 * Adding an icon means adding it here plus in both glyph maps; the maps are
 * typed `Record<IconName, IconGlyph>`, so TypeScript fails the build until
 * every library has an answer for the new name.
 */
export const ICON_NAMES = [
  "align-left",
  "apple-logo",
  "arrow-down",
  "arrow-up",
  "at",
  "bell",
  "brain",
  "calendar",
  "camera",
  "chart-line",
  "chat",
  "check",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "circle-dashed",
  "copy",
  "corner-down-right",
  "ellipsis",
  "expand",
  "folder",
  "github-logo",
  "globe",
  "grip-vertical",
  "list-checks",
  "mic",
  "moon",
  "paintbrush",
  "paperclip",
  "pencil",
  "plane",
  "plug",
  "plus",
  "prohibit",
  "refresh",
  "reset",
  "search",
  "sliders",
  "sparkle",
  "spinner",
  "star",
  "sun",
  "thumbs-down",
  "thumbs-up",
  "trash",
  "warning-circle",
  "x",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
