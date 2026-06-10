# Oreo UI

A small, copy-paste React component library that reproduces the **Oreo UI** design language on a modern headless stack. Built as a design-system reference: own the source, theme via tokens, animate with springs.

## Stack

| Layer | Choice |
| --- | --- |
| Behavior / a11y | [Base UI](https://base-ui.com) (`useRender` for polymorphism) |
| Styling | Tailwind CSS v4 + [tailwind-variants](https://www.tailwind-variants.org) (`tv`) |
| Class merging | `clsx` + `tailwind-merge` (`cn`) |
| Motion | [Motion](https://motion.dev) springs (`bounce` / `duration`) |
| Theming | Design tokens as CSS variables (light + dark) |

## What's inside

- **Button** — `primary` / `secondary` / `ghost` variants, `danger` flag, leading/trailing icons, Material-style state-layer hover/press, and a tunable Motion spring on press.
- **Docs app** — three-column layout (component nav · content · on-this-page scrollspy) with Preview/Code tabs, an API table, and a floating **"Make them yours"** panel that drives theme, radius, and the press spring live across every preview.

Design tokens are extracted 1:1 from the Oreo UI Figma file; switching theme or radius only changes CSS variables — components are never touched.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # type-check + production build
```

## Structure

```
src/
├─ index.css                  # design tokens (CSS vars), light + dark skins
├─ lib/                       # cn, tv helpers
├─ components/button/         # button.tsx, button.variants.ts, icons
├─ docs/                      # DocsLayout, Sidebar, OnThisPage, CustomizePanel, primitives
└─ pages/ButtonDocs.tsx       # the Button documentation page
```

## Component pattern

Each component = **Base UI behavior** + **`tv()` variants** + **`cn()` merge** + **token-driven theme**. Interactive states use Tailwind `data-[*]` variants tied to Base UI's data attributes; press animation is an optional Motion spring exposed as props (`bounce`, `duration`, `tapScale`).
