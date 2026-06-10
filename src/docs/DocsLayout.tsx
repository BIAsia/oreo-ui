import { Sidebar } from "./Sidebar";
import { OnThisPage, type TocItem } from "./OnThisPage";

export function DocsLayout({
  toc,
  children,
  themeClass,
}: {
  toc: TocItem[];
  children: React.ReactNode;
  themeClass?: string;
}) {
  return (
    <div className={themeClass}>
      <div className="mx-auto flex max-w-[1400px] gap-0 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-6 py-10 md:px-12">
          <div className="mx-auto max-w-2xl">
            <nav className="mb-6 text-[12px] text-[var(--color-text-secondary)]">
              Components <span className="px-1">/</span>{" "}
              <span className="text-[var(--color-text-primary)]">Button</span>
            </nav>
            {children}
          </div>
        </main>
        <OnThisPage items={toc} />
      </div>
    </div>
  );
}
