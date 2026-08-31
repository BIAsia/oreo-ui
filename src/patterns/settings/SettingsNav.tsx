import * as React from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { useSettingsAppearance } from "./appearance";
import type { SettingsNavGroup, SettingsNavItem } from "./types";

/**
 * The settings nav rail: a search field that filters items live, grouped rows
 * with an optional leading glyph, and link-out rows for external destinations.
 * The icon column collapses smoothly when the `navIcons` axis turns off —
 * width and margin shrink together so the labels slide, not jump.
 */
export function SettingsNav({
  groups,
  active,
  onNavigate,
}: {
  groups: SettingsNavGroup[];
  active: string;
  onNavigate: (id: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();

  const visible = groups
    .map((group) => ({
      ...group,
      items: q ? group.items.filter((item) => item.label.toLowerCase().includes(q)) : group.items,
    }))
    .filter((group) => group.items.length > 0);

  return (
    <nav aria-label="Settings" className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-4">
      <label className="flex h-8 shrink-0 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--settings-hairline)] bg-[var(--settings-field-bg)] px-2.5 transition-colors duration-200 ease-out focus-within:border-[var(--color-border-default)]">
        <Icon name="search" size="sm" className="shrink-0 text-[var(--color-text-tertiary)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search settings…"
          className="w-full min-w-0 bg-transparent text-[13px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-placeholder)] [&::-webkit-search-cancel-button]:hidden"
        />
      </label>

      <div className="mt-2 min-h-0 flex-1 space-y-5 overflow-y-auto pt-2">
        {visible.map((group, i) => (
          <div key={group.title ?? i}>
            {group.title && (
              <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                {group.title}
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.id}>
                  <NavRow item={item} active={item.id === active} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="px-2 pt-1 text-[13px] text-[var(--color-text-tertiary)]">No matching settings</p>
        )}
      </div>
    </nav>
  );
}

function NavRow({
  item,
  active,
  onNavigate,
}: {
  item: SettingsNavItem;
  active: boolean;
  onNavigate: (id: string) => void;
}) {
  const { navIcons } = useSettingsAppearance();

  const className = cn(
    "flex w-full items-center rounded-[var(--radius-control)] px-2 py-1.5 text-left text-[13px] transition-colors",
    active
      ? "bg-[var(--color-state-press)] font-medium text-[var(--color-text-primary)]"
      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-state-hover)] hover:text-[var(--color-text-primary)]",
  );

  const glyph = (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center overflow-hidden transition-[width,margin-right,opacity] duration-200 ease-out motion-reduce:transition-none"
      style={{ width: navIcons ? 16 : 0, marginRight: navIcons ? 10 : 0, opacity: navIcons ? 1 : 0 }}
    >
      {item.icon && <Icon name={item.icon} size="sm" />}
    </span>
  );

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={cn(className, "group")}>
        {glyph}
        <span className="truncate">{item.label}</span>
        <Icon
          name="arrow-out"
          size="sm"
          className="ml-auto shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-150 ease-out group-hover:-translate-y-px group-hover:translate-x-px"
        />
      </a>
    );
  }

  return (
    <button type="button" aria-current={active ? "page" : undefined} onClick={() => onNavigate(item.id)} className={className}>
      {glyph}
      <span className="truncate">{item.label}</span>
    </button>
  );
}
