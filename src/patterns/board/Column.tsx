import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { TaskCard } from "./TaskCard";
import { column } from "./board.variants";
import type { Column as ColumnType, Task } from "./types";

export function Column({
  column: col,
  tasks,
  onAdd,
  onPatch,
  onRemove,
}: {
  column: ColumnType;
  tasks: Record<string, Task>;
  onAdd: (title: string) => void;
  onPatch: (id: string, patch: Partial<Task>) => void;
  onRemove: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  const [draft, setDraft] = useState("");

  const commit = () => {
    if (draft.trim()) {
      onAdd(draft);
      setDraft("");
    }
  };

  return (
    <section ref={setNodeRef} className={column({ over: isOver })}>
      <header className="flex items-center justify-between px-3.5 pb-1 pt-3">
        <h2 className="text-[13px] font-semibold tracking-tight">{col.title}</h2>
        <span className="rounded-full bg-[var(--color-state-press)] px-2 py-0.5 text-[11px] tabular-nums text-[var(--color-text-secondary)]">
          {col.taskIds.length}
        </span>
      </header>

      <div className="flex min-h-2 flex-1 flex-col gap-2 px-2.5 pb-2">
        <SortableContext items={col.taskIds} strategy={verticalListSortingStrategy}>
          {col.taskIds.map((id) => (
            <TaskCard
              key={id}
              task={tasks[id]}
              onPatch={(patch) => onPatch(id, patch)}
              onRemove={() => onRemove(id)}
            />
          ))}
        </SortableContext>
      </div>

      <div className="px-2.5 pb-2.5 pt-1">
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-2 py-1.5",
            "text-[var(--color-text-secondary)] transition-colors",
            "focus-within:ring-1 focus-within:ring-[var(--color-border-default)]",
            "hover:bg-[var(--color-state-hover)]",
          )}
        >
          <Icon name="plus" size="sm" className="shrink-0" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
            }}
            onBlur={commit}
            placeholder="Add a task"
            className="w-full bg-transparent text-[13px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-disabled)]"
          />
        </div>
      </div>
    </section>
  );
}
