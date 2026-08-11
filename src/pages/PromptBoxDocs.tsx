import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Sparkle } from "@phosphor-icons/react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";
import { Chip, ChipGroup } from "@/components/chip";
import { Attachment, AttachmentBar, type AttachmentType } from "@/components/attachment";
import { MenuItem, MenuPopup, MenuSeparator, MenuSubmenu, MenuSubmenuTrigger } from "@/components/menu";
import { PromptBox, PromptBoxModelSelect, KeywordTag } from "@/components/prompt-box";
import type { SpringProps } from "@/docs/DocsPage";
import openaiLogo from "@/components/prompt-box/assets/openai.svg";
import claudeLogo from "@/components/prompt-box/assets/claude-color.svg";
import googleLogo from "@/components/prompt-box/assets/google-color.svg";
import figmaLogo from "@/components/prompt-box/assets/figma-color.svg";

const TOC: TocItem[] = [
  { id: "prompt-box", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "input", label: "Input" },
  { id: "attachments", label: "Attachments" },
  { id: "keyword-tags", label: "Keyword tags" },
  { id: "voice", label: "Voice input" },
  { id: "model-select", label: "Model select" },
  { id: "add-ons", label: "Add-ons" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "value / defaultValue", type: "string", desc: "Controlled or uncontrolled input text." },
  { prop: "onValueChange", type: "(value: string) => void", desc: "Fires on every keystroke." },
  { prop: "onSubmit", type: "(value: string) => void", desc: "Send button or Enter (without Shift)." },
  { prop: "running", type: "boolean", def: "false", desc: "Streaming state — the send button becomes a stop square and the empty hint reads “Continue asking...”." },
  { prop: "onStop", type: "() => void", desc: "Stop button press while running." },
  { prop: "placeholder", type: "ReactNode", desc: "Empty-state hint. Defaults to the “press / for commands” row." },
  { prop: "attachments", type: "ReactNode", desc: "Row above the text — usually an <AttachmentBar>." },
  { prop: "tags", type: "ReactNode", desc: "Inline <KeywordTag> chips at the head of the first text line." },
  { prop: "modelSelect", type: "ReactNode", desc: "The model picker — usually a <PromptBoxModelSelect>." },
  { prop: "voice", type: '"wave" | "mic"', desc: "Voice add-on: wave replaces the send button, mic sits beside it." },
  { prop: "voiceStatus", type: '"idle" | "inputting" | "thinking"', def: '"idle"', desc: "Drives the wave button ↔ Stop pill ↔ Thinking pill." },
  { prop: "onAttach / onMention / onVoiceToggle", type: "() => void", desc: "Toolbar button callbacks." },
  { prop: "header / footer", type: "ReactNode", desc: "A <ContextBar> docked above or below; it tucks 16px under the card." },
  { prop: "inset", type: "boolean", def: "false", desc: "Indents docked bars by 12px (Figma “Is Inset”)." },
];

const FILLED =
  "Building a To-Do application requires a balance between simplicity for quick entries and enough structure to stay organized. Here is a comprehensive blueprint.";

