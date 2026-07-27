import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { motion } from "motion/react";
import { Column } from "./Column";
import { CardBody } from "./TaskCard";
import { card } from "./board.variants";
import { useBoard } from "./useBoard";

export function Board() {
  const { state, addTask, updateTask, removeTask, moveTask, columnOf } = useBoard();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  /** Resolve the column id for a drop target (a task id or a column id). */
  const columnForOver = (overId: string) =>
    state.columns.some((c) => c.id === overId) ? overId : columnOf(overId);

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  // Live cross-column transfer so the placeholder follows the cursor.
  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const activeCol = columnOf(String(active.id));
    const overCol = columnForOver(String(over.id));
    if (!activeCol || !overCol || activeCol === overCol) return;
    moveTask(String(active.id), overCol, String(over.id));
  }

  // Final same-column reorder.
  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const overCol = columnForOver(String(over.id));
    if (overCol) moveTask(String(active.id), overCol, String(over.id));
  }

  const activeTask = activeId ? state.tasks[activeId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {state.columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={state.tasks}
            onAdd={(title) => addTask(col.id, title)}
            onPatch={updateTask}
            onRemove={removeTask}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 220, easing: "cubic-bezier(0.18, 0.89, 0.32, 1.28)" }}>
        {activeTask && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.03 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.3 }}
            className={card({ overlay: true }) + " w-72"}
          >
            <CardBody task={activeTask} />
          </motion.div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
