import { useEffect, useRef, useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { WebSearch, WebSearchResult } from "@/components/web-search";
import { Button } from "@/components/button";

const TOC: TocItem[] = [
  { id: "web-search", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "streaming", label: "Streaming" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "query", type: "string", desc: "The search, shown as a pill." },
  { prop: "searching", type: "boolean", def: "false", desc: "Shimmers the status while results stream." },
  { prop: "summary", type: "ReactNode", desc: "Resting status — \"Read 3 sources\"." },
  { prop: "WebSearchResult", type: "{ domain, title, …<a> }", desc: "One result row — favicon letter, title, mono domain. Renders an anchor." },
];

const RESULTS = [
  { domain: "react.dev", title: "useSyncExternalStore – React Reference" },
  { domain: "web.dev", title: "Optimize long tasks: how to schedule work" },
  { domain: "github.com", title: "reactwg/react-18: useSES discussion" },
] as const;

const CODE = `import { WebSearch, WebSearchResult } from "@/components/web-search";

<WebSearch query="react external store subscription" searching={searching} summary="Read 3 sources">
  {results.map((r) => (
    <WebSearchResult key={r.domain} domain={r.domain} title={r.title} href={r.href} />
  ))}
</WebSearch>`;

function Demo() {
  const [visible, setVisible] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const play = () => {
    window.clearInterval(timer.current);
    setVisible(0);
    timer.current = window.setInterval(() => {
      setVisible((v) => {
        if (v >= RESULTS.length) {
          window.clearInterval(timer.current);
          return v;
        }
        return v + 1;
      });
    }, 900);
  };

  useEffect(() => {
    play();
    return () => window.clearInterval(timer.current);
  }, []);

  const searching = visible < RESULTS.length;
  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-3">
      <WebSearch
        query="react external store subscription"
        searching={searching}
        summary={`Read ${RESULTS.length} sources`}
      >
        {RESULTS.slice(0, visible).map((r) => (
          <WebSearchResult key={r.domain} domain={r.domain} title={r.title} href={`https://${r.domain}`} />
        ))}
      </WebSearch>
      <Button type="secondary" size="sm" onClick={play} disabled={searching}>
        Replay
      </Button>
    </div>
  );
}

export function WebSearchDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Web Search"]} nav={nav}>
      {() => (
        <>
          <header id="web-search" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Web Search</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              The search tool run rendered richly: query pill, shimmered status that swaps to a
              summary, and result rows fading in as they land. Use Tool Call for the generic collapsed
              variant; use this when search is a first-class beat in the transcript.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add web-search\n# or copy src/components/web-search/* by hand`} />
          </Section>

          <Section id="streaming" title="Streaming" description="Rows land one by one; the status swaps from Searching to the summary.">
            <PreviewTabs code={CODE} preview={<Demo />} />
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
