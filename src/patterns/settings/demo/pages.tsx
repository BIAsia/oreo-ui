import * as React from "react";
import { Avatar } from "@/components/avatar";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Shortcut } from "@/components/shortcut";
import { Switch } from "@/components/switch";
import { SettingsCard, SettingsPageHeader, SettingsSection } from "../SettingsSection";
import {
  SettingsCallout,
  SettingsEditor,
  SettingsEntityRow,
  SettingsLinkRow,
  SettingsMeterRow,
  SettingsRow,
  SettingsStatRow,
} from "../rows";
import { SettingsSelect, SettingsSegmented } from "../controls";
import type { SettingsAppearance, SettingsCardStyle, SettingsScheme } from "../types";
import type { DemoPageId } from "./nav";

/**
 * Showcase pages. Each one leans on a different slice of the vocabulary:
 * General = plain setting rows, Appearance = rows wired to the real frame,
 * Personalization = editor/callout/danger, Pets = entity picker,
 * Shortcuts = value rows, Usage = stat/meter/action rows.
 */

/** Live frame state, so demo rows can drive the thing you're looking at. */
export type DemoFrame = {
  appearance: SettingsAppearance;
  setAppearance: (next: SettingsAppearance) => void;
  dark: boolean;
  setDark: (dark: boolean) => void;
};

/* -------------------------------- General -------------------------------- */

function GeneralPage() {
  const [language, setLanguage] = React.useState("Auto detect");
  const [terminal, setTerminal] = React.useState<"Bottom" | "Right">("Bottom");
  const [speed, setSpeed] = React.useState("Standard");

  return (
    <>
      <SettingsPageHeader title="General" />
      <SettingsSection title="Permissions" className="mt-8">
        <SettingsCard>
          <SettingsRow
            title="Default permissions"
            description="Oreo can read and edit files in its workspace. It asks before touching anything else."
            control={<Switch defaultChecked aria-label="Default permissions" />}
          />
          <SettingsRow
            title="Auto-review"
            description="Requests for additional access are reviewed automatically. Auto-review can make mistakes."
            control={<Switch defaultChecked aria-label="Auto-review" />}
          />
          <SettingsRow
            title="Full access"
            description="Edit any file and run commands without approval. This significantly increases the risk of data loss."
            control={<Switch aria-label="Full access" />}
          />
        </SettingsCard>
      </SettingsSection>
      <SettingsSection title="General" className="mt-10">
        <SettingsCard>
          <SettingsRow
            title="Language"
            description="Language for the app UI"
            control={
              <SettingsSelect
                aria-label="Language"
                value={language}
                options={["Auto detect", "English", "中文", "日本語"]}
                onChange={setLanguage}
              />
            }
          />
          <SettingsRow
            title="Show in menu bar"
            description="Keep Oreo in the menu bar when the main window is closed"
            control={<Switch defaultChecked aria-label="Show in menu bar" />}
          />
          <SettingsRow
            title="Default terminal location"
            description="Where the terminal shortcut opens new tabs"
            control={
              <SettingsSegmented
                aria-label="Default terminal location"
                value={terminal}
                options={["Bottom", "Right"] as const}
                onChange={setTerminal}
              />
            }
          />
          <SettingsRow
            title="Prevent sleep while running"
            description="Keep the computer awake while a task is running"
            control={<Switch defaultChecked aria-label="Prevent sleep while running" />}
          />
          <SettingsRow
            title="Speed"
            description="Choose how quickly Oreo runs"
            control={
              <SettingsSelect
                aria-label="Speed"
                value={speed}
                options={["Standard", "Fast", "Turbo"]}
                onChange={setSpeed}
              />
            }
          />
          <SettingsLinkRow
            title="Manage account"
            description="Plans, sessions and security live on the web"
            href="https://oreo-ui-preview.vercel.app"
          />
        </SettingsCard>
      </SettingsSection>
    </>
  );
}

/* ------------------------------- Appearance ------------------------------- */

const SCHEME_LABELS: Record<SettingsScheme, string> = {
  "sunken-nav": "Sunken nav",
  "sunken-content": "Sunken content",
  "card-panel": "Card panel",
  drawer: "Drawer",
};
const CARD_LABELS: Record<SettingsCardStyle, string> = {
  outline: "Outline",
  surface: "Surface",
  divider: "Divider",
};

function labelToKey<K extends string>(labels: Record<K, string>, label: string): K {
  return (Object.keys(labels) as K[]).find((key) => labels[key] === label)!;
}

