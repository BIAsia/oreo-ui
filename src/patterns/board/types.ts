import type { PaletteColor } from "@/lib/palette";

/** A single onboarding task. `tag` is one of the Oreo palette colors. */
export type Task = {
  id: string;
  title: string;
  note?: string;
  tag?: { label: string; color: PaletteColor };
  assignee?: string;
};

/** A column owns an ordered list of task ids. Columns are fixed (see seed). */
export type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

export type BoardState = {
  columns: Column[];
  tasks: Record<string, Task>;
};
