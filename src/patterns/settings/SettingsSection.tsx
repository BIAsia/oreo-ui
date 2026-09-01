import * as React from "react";
import { cn } from "@/lib/cn";
import { useSettingsAppearance } from "./appearance";
import { settingsCard } from "./settings.variants";

/**
 * Headings key off the text column, not the container edge: when rows sit
 * inside a padded card they indent 16px to meet the row text; in the divider
 * style rows are full-bleed, so the indent drops to zero.
 */
function useHeadingIndent() {
  const { card } = useSettingsAppearance();
  return card === "divider" ? "pl-0" : "pl-4";
}

/** Page title + optional intro (inline links inherit an underlined style). */
export function SettingsPageHeader({ title, description }: { title: string; description?: React.ReactNode }) {
  const indent = useHeadingIndent();
  return (
    <header className={cn("transition-[padding] duration-200 ease-out", indent)}>
      <h1 className="text-[22px] font-semibold">{title}</h1>
      {description && (
        <p className="mt-2 max-w-[60ch] text-[13px] leading-5 tracking-[0.01em] text-[var(--color-text-secondary)] [&_a]:font-medium [&_a]:text-[var(--color-text-primary)] [&_a]:underline [&_a]:underline-offset-2">
          {description}
        </p>
      )}
    </header>
  );
}

/**
 * A titled region of the page: heading, optional description, an optional
 * trailing action cluster, and whatever blocks follow — usually a
 * `SettingsCard`, sometimes an editor or a callout standing on its own.
 */
export function SettingsSection({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const indent = useHeadingIndent();
  return (
    <section className={className}>
      <div className={cn("flex items-center justify-between gap-4 transition-[padding] duration-200 ease-out", indent)}>
        <h2 className="text-[12px] font-medium text-[var(--color-text-placeholder)]">{title}</h2>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {description && (
        <p className={cn("mt-1.5 max-w-[60ch] text-[13px] leading-5 tracking-[0.01em] text-[var(--color-text-secondary)] transition-[padding] duration-200 ease-out [&_a]:font-medium [&_a]:text-[var(--color-text-primary)] [&_a]:underline [&_a]:underline-offset-2", indent)}>
          {description}
        </p>
      )}
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}

/**
 * The axis-C surface: rows go inside, and the card decides whether they read
 * as an outlined group, a filled group, or a bare run of divided rows. Row
 * hairlines are inset automatically in the boxed styles because the padding
 * lives on the card, not the rows.
 */
export function SettingsCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const { card } = useSettingsAppearance();
  return <div className={cn(settingsCard({ card }), className)}>{children}</div>;
}