function AppearancePage({ frame }: { frame: DemoFrame }) {
  const { appearance, setAppearance, dark, setDark } = frame;
  const [font, setFont] = React.useState("Sans");
  const [density, setDensity] = React.useState<"Compact" | "Default" | "Cozy">("Default");

  return (
    <>
      <SettingsPageHeader
        title="Appearance"
        description="The rows below are wired to the frame you are looking at — this page configures itself."
      />
      <SettingsSection title="Theme" className="mt-8">
        <SettingsCard>
          <SettingsRow
            title="Interface theme"
            description="Skin every surface from the token layer"
            control={
              <SettingsSegmented
                aria-label="Interface theme"
                value={dark ? "Dark" : "Light"}
                options={["Light", "Dark"] as const}
                onChange={(v) => setDark(v === "Dark")}
              />
            }
          />
          <SettingsRow
            title="Chat font"
            description="Typeface for conversation text"
            control={
              <SettingsSelect aria-label="Chat font" value={font} options={["Sans", "Serif", "Mono"]} onChange={setFont} />
            }
          />
          <SettingsRow
            title="Text size"
            description="Row density across the app"
            control={
              <SettingsSegmented
                aria-label="Text size"
                value={density}
                options={["Compact", "Default", "Cozy"] as const}
                onChange={setDensity}
              />
            }
          />
        </SettingsCard>
      </SettingsSection>
      <SettingsSection title="Navigation & panels" className="mt-10">
        <SettingsCard>
          <SettingsRow
            title="Show icons in the sidebar"
            description="A leading glyph on every nav item"
            control={
              <Switch
                aria-label="Show icons in the sidebar"
                checked={appearance.navIcons}
                onCheckedChange={(navIcons) => setAppearance({ ...appearance, navIcons })}
              />
            }
          />
          <SettingsRow
            title="Background hierarchy"
            description="Which surface the nav and the content panel sit on"
            control={
              <SettingsSelect
                aria-label="Background hierarchy"
                value={SCHEME_LABELS[appearance.scheme]}
                options={Object.values(SCHEME_LABELS)}
                onChange={(label) => setAppearance({ ...appearance, scheme: labelToKey(SCHEME_LABELS, label) })}
              />
            }
          />
          <SettingsRow
            title="Card style"
            description="How groups of rows are boxed on the content panel"
            control={
              <SettingsSelect
                aria-label="Card style"
                value={CARD_LABELS[appearance.card]}
                options={Object.values(CARD_LABELS)}
                onChange={(label) => setAppearance({ ...appearance, card: labelToKey(CARD_LABELS, label) })}
              />
            }
          />
        </SettingsCard>
      </SettingsSection>
    </>
  );
}

/* ----------------------------- Personalization ---------------------------- */

const INSTRUCTIONS_SEED = `## Working notes

Prefer short answers with concrete examples. When a change touches motion,
name the easing and duration instead of "smooth". Never commit without
running the checks first.`;

function PersonalizationPage() {
  const [dirty, setDirty] = React.useState(false);
  const [personality, setPersonality] = React.useState("Friendly");

  return (
    <>
      <SettingsPageHeader title="Personalization" />
      <SettingsSection
        title="Custom instructions"
        description={
          <>
            Give Oreo extra instructions and context for every chat on this host.{" "}
            <a href="https://oreo-ui-preview.vercel.app" target="_blank" rel="noreferrer">
              Learn more
            </a>
          </>
        }
        actions={
          <Button type="secondary" size="sm" disabled={!dirty} onClick={() => setDirty(false)}>
            Save
          </Button>
        }
        className="mt-8"
      >
        <SettingsEditor
          aria-label="Custom instructions"
          defaultValue={INSTRUCTIONS_SEED}
          onChange={() => setDirty(true)}
          rows={6}
        />
      </SettingsSection>
      <SettingsSection
        title="Memory"
        description="Configure how local memories are collected, retained and consolidated on this computer."
        className="mt-10"
      >
        <SettingsCard>
          <SettingsRow
            title="Enable local memories"
            description="Create memories from chats on this computer and use them to personalize future chats"
            control={<Switch defaultChecked aria-label="Enable local memories" />}
          />
          <SettingsRow
            title="Allow memory generation from tool-assisted chats"
            description="Generate memories from chats that used tools or web search"
            control={<Switch aria-label="Allow memory generation from tool-assisted chats" />}
          />
          <SettingsRow
            title="Delete local memories"
            description="Remove every memory stored locally on this computer"
            control={
              <Button type="secondary" size="sm" danger>
                Delete
              </Button>
            }
          />
        </SettingsCard>
      </SettingsSection>
      <div className="mt-10 space-y-4">
        <SettingsCallout tone="warning">
          Personality settings are not supported by every model. Oreo's tone can also be customized in custom
          instructions.
        </SettingsCallout>
        <SettingsCard>
          <SettingsRow
            title="Personality"
            description="Choose a default tone for responses"
            control={
              <SettingsSelect
                aria-label="Personality"
                value={personality}
                options={["Friendly", "Concise", "Formal", "Nerdy"]}
                onChange={setPersonality}
              />
            }
          />
        </SettingsCard>
      </div>
    </>
  );
}

/* ---------------------------------- Pets ---------------------------------- */

