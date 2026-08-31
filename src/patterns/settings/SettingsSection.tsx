import * as React from "react";
import { cn } from "@/lib/cn";
import { useSettingsAppearance } from "./appearance";
import { settingsCard } from "./settings.variants";

/** Page title + optional intro (inline links inherit an underlined style). */
export function SettingsPageHeader({ title, description }: { title: string; description?: React.ReactNode }) {
  return (
    <header className="pl-4">
      <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-2 max-w-[60ch] text-[13px] leading-5 text-[var(--color-text-secondary)] [&_a]:font-medium [&_a]:text-[var(--color-text-primary)] [&_a]:underline [&_a]:underline-offset-2">
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
  return (
    <section className={className}>
      <div className="flex items-center justify-between gap-4 pl-4">
        <h2 className="text-[12px] font-medium text-[var(--color-text-placeholder)]">{title}</h2>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {description && (
        <p className="mt-1.5 max-w-[60ch] pl-4 text-[13px] leading-5 text-[var(--color-text-secondary)] [&_a]:font-medium [&_a]:text-[var(--color-text-primary)] [&_a]:underline [&_a]:underline-offset-2">
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
