import { useState, type CSSProperties } from "react";
import { DocsLayout } from "./DocsLayout";
import { CustomizePanel } from "./CustomizePanel";
import type { TocItem } from "./OnThisPage";
import { ICON_WEIGHTS, IconLibraryProvider, type IconLibrary, type IconWeight } from "@/components/icon";

export type SpringProps = { bounce: number; duration: number; tapScale: number };
export type IconControls = { library: IconLibrary; weight: IconWeight };
export type DocsControls = { spring: SpringProps; icon: IconControls; radius: number; dark: boolean };

export type DocsNav = { active: string; onNavigate: (id: string) => void };

/**
 * Reusable component-docs shell. Owns the live controls (theme / radius /
 * press-spring), renders the three-column layout + the floating "Make them
 * yours" panel, and hands the live control values to the page body via a
 * render prop so every preview can stay in sync.
 */
export function DocsPage({
  toc,
  breadcrumb,
  nav,
  children,
}: {
  toc: TocItem[];
  breadcrumb: string[];
  nav: DocsNav;
  children: (controls: DocsControls) => React.ReactNode;
}) {
  const [dark, setDark] = useState(false);
  const [radius, setRadius] = useState(8);
  const [bounce, setBounce] = useState(0.4);
  const [duration, setDuration] = useState(0.3);
  const [tapScale, setTapScale] = useState(0.96);
  const [library, setLibrary] = useState<IconLibrary>("phosphor");
  const [weight, setWeight] = useState<IconWeight>("regular");

  // Not every weight survives a library swap — Lucide can't draw `fill`. Fall
  // back for rendering only, so the original pick returns when Phosphor does.
  const effectiveWeight = ICON_WEIGHTS[library].includes(weight) ? weight : "regular";

  const controls: DocsControls = {
    spring: { bounce, duration, tapScale },
    icon: { library, weight: effectiveWeight },
    radius,
    dark,
  };
  const wrapStyle = { ["--radius-control" as string]: `${radius}px` } as CSSProperties;

  return (
    <IconLibraryProvider library={library}>
      <div className={dark ? "theme-dark min-h-screen bg-[var(--color-bg-elevated)]" : "min-h-screen"} style={wrapStyle}>
        <DocsLayout toc={toc} breadcrumb={breadcrumb} nav={nav}>
          {children(controls)}
        </DocsLayout>

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
          library={library}
          setLibrary={setLibrary}
          weight={effectiveWeight}
          setWeight={setWeight}
        />
      </div>
    </IconLibraryProvider>
  );
}
