import { useState } from "react";
import { cn } from "@/lib/cn";

/* ------------------------------ Section ------------------------------ */
export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 border-t border-[var(--color-border-subtle)] py-10 first:border-t-0">
      <h2 className="group flex items-center gap-2 text-[20px] font-semibold tracking-tight">
        <a href={`#${id}`} className="hover:underline">
          {title}
        </a>
      </h2>
      {description && (
        <p className="mt-2 max-w-prose text-[14px] leading-6 text-[var(--color-text-secondary)]">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/* ----------------------------- CodeBlock ----------------------------- */
export function CodeBlock({ code, lang = "tsx" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-code-bg)] text-[var(--color-code-fg)]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-code-fg)]/50">{lang}</span>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          className="rounded-md px-2 py-0.5 text-[11px] text-[var(--color-code-fg)]/70 transition-colors hover:bg-white/10 hover:text-[var(--color-code-fg)]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-[1.6]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* --------------------------- PreviewTabs ----------------------------- */
export function PreviewTabs({ preview, code }: { preview: React.ReactNode; code: string }) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border-subtle)]">
      <div className="flex gap-1 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] p-1.5">
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-3 py-1 text-[12.5px] font-medium capitalize transition-colors",
              tab === t
                ? "bg-[var(--color-state-press)] text-[var(--color-text-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "preview" ? (
        <div className="preview-grid grid min-h-[180px] place-items-center bg-[var(--color-bg-base)] p-10">{preview}</div>
      ) : (
        <div className="p-1.5">
          <CodeBlock code={code} />
        </div>
      )}
    </div>
  );
}

/* ---------------------------- PropsTable ----------------------------- */
export type PropRow = { prop: string; type: string; def?: string; desc: string };

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)]">
      <table className="w-full border-collapse text-left text-[13px]">
        <thead>
          <tr className="bg-[var(--color-bg-base)] text-[var(--color-text-secondary)]">
            <th className="px-4 py-2.5 font-medium">Prop</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Default</th>
            <th className="px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.prop} className="border-t border-[var(--color-border-subtle)] align-top">
              <td className="px-4 py-2.5">
                <code className="rounded bg-[var(--color-state-press)] px-1.5 py-0.5 font-mono text-[12px]">{r.prop}</code>
              </td>
              <td className="px-4 py-2.5 font-mono text-[12px] text-[var(--color-text-secondary)]">{r.type}</td>
              <td className="px-4 py-2.5 font-mono text-[12px] text-[var(--color-text-secondary)]">{r.def ?? "—"}</td>
              <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------ Slider ------------------------------- */
export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="flex items-center gap-3 text-[13px]">
      <span className="w-20 text-[var(--color-text-secondary)]">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider flex-1"
      />
      <span className="w-14 text-right font-mono text-[12px] tabular-nums">
        {value}
        {suffix}
      </span>
    </label>
  );
}