function gradientThumb(from: string, to: string) {
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='72' height='72' fill='url(#g)'/></svg>`,
    )
  );
}
const IMG_THUMB = gradientThumb("#b3a5ef", "#5fd2e3");
const VIDEO_THUMB = gradientThumb("#f49ad2", "#ff9e57");

const brandImg = "[.theme-dark_&]:invert";

/** The Model Select dropdown content — see the Menu page for the primitive. */
function ModelMenu() {
  return (
    <>
      <MenuItem selected>Auto</MenuItem>
      <MenuItem>Use multiple models</MenuItem>
      <MenuSeparator />
      <MenuSubmenu>
        <MenuSubmenuTrigger icon={<img src={openaiLogo} alt="" className={brandImg} />}>OpenAI</MenuSubmenuTrigger>
        <MenuPopup side="right" align="start" sideOffset={8}>
          <MenuItem>GPT-5.2 Pro</MenuItem>
          <MenuItem>GPT-5.2</MenuItem>
          <MenuItem>GPT-5 mini</MenuItem>
        </MenuPopup>
      </MenuSubmenu>
      <MenuSubmenu>
        <MenuSubmenuTrigger icon={<img src={claudeLogo} alt="" />}>Anthropic</MenuSubmenuTrigger>
        <MenuPopup side="right" align="start" sideOffset={8}>
          <MenuItem selected>Claude Opus 4.5</MenuItem>
          <MenuItem>Claude Sonnet 4.5</MenuItem>
          <MenuItem>Claude Haiku 4.5</MenuItem>
        </MenuPopup>
      </MenuSubmenu>
      <MenuSubmenu>
        <MenuSubmenuTrigger icon={<img src={googleLogo} alt="" />}>Google</MenuSubmenuTrigger>
        <MenuPopup side="right" align="start" sideOffset={8}>
          <MenuItem>Gemini 3.1 Pro</MenuItem>
          <MenuItem>Gemini 3 Flash</MenuItem>
        </MenuPopup>
      </MenuSubmenu>
    </>
  );
}

function ClaudeSelect({ menu = false }: { menu?: boolean }) {
  return (
    <PromptBoxModelSelect
      icon={<img src={claudeLogo} alt="" />}
      label="Claude"
      menu={menu ? <ModelMenu /> : undefined}
    />
  );
}

const ATTACH_FILES = [
  { id: 1, type: "image" as AttachmentType, label: "Image.jpg" },
  { id: 2, type: "video" as AttachmentType, label: "Video.mp4" },
  { id: 3, type: "doc" as AttachmentType, label: "Draft.pdf" },
  { id: 4, type: "text" as AttachmentType, label: "ReadMe.txt" },
];

function srcFor(type: AttachmentType) {
  return type === "image" ? IMG_THUMB : type === "video" ? VIDEO_THUMB : undefined;
}

/** A PromptBox with a live attachment bar: hover a chip for the ×, click to
 * spring it out; when the last one goes the whole row collapses away. */
function AttachmentsDemo({ spring, labeled = false, size = "md" }: { spring: SpringProps; labeled?: boolean; size?: "md" | "sm" }) {
  const [files, setFiles] = useState(ATTACH_FILES);
  const chipSpring = { type: "spring", bounce: 0.3, duration: 0.35 } as const;
  return (
    <div className="flex w-full flex-col items-start gap-[var(--space-x4)]">
      <PromptBox
        defaultValue={FILLED}
        attachments={
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div key="bar" exit={{ opacity: 0, height: 0 }} transition={chipSpring} className="w-full overflow-hidden">
                <AttachmentBar>
                  <AnimatePresence>
                    {files.map((f) => (
                      <motion.div
                        key={f.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={chipSpring}
                      >
                        <Attachment
                          size={size}
                          type={f.type}
                          src={srcFor(f.type)}
                          label={labeled ? f.label : undefined}
                          onRemove={() => setFiles((p) => p.filter((x) => x.id !== f.id))}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </AttachmentBar>
              </motion.div>
            )}
          </AnimatePresence>
        }
        modelSelect={<ClaudeSelect />}
        {...spring}
      />
      {files.length === 0 && (
        <Button type="secondary" size="sm" onClick={() => setFiles(ATTACH_FILES)}>
          Reset
        </Button>
      )}
    </div>
  );
}

function VoiceWaveDemo({ spring }: { spring: SpringProps }) {
  const [status, setStatus] = useState<"idle" | "inputting">("idle");
  return (
    <PromptBox
      defaultValue={FILLED}
      voice="wave"
      voiceStatus={status}
      onVoiceToggle={() => setStatus((s) => (s === "idle" ? "inputting" : "idle"))}
      modelSelect={<ClaudeSelect />}
      {...spring}
    />
  );
}

function VoiceMicDemo({ spring }: { spring: SpringProps }) {
  const [status, setStatus] = useState<"idle" | "inputting">("idle");
  return (
    <PromptBox
      voice="mic"
      voiceStatus={status}
      onVoiceToggle={() => setStatus((s) => (s === "idle" ? "inputting" : "idle"))}
      modelSelect={<ClaudeSelect />}
      {...spring}
    />
  );
}

const INPUT_CODE = `import { PromptBox, PromptBoxModelSelect } from "@/components/prompt-box";

<PromptBox modelSelect={<PromptBoxModelSelect icon={…} label="Claude" menu={…} />} />
<PromptBox defaultValue="Building a To-Do application…" onSubmit={send} />
<PromptBox running onStop={stop} />`;

const ATTACH_CODE = `<PromptBox
  defaultValue="…"
  attachments={
    <AttachmentBar>
      {files.map((f) => (
        <Attachment
          key={f.id}
          type={f.type}
          src={f.src}
          label={f.label}
          onRemove={() => remove(f.id)}
        />
      ))}
    </AttachmentBar>
  }
/>`;

const TAGS_CODE = `<PromptBox
  defaultValue="…"
  tags={<KeywordTag icon={<img src={figmaLogo} alt="" />}>Figma</KeywordTag>}
/>

<PromptBox
  defaultValue="…"
  tags={
    <KeywordTag color="purple" icon={<Icon icon={Sparkle} weight="fill" />}>
      Create Image
    </KeywordTag>
  }
/>`;

const VOICE_CODE = `// Type A — the wave button replaces send; tap to talk, tap to stop
<PromptBox voice="wave" voiceStatus={status} onVoiceToggle={toggle} />
<PromptBox voice="wave" voiceStatus="thinking" />

// Type B — a quiet mic beside the send button
<PromptBox voice="mic" voiceStatus={status} onVoiceToggle={toggle} />`;

const ADDONS_CODE = `<div className="flex w-full flex-col gap-[var(--space-x4)]">
  <ChipGroup>
    <Chip icon={<Icon icon={Sparkle} />}>Summarize this page</Chip>
    <Chip icon={<Icon icon={Sparkle} />}>Debug my code</Chip>
  </ChipGroup>
  <PromptBox … />
</div>`;

export function PromptBoxDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Prompt Box"]} nav={nav}>
      {({ spring }) => (
        <>
          <header id="prompt-box" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Prompt Box</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              A multi-state input component for agent conversations. The card adapts its controls to
              the interaction state — empty, filled, running — and hosts attachments, keyword tags,
              voice input, and the model picker without owning any of them.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add prompt-box\n# or copy src/components/prompt-box/* by hand`} />
          </Section>

          <Section
            id="input"
            title="Input"
            description="Empty shows the slash-command hint; typing arms the send button; running swaps it for a stop square and hints “Continue asking...”."
          >
            <PreviewTabs
              code={INPUT_CODE}
              preview={
                <div className="flex w-full flex-col items-start gap-6">
                  <PromptBox modelSelect={<ClaudeSelect menu />} {...spring} />
                  <PromptBox defaultValue={FILLED} modelSelect={<ClaudeSelect menu />} {...spring} />
                  <PromptBox running modelSelect={<ClaudeSelect menu />} {...spring} />
                </div>
              }
            />
          </Section>

          <Section
            id="attachments"
            title="Attachments"
            description="An Attachment Bar docks above the text: preview squares for tight rows, labeled chips when the filename matters, small labels for dense surfaces. Hover a chip for its × — removing the last one collapses the row."
          >
            <PreviewTabs
              code={ATTACH_CODE}
              preview={
                <div className="flex w-full flex-col items-start gap-6">
                  <AttachmentsDemo spring={spring} />
                  <AttachmentsDemo spring={spring} labeled />
                  <AttachmentsDemo spring={spring} labeled size="sm" />
                </div>
              }
            />
          </Section>

          <Section
            id="keyword-tags"
            title="Keyword tags"
            description="Inline chips at the head of the first line — a source context (“Figma”) or a generative keyword (“Create Image”). The text wraps around them."
          >
            <PreviewTabs
              code={TAGS_CODE}
              preview={
                <div className="flex w-full flex-col items-start gap-6">
                  <PromptBox
                    defaultValue={`Building a To-Do application requires a balance between simplicity for quick entries and stay organized. Here is a comprehensive blueprint for the app's architecture and logic.`}
                    tags={<KeywordTag icon={<img src={figmaLogo} alt="" />}>Figma</KeywordTag>}
                    modelSelect={<ClaudeSelect />}
                    {...spring}
                  />
                  <PromptBox
                    defaultValue={`Building a To-Do application requires a balance between simplicity for quick entries and stay organized. Here is a comprehensive blueprint for the app's architecture and logic.`}
                    tags={
                      <KeywordTag color="purple" icon={<Icon icon={Sparkle} weight="fill" />}>
                        Create Image
                      </KeywordTag>
                    }
                    modelSelect={<ClaudeSelect />}
                    {...spring}
                  />
                </div>
              }
            />
          </Section>

          <Section
            id="voice"
            title="Voice input"
            description="Type A replaces the send button with a wave button — tap to talk, the pill pulses while listening, and “Thinking” shimmers while the model works. Type B keeps a quiet mic beside send."
          >
            <PreviewTabs
              code={VOICE_CODE}
              preview={
                <div className="flex w-full flex-col items-start gap-6">
                  <VoiceWaveDemo spring={spring} />
                  <PromptBox defaultValue={FILLED} voice="wave" voiceStatus="thinking" modelSelect={<ClaudeSelect />} {...spring} />
                  <VoiceMicDemo spring={spring} />
                </div>
              }
            />
          </Section>

          <Section
            id="model-select"
            title="Model select"
            description="The “Claude ⌄” trigger opens the real dropdown — a Menu with provider submenus. See the Menu page for the primitive."
          >
            <PreviewTabs
              code={`<PromptBoxModelSelect icon={<img src={claudeLogo} alt="" />} label="Claude" menu={<ModelMenu />} />`}
              preview={<PromptBox modelSelect={<ClaudeSelect menu />} {...spring} />}
            />
          </Section>

          <Section
            id="add-ons"
            title="Add-ons"
            description="Contextual suggestion chips float above the card — prompts the agent thinks you might want next."
          >
            <PreviewTabs
              code={ADDONS_CODE}
              preview={
                <div className="flex w-full flex-col items-start gap-[var(--space-x4)]">
                  <ChipGroup>
                    <Chip icon={<Icon icon={Sparkle} />} {...spring}>
                      Summarize this page
                    </Chip>
                    <Chip icon={<Icon icon={Sparkle} />} {...spring}>
                      Debug my code
                    </Chip>
                  </ChipGroup>
                  <PromptBox modelSelect={<ClaudeSelect menu />} {...spring} />
                </div>
              }
            />
          </Section>

          <Section id="api" title="API Reference" description="PromptBox extends native <div> props. KeywordTag and PromptBoxModelSelect ship alongside.">
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
