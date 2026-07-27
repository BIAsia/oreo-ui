import { useCallback, useEffect, useRef, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type { BoardState, Task } from "./types";
import { SEED } from "./seed";

const STORAGE_KEY = "oreo-onboarding-board";

function load(): BoardState {
  if (typeof localStorage === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as BoardState;
    if (!parsed?.columns || !parsed?.tasks) return SEED;
    return parsed;
  } catch {
    return SEED;
  }
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Board state + CRUD, persisted to localStorage. Drag moves are applied here
 * too: `moveTask` handles both same-column reorder and cross-column transfer.
 */
export function useBoard() {
  const [state, setState] = useState<BoardState>(load);

  // Persist on every change (skip the very first run to avoid a redundant write).
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [state]);

  const addTask = useCallback((columnId: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setState((s) => {
      const id = uid();
      const task: Task = { id, title: trimmed };
      return {
        tasks: { ...s.tasks, [id]: task },
        columns: s.columns.map((c) =>
          c.id === columnId ? { ...c, taskIds: [...c.taskIds, id] } : c,
        ),
      };
    });
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setState((s) => ({
      ...s,
      tasks: { ...s.tasks, [id]: { ...s.tasks[id], ...patch } },
    }));
  }, []);

  const removeTask = useCallback((id: string) => {
    setState((s) => {
      const tasks = { ...s.tasks };
      delete tasks[id];
      return {
        tasks,
        columns: s.columns.map((c) => ({
          ...c,
          taskIds: c.taskIds.filter((t) => t !== id),
        })),
      };
    });
  }, []);

  /** Find which column a task currently lives in. */
  const columnOf = useCallback(
    (taskId: string) => state.columns.find((c) => c.taskIds.includes(taskId))?.id,
    [state.columns],
  );

  /**
   * Move `taskId` so it lands in `toColumn` at the slot currently held by
   * `overId` (a task id) — or at the end when `overId` is the column itself.
   */
  const moveTask = useCallback((taskId: string, toColumn: string, overId: string) => {
    setState((s) => {
      const fromColumn = s.columns.find((c) => c.taskIds.includes(taskId));
      if (!fromColumn) return s;
      const dest = s.columns.find((c) => c.id === toColumn);
      if (!dest) return s;

      // Same column → reorder.
      if (fromColumn.id === dest.id) {
        const from = fromColumn.taskIds.indexOf(taskId);
        const to = overId === dest.id ? fromColumn.taskIds.length - 1 : dest.taskIds.indexOf(overId);
        if (from === to || to < 0) return s;
        const reordered = arrayMove(fromColumn.taskIds, from, to);
        return {
          ...s,
          columns: s.columns.map((c) => (c.id === fromColumn.id ? { ...c, taskIds: reordered } : c)),
        };
      }

      // Cross column → remove from source, insert into dest at the over slot.
      const insertAt = overId === dest.id ? dest.taskIds.length : Math.max(0, dest.taskIds.indexOf(overId));
      const destIds = [...dest.taskIds];
      destIds.splice(insertAt, 0, taskId);
      return {
        ...s,
        columns: s.columns.map((c) => {
          if (c.id === fromColumn.id) return { ...c, taskIds: c.taskIds.filter((t) => t !== taskId) };
          if (c.id === dest.id) return { ...c, taskIds: destIds };
          return c;
        }),
      };
    });
  }, []);

  const reset = useCallback(() => setState(SEED), []);

  return { state, addTask, updateTask, removeTask, moveTask, columnOf, reset };
}
