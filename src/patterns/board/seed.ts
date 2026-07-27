import type { BoardState } from "./types";

/**
 * Default board for a brand-new contributor. Seeds three fixed columns with a
 * real onboarding checklist for Oreo UI — edit these freely, your changes are
 * saved to localStorage and the seed is only used the first time.
 */
export const SEED: BoardState = {
  columns: [
    { id: "todo", title: "To do", taskIds: ["t1", "t2", "t3", "t4"] },
    { id: "doing", title: "In progress", taskIds: ["t5"] },
    { id: "done", title: "Done", taskIds: ["t6"] },
  ],
  tasks: {
    t1: {
      id: "t1",
      title: "Clone the repo & install deps",
      note: "pnpm install — Node 20+, pnpm 11+.",
      tag: { label: "setup", color: "blue" },
    },
    t2: {
      id: "t2",
      title: "Run the docs site locally",
      note: "pnpm dev, then open the printed localhost URL.",
      tag: { label: "setup", color: "blue" },
    },
    t3: {
      id: "t3",
      title: "Read the component conventions",
      note: "tailwind-variants in *.variants.ts, colors via tokens only, springs via motion.",
      tag: { label: "learn", color: "purple" },
    },
    t4: {
      id: "t4",
      title: "Pick a 'good first issue'",
      note: "Small scoped component or doc fix to get the workflow down.",
      tag: { label: "task", color: "orange" },
    },
    t5: {
      id: "t5",
      title: "Open your first PR",
      note: "Branch, commit, push, open a PR against main.",
      tag: { label: "task", color: "orange" },
    },
    t6: {
      id: "t6",
      title: "Join the team & say hi 👋",
      tag: { label: "done", color: "mint" },
    },
  },
};
