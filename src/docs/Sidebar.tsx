import { cn } from "@/lib/cn";
import { OreoLogo } from "./OreoLogo";
import type { DocsNav } from "./DocsPage";

type Item = { label: string; page?: string; soon?: boolean };
type Group = { title: string; items: Item[] };

const NAV: Group[] = [
  {
    title: "Getting Started",
    items: [{ label: "Introduction", soon: true }, { label: "Tokens", soon: true }],
  },
  {
    title: "Components",
    items: [
      { label: "Button", page: "button" },
      { label: "Icon Button", page: "icon-button" },
      { label: "Chip", page: "chip" },
      { label: "Tag", page: "tag" },
      { label: "Shortcut", page: "shortcut" },
      { label: "Avatar", page: "avatar" },
      { label: "Select", soon: true },
      { label: "Dialog", soon: true },
    ],
  },
  {
    title: "Patterns",
    items: [{ label: "Onboarding Board", page: "onboarding-board" }],
  },
];

export function Sidebar({ nav }: { nav: DocsNav }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 overflow-y-auto border-r border-[var(--color-border-subtle)] px-4 py-6 lg:block">
      <div className="flex items-center gap-2.5 px-2">
        <OreoLogo className="h-[15px] w-auto text-[var(--color-text-primary)]" />
        <span className="text-[15px] font-semibold tracking-tight">Oreo UI</span>
      </div>

      <nav className="mt-7 space-y-6">
        {NAV.map((group) => (
          <div key={group.title}>
            <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              {group.title}
            </div>
            <ul className="mt-2 space-y-0.5">
              {group.items.map((item) => {
                const active = item.page != null && item.page === nav.active;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      disabled={item.soon}
                      onClick={() => item.page && nav.onNavigate(item.page)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors",
                        active
                          ? "bg-[var(--color-state-press)] font-medium text-[var(--color-text-primary)]"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-state-hover)] hover:text-[var(--color-text-primary)]",
                        item.soon && "pointer-events-none opacity-50",
                      )}
                    >
                      {item.label}
                      {item.soon && (
                        <span className="rounded-full border border-[var(--color-border-default)] px-1.5 py-px text-[10px] font-normal">
                          soon
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
