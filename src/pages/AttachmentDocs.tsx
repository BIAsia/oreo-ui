import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Attachment, AttachmentList } from "@/components/attachment";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";
import { FileCsv, FilePdf } from "@phosphor-icons/react";

const TOC: TocItem[] = [
  { id: "attachment", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "removable", label: "Removable list" },
  { id: "states", label: "Uploading" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "name", type: "string", desc: "Filename, truncated." },
  { prop: "meta", type: "ReactNode", desc: "Caption under the name — \"PDF · 1.2 MB\"." },
  { prop: "src", type: "string", desc: "Image URL — renders a thumbnail instead of the file square." },
  { prop: "icon", type: "ReactNode", desc: "Custom file-square glyph." },
  { prop: "onRemove", type: "() => void", desc: "Shows the floating × on hover." },
  { prop: "uploading", type: "boolean", def: "false", desc: "Spinner over the thumb, dimmed info." },
];

const CODE = `import { Attachment, AttachmentList } from "@/components/attachment";

<AttachmentList>
  <Attachment name="brief.pdf" meta="PDF · 1.2 MB" icon={<Icon icon={FilePdf} size="sm" />} onRemove={…} />
  <Attachment name="hero.png" meta="PNG · 640 KB" src={url} onRemove={…} />
</AttachmentList>`;

const THUMB =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23b3a5ef'/><stop offset='1' stop-color='%235fd2e3'/></linearGradient></defs><rect width='72' height='72' fill='url(%23g)'/></svg>`,
  );

const INITIAL = [
  { id: 1, name: "brief.pdf", meta: "PDF · 1.2 MB", kind: "pdf" },
  { id: 2, name: "hero.png", meta: "PNG · 640 KB", kind: "img" },
  { id: 3, name: "metrics.csv", meta: "CSV · 18 KB", kind: "csv" },
];

function RemovableDemo() {
  const [files, setFiles] = useState(INITIAL);
  return (
    <div className="flex min-h-16 w-full max-w-xl flex-col items-start gap-3">
      <AttachmentList>
        <AnimatePresence>
          {files.map((f) => (
            <motion.div
              key={f.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.35 }}
            >
              <Attachment
                name={f.name}
                meta={f.meta}
                src={f.kind === "img" ? THUMB : undefined}
                icon={f.kind === "pdf" ? <Icon icon={FilePdf} size="sm" /> : f.kind === "csv" ? <Icon icon={FileCsv} size="sm" /> : undefined}
                onRemove={() => setFiles((p) => p.filter((x) => x.id !== f.id))}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </AttachmentList>
      {files.length === 0 && (
        <Button type="secondary" size="sm" onClick={() => setFiles(INITIAL)}>
          Reset
        </Button>
      )}
    </div>
  );
}

export function AttachmentDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Chat", "Attachment"]} nav={nav}>
      {() => (
        <>
          <header id="attachment" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Attachment</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              File chips for composers and messages: an image thumbnail or file-type square, name and
              meta, and a floating remove button on hover. Pairs with the Prompt Composer's attachment
              bar and with user messages carrying files.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add attachment\n# or copy src/components/attachment/* by hand`} />
          </Section>

          <Section id="removable" title="Removable list" description="Hover a chip for the ×; chips spring out and the row re-flows on removal.">
            <PreviewTabs code={CODE} preview={<RemovableDemo />} />
          </Section>

          <Section id="states" title="Uploading" description="While in flight: spinner over the thumb, dimmed text.">
            <PreviewTabs
              code={`<Attachment uploading name="recording.mov" meta="MOV · 82 MB" />`}
              preview={
                <AttachmentList>
                  <Attachment uploading name="recording.mov" meta="MOV · 82 MB" />
                  <Attachment name="done.pdf" meta="PDF · 300 KB" icon={<Icon icon={FilePdf} size="sm" />} />
                </AttachmentList>
              }
            />
          </Section>

          <Section id="api" title="API Reference" description="Attachment extends native <div> props. AttachmentList is a wrapping flex row.">
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
