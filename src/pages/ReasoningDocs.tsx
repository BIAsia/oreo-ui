import { useEffect, useRef, useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Reasoning, ReasoningStep } from "@/components/reasoning";
import { Button } from "@/components/button";

const TOC: TocItem[] = [
  { id: "reasoning", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "streaming", label: "Streaming" },
  { id: "resting", label: "Resting" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "streaming", type: "boolean", def: "false", desc: "Shimmers the caption and pulses the newest step dot." },
  { prop: "activeLabel", type: "ReactNode", def: `"Thinking"`, desc: "In-progress caption." },
  { prop: "label", type: "ReactNode", def: `"Thought process"`, desc: "Resting summary — e.g. \"Thought for 8s\"." },
  { prop: "elapsed", type: "string", desc: "Timer text next to the in-progress caption." },
  { prop: "open / defaultOpen", type: "boolean", desc: "Controlled / uncontrolled disclosure." },
  { prop: "ReasoningStep", type: "{ title, active? }", desc: "One thought in the timeline; body as children." },
];

const STEPS = [
  { title: "Reading the stack trace", body: "The null deref happens in the reducer, not the component — the action payload is already missing `id`." },
  { title: "Tracing the dispatch site", body: "Only one caller omits `id`: the optimistic update in `useCreateItem`." },
  { title: "Choosing a fix", body: "Validate at the dispatch boundary rather than defending in the reducer — one owner for the invariant." },
] as const;

const CODE_STREAMING = `import { Reasoning, ReasoningStep } from "@/components/reasoning";

<Reasoning streaming={streaming} elapsed={\`\${seconds}s\`} label={\`Thought for \${total}s\`} defaultOpen>
  {steps.map((step, i) => (
    <ReasoningStep key={i} title={step.title} active={streaming && i === steps.length - 1}>
      {step.body}
    </ReasoningStep>
  ))}
</Reasoning>`;

function StreamingDemo() {
  const [visible, setVisible] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const timers = useRef<number[]>([]);

  const play = () => {
    timers.current.forEach((t) => window.clearInterval(t));
    setVisible(0);
    setSeconds(0);
    const stepTimer = window.setInterval(() => {
      setVisible((v) => {
        if (v >= STEPS.length) {
          timers.current.forEach((t) => window.clearInterval(t));
          return v;
        }
        return v + 1;
      });
    }, 1400);
    const clock = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    timers.current = [stepTimer, clock];
  };

  useEffect(() => {
    play();
    return () => timers.current.forEach((t) => window.clearInterval(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const streaming = visible < STEPS.length;
  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-3">
      <Reasoning
        streaming={streaming}
        elapsed={`${seconds}s`}
        label={`Thought for ${seconds}s`}
        defaultOpen
      >
        {STEPS.slice(0, Math.max(visible, 1)).map((step, i) => (
          <ReasoningStep key={step.title} title={step.title} active={streaming && i === visible - 1}>
            {step.body}
          </ReasoningStep>
        ))}
      </Reasoning>
      <Button type="secondary" size="sm" onClick={play} disabled={streaming}>
        Replay
      </Button>
    </div>
  );
}

export function ReasoningDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Reasoning"]} nav={nav}>
      {() => (
        <>
          <header id="reasoning" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Reasoning</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              The thinking disclosure. A shimmered “Thinking” caption with a live timer while thoughts
              stream in as a dotted timeline, width-morphing into a resting summary when done. Closed by
              default in real transcripts — reasoning is a peek, not the main content.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add reasoning\n# or copy src/components/reasoning/* by hand`} />
          </Section>

          <Section
            id="streaming"
            title="Streaming"
            description="Steps fade in as they arrive; the newest dot pulses. When streaming ends, the caption swaps to the summary."
          >
            <PreviewTabs code={CODE_STREAMING} preview={<StreamingDemo />} />
          </Section>

          <Section id="resting" title="Resting" description="After the fact: a quiet summary line that opens on demand.">
            <PreviewTabs
              code={`<Reasoning label="Thought for 6s">…</Reasoning>`}
              preview={
                <div className="w-full max-w-xl">
                  <Reasoning label="Thought for 6s">
                    {STEPS.map((step) => (
                      <ReasoningStep key={step.title} title={step.title}>
                        {step.body}
                      </ReasoningStep>
                    ))}
                  </Reasoning>
                </div>
              }
            />
          </Section>

          <Section id="api" title="API Reference">
            <PropsTable rows={PROPS} />
          </Section>

          <footer className="border-t border-[var(--color-border-subtle)] py-8 text-[12px] text-[var(--color-text-secondary)]">
            Oreo UI — Base UI · tailwind-variants · Motion. Built as a design-system reference.
          </footer>
        </>
      )}
    </DocsPage>
  );
}
