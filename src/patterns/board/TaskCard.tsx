import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/cn";
import { Tag } from "@/components/tag";
import { Avatar } from "@/components/avatar";
import { IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { card } from "./board.variants";
import type { Task } from "./types";

type Editable = { onPatch: (patch: Partial<Task>) => void; onRemove: () => void };

/** Click-to-edit single-line field. Renders text until clicked, then an input. */
function InlineText({
  value,
  placeholder,
  onCommit,
  className,
  multiline,
}: {
  value: string;
  placeholder: string;
  onCommit: (next: string) => void;
  className?: string;
  multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className={cn(
          "w-full cursor-text rounded text-left outline-none hover:bg-[var(--color-state-hover)]",
          !value && "text-[var(--color-text-disabled)]",
          className,
        )}
      >
        {value || placeholder}
      </button>
    );
  }

  const Field = multiline ? "textarea" : "input";
  return (
    <Field
      autoFocus
      value={draft}
      rows={multiline ? 2 : undefined}
      onPointerDown={(e) => e.stopPropagation()}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        onCommit(draft.trim());
        setEditing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !(multiline && e.shiftKey)) {
          e.preventDefault();
          onCommit(draft.trim());
          setEditing(false);
        }
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
        }
      }}
      className={cn(
        "w-full resize-none rounded bg-transparent outline-none",
        "ring-1 ring-[var(--color-border-default)] focus:ring-[var(--color-text-primary)]",
        "px-1 py-0.5",
        className,
      )}
    />
  );
}

/** Visual card body — shared by the sortable card and the drag overlay. */
export function CardBody({ task, editable }: { task: Task; editable?: Editable }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-1">
        <Icon
          name="grip-vertical"
          size="sm"
          className="mt-0.5 shrink-0 text-[var(--color-text-disabled)]"
          aria-label="Drag handle"
        />
        {editable ? (
          <InlineText
            multiline
            value={task.title}
            placeholder="Untitled task"
            onCommit={(v) => editable.onPatch({ title: v || task.title })}
            className="text-[14px] font-medium leading-snug text-[var(--color-text-primary)]"
          />
        ) : (
          <span className="text-[14px] font-medium leading-snug">{task.title}</span>
        )}
      </div>

      {editable ? (
        <InlineText
          value={task.note ?? ""}
          placeholder="Add a note…"
          onCommit={(v) => editable.onPatch({ note: v || undefined })}
          className="text-[12.5px] leading-snug text-[var(--color-text-secondary)]"
        />
      ) : (
        task.note && <p className="text-[12.5px] leading-snug text-[var(--color-text-secondary)]">{task.note}</p>
      )}

      <div className="flex items-center justify-between">
        {task.tag ? (
          <Tag color={task.tag.color} className="text-[11px]">
            {task.tag.label}
          </Tag>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1">
          {task.assignee && <Avatar size="xs" name={task.assignee} />}
          {editable && (
            <IconButton
              aria-label="Delete task"
              type="tertiary"
              size="sm"
              danger
              icon={<Icon name="trash" size="sm" />}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={editable.onRemove}
              className="opacity-0 transition-opacity group-hover/card:opacity-100"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/** Sortable, draggable card. Click fields to edit inline; drag to move. */
export function TaskCard({
  task,
  onPatch,
  onRemove,
}: {
  task: Task;
  onPatch: (patch: Partial<Task>) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(card({ ghost: isDragging }), "cursor-grab touch-none")}
      {...attributes}
      {...listeners}
    >
      <CardBody task={task} editable={{ onPatch, onRemove }} />
    </div>
  );
}
