import { useState, type CSSProperties } from "react";
import { DocsLayout } from "@/docs/DocsLayout";
import { Section, PreviewTabs, PropsTable, CodeBlock, type PropRow } from "@/docs/primitives";
import { CustomizePanel } from "@/docs/CustomizePanel";
import type { TocItem } from "@/docs/OnThisPage";
import { Button } from "@/components/button";
import { Paperclip, ChevronDown } from "@/components/button/icons";

const TOC: TocItem[] = [
  { id: "button", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "basic", label: "Basic" },
  { id: "variants", label: "Variants" },
  { id: "states", label: "States" },
  { id: "api", label: "API Reference" },
];

const TYPES = ["primary", "secondary", "tertiary"] as const;

const PROPS: PropRow[] = [
  { prop: "type", type: `"primary" | "secondary" | "tertiary"`, def: `"primary"`, desc: "Visual emphasis of the button." },
  { prop: "danger", type: "boolean", def: "false", desc: "Recolors the button with the error palette." },
  { prop: "disabled", type: "boolean", def: "false", desc: "Disables interaction and dims the fill." },
  { prop: "leadingIcon", type: "ReactNode", desc: "Icon rendered before the label." },
  { prop: "trailingIcon", type: "ReactNode", desc: "Icon rendered after the label." },
  { prop: "render", type: "useRender.RenderProp", desc: "Base UI render prop — swap the element for an <a>, router Link, etc." },
  { prop: "bounce", type: "number", def: "0.4", desc: "Press-spring bounciness (0 = no overshoot)." },
  { prop: "duration", type: "number", def: "0.3", desc: "Press-spring duration in seconds." },
  { prop: "tapScale", type: "number", def: "0.96", desc: "Scale applied while pressed." },
];

const CODE_BASIC = `import { Button } from "@/components/button";
import { Paperclip, ChevronDown } from "@/components/button/icons";

<Button leadingIcon={<Paperclip />} trailingIcon={<ChevronDown />}>
  Button
</Button>`;

const CODE_VARIANTS = `<Button type="primary">Button</Button>
<Button type="secondary">Button</Button>
<Button type="tertiary">Button</Button>
<Button type="primary" danger>Delete</Button>`;

const CODE_STATES = `{/* disabled */}
<Button disabled>Button</Button>

{/* polymorphic — render as a link, styling preserved */}
<Button render={<a href="/pricing" />}>Go to pricing</Button>`;

export function ButtonDocs() {
  const [dark, setDark] = useState(false);
  const [radius, setRadius] = useState(8);
  const [bounce, setBounce] = useState(0.4);
  const [duration, setDuration] = useState(0.3);
  const [tapScale, setTapScale] = useState(0.96);

  const spring = { bounce, duration, tapScale };
  const wrapStyle = { ["--radius-control" as string]: `${radius}px` } as CSSProperties;

  const Demo = ({ children }: { children?: React.ReactNode }) => (
    <Button leadingIcon={<Paperclip />} trailingIcon={<ChevronDown />} {...spring}>
      {children ?? "Button"}
    </Button>
  );

  return (
    <div className={dark ? "theme-dark min-h-screen bg-[var(--color-bg-elevated)]" : "min-h-screen"} style={wrapStyle}>
      <DocsLayout toc={TOC}>
        {/* Hero / Introduction */}
        <header id="button" className="scroll-mt-8">
          <h1 className="text-[32px] font-semibold tracking-tight">Button</h1>
          <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
            A compact, tappable control that pairs a short action label with an optional icon, helping users
            discover common tasks without typing. Built on Base UI&apos;s <code>useRender</code>, styled with
            tailwind-variants and design tokens, with a Motion spring on press.
          </p>
        </header>

        {/* Installation */}
        <Section id="installation" title="Installation" description="Copy the source into your project — no package to install, you own the code.">
          <CodeBlock lang="bash" code={`npx oreo-ui add button\n# or copy src/components/button/* by hand`} />
        </Section>

        {/* Basic */}
        <Section id="basic" title="Basic" description="A button with leading and trailing icons. Press it to feel the spring.">
          <PreviewTabs preview={<Demo />} code={CODE_BASIC} />
        </Section>

        {/* Variants */}
        <Section id="variants" title="Variants" description="Three emphasis levels, plus a danger flag that recolors any of them.">
          <PreviewTabs
            code={CODE_VARIANTS}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-3">
                {TYPES.map((t) => (
                  <Button key={t} type={t} {...spring}>
                    {t[0].toUpperCase() + t.slice(1)}
                  </Button>
                ))}
                <Button type="primary" danger {...spring}>
                  Delete
                </Button>
                <Button type="tertiary" danger {...spring}>
                  Remove
                </Button>
              </div>
            }
          />
        </Section>

        {/* States */}
        <Section id="states" title="States" description="Hover and press are Material-style state layers (a semi-transparent overlay). Disabled dims the fill; render lets the button become any element.">
          <PreviewTabs
            code={CODE_STATES}
            preview={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button {...spring}>Default</Button>
                <Button disabled {...spring}>
                  Disabled
                </Button>
                <Button type="secondary" disabled {...spring}>
                  Disabled
                </Button>
                <Button render={<a href="#button" />} type="secondary" {...spring}>
                  As link
                </Button>
              </div>
            }
          />
        </Section>

        {/* API Reference */}
        <Section id="api" title="API Reference" description="Button extends all native <button> props.">
          <PropsTable rows={PROPS} />
        </Section>

        <footer className="border-t border-[var(--color-border-subtle)] py-8 text-[12px] text-[var(--color-text-secondary)]">
          Oreo UI — Base UI · tailwind-variants · Motion. Built as a design-system reference.
        </footer>
      </DocsLayout>

      {/* Floating customization panel — drives every live preview on the page */}
      <CustomizePanel
        dark={dark}
        setDark={setDark}
        radius={radius}
        setRadius={setRadius}
        bounce={bounce}
        setBounce={setBounce}
        duration={duration}
        setDuration={setDuration}
        tapScale={tapScale}
        setTapScale={setTapScale}
      />
    </div>
  );
}
