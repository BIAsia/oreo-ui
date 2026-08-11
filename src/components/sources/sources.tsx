import * as React from "react";
import { Collapsible } from "@base-ui-components/react/collapsible";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { sources } from "./sources.variants";

const SourcesContext = React.createContext<ReturnType<typeof sources> | null>(null);

export type SourcesProps = {
  /** Trigger label. */
  label?: React.ReactNode;
  /** Shown next to the label; defaults to the number of Source children. */
  count?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
};

export function Sources({
  label = "Sources",
  count,
  defaultOpen,
  open,
  onOpenChange,
  className,
  children,
}: SourcesProps) {
  const slots = sources();
  const resolvedCount = count ?? React.Children.count(children);
  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cn(slots.root(), className)}
    >
      <Collapsible.Trigger className={slots.trigger()}>
        <span>{label}</span>
        <span className={slots.count()}>{resolvedCount}</span>
        <Icon name="chevron-down" weight="bold" aria-hidden className={slots.chevron()} />
      </Collapsible.Trigger>
      <Collapsible.Panel className={slots.panel()}>
        <SourcesContext.Provider value={slots}>
          <div className={slots.grid()}>{children}</div>
        </SourcesContext.Provider>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

export type SourceProps = {
  /** Display domain — also seeds the favicon letter. */
  domain: string;
  title: React.ReactNode;
  /** Custom favicon content; defaults to the domain's first letter. */
  icon?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<"a">, "title">;

export function Source({ domain, title, icon, className, ...rest }: SourceProps) {
  const slots = React.useContext(SourcesContext);
  if (!slots) throw new Error("<Source> must be used inside <Sources>");
  return (
    <a target="_blank" rel="noreferrer" className={cn(slots.card(), className)} {...rest}>
      <span className={slots.cardHeader()}>
        <span aria-hidden className={slots.favicon()}>
          {icon ?? domain.charAt(0).toUpperCase()}
        </span>
        <span className={slots.domain()}>{domain}</span>
      </span>
      <span className={slots.title()}>{title}</span>
    </a>
  );
}
