import { cn } from "@/lib/cn";
import { OreoLogo } from "./OreoLogo";

type Item = { label: string; href?: string; soon?: boolean; active?: boolean };
type Group = { title: string; items: Item[] };

const NAV: Group[] = [
  {
    title: "Getting Started",
    items: [{ label: "Introduction", href: "#intro" }, { label: "Tokens", href: "#tokens" }],
  },
  {
    title: "Components",
    items: [
      { label: "Button", href: "#button", active: true },
      { label: "Icon Button", soon: true },
      { label: "Select", soon: true },
      { label: "Dialog", soon: true },
      { label: "Tooltip", soon: true },
    ],
  },
];

export function Sidebar() {
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
              {group.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.soon ? undefined : item.href}
                    aria-disabled={item.soon}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-2 py-1.5 text-[13px] transition-colors",
                      item.active
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
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