const PETS = [
  { id: "nova", agent: "nova", name: "Nova", blurb: "Hot-path energy for fast iteration." },
  { id: "void", agent: "void", name: "Void", blurb: "Quiet signal from the deep end." },
  { id: "jade", agent: "jade", name: "Jade", blurb: "A steady rock when the diff gets large." },
  { id: "bloom", agent: "bloom", name: "Bloom", blurb: "Small green shoots for new ideas." },
  { id: "silk", agent: "silk", name: "Silk", blurb: "A calm companion for focused days." },
  { id: "flare", agent: "flare", name: "Flare", blurb: "A sharp eye for polished work in a blink." },
] as const;

function PetsPage() {
  const [selected, setSelected] = React.useState<string>("nova");

  return (
    <>
      <SettingsPageHeader title="Pets" />
      <SettingsSection
        title="Pick a pet"
        description="Pets watch your threads and surface what needs attention."
        actions={
          <>
            <IconButton type="tertiary" size="sm" shape="rectangle" aria-label="Refresh pets" icon={<Icon name="refresh" />} />
            <Button type="secondary" size="sm">
              Create
            </Button>
            <Button type="secondary" size="sm" leadingIcon={<Icon name="sparkle" size="sm" />}>
              Wake pet
            </Button>
          </>
        }
        className="mt-8"
      >
        <SettingsCard>
          {PETS.map((pet) => (
            <SettingsEntityRow
              key={pet.id}
              media={<Avatar agent={pet.agent} name={pet.name} size="md" />}
              title={pet.name}
              description={pet.blurb}
              selected={selected === pet.id}
              onSelect={() => setSelected(pet.id)}
            />
          ))}
        </SettingsCard>
      </SettingsSection>
    </>
  );
}

/* -------------------------------- Shortcuts ------------------------------- */

const SHORTCUTS = [
  { label: "New chat", keys: ["cmd", "N"] },
  { label: "Toggle sidebar", keys: ["cmd", "B"] },
  { label: "Search settings", keys: ["cmd", "K"] },
  { label: "Open settings", keys: ["cmd", ","] },
  { label: "Interrupt the agent", keys: ["ctrl", "C"] },
  { label: "Switch pet", keys: ["cmd", "shift", "P"] },
] as const;

function ShortcutsPage() {
  return (
    <>
      <SettingsPageHeader title="Keyboard shortcuts" />
      <SettingsSection title="Shortcuts" description="System-wide keys. Remapping lands soon." className="mt-8">
        <SettingsCard>
          {SHORTCUTS.map((s) => (
            <SettingsRow key={s.label} title={s.label} control={<Shortcut keys={[...s.keys]} />} />
          ))}
        </SettingsCard>
      </SettingsSection>
    </>
  );
}

/* ------------------------------ Usage & billing ---------------------------- */

function UsagePage() {
  const [autoReload, setAutoReload] = React.useState(false);

  return (
    <>
      <SettingsPageHeader
        title="Usage & billing"
        description={
          <>
            To view invoices, change your payment method and take other actions, visit{" "}
            <a href="https://oreo-ui-preview.vercel.app" target="_blank" rel="noreferrer">
              settings on the web
            </a>
            .
          </>
        }
      />
      <SettingsSection title="Your plan" className="mt-8">
        <SettingsCard>
          <SettingsStatRow
            value="Pro plan"
            caption="$20/mo"
            action={
              <Button type="secondary" size="sm">
                View plans
              </Button>
            }
          />
        </SettingsCard>
      </SettingsSection>
      <SettingsSection
        title="Credits balance"
        description="Buy credits or turn on auto-reload to keep working past a limit."
        className="mt-10"
      >
        <SettingsCard>
          <SettingsStatRow
            value="$0"
            caption="Current balance"
            action={
              <Button type="secondary" size="sm">
                Buy credits
              </Button>
            }
          />
          <SettingsRow
            title="Automatic reload"
            description="Continue working if you hit a limit"
            control={<Switch checked={autoReload} onCheckedChange={setAutoReload} aria-label="Automatic reload" />}
          />
          <SettingsRow
            title="Buy credits for someone else"
            control={
              <Button type="secondary" size="sm">
                Gift credits
              </Button>
            }
          />
        </SettingsCard>
      </SettingsSection>
      <SettingsSection title="Usage limits" className="mt-10">
        <SettingsCard>
          <SettingsMeterRow title="Weekly limit" caption="Resets Sep 7, 10:38 AM" fraction={0.95} label="95% left" />
          <SettingsMeterRow title="5-hour limit" caption="Resets 10:21 PM" fraction={1} label="100% left" />
          <SettingsMeterRow title="Fast requests" caption="Resets on your billing date" fraction={0.4} label="40% left" />
        </SettingsCard>
      </SettingsSection>
    </>
  );
}

/* --------------------------------- Router --------------------------------- */

export function DemoPage({ page, frame }: { page: DemoPageId; frame: DemoFrame }) {
  switch (page) {
    case "general":
      return <GeneralPage />;
    case "appearance":
      return <AppearancePage frame={frame} />;
    case "personalization":
      return <PersonalizationPage />;
    case "pets":
      return <PetsPage />;
    case "shortcuts":
      return <ShortcutsPage />;
    case "usage":
      return <UsagePage />;
  }
}
