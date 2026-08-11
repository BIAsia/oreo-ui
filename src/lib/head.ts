/* ----------------------------------------------------------------------------
 * Per-route <head> updates. index.html ships the site-level defaults (so
 * non-rendering crawlers and social unfurlers always see something sane); this
 * rewrites them client-side as the route changes, for the tab title, bookmarks
 * and JS-rendering crawlers like Googlebot.
 * -------------------------------------------------------------------------- */

type RouteMeta = { title: string; description: string; canonical: string };

function head<T extends HTMLElement>(selector: string, create: () => T): T {
  const existing = document.head.querySelector<T>(selector);
  if (existing) return existing;
  const el = create();
  document.head.appendChild(el);
  return el;
}

function setMeta(key: "name" | "property", value: string, content: string) {
  head(`meta[${key}="${value}"]`, () => {
    const el = document.createElement("meta");
    el.setAttribute(key, value);
    return el;
  }).setAttribute("content", content);
}

function setCanonical(href: string) {
  head<HTMLLinkElement>('link[rel="canonical"]', () => {
    const el = document.createElement("link");
    el.rel = "canonical";
    return el;
  }).href = href;
}

export function applyRouteMeta({ title, description, canonical }: RouteMeta) {
  document.title = title;
  setMeta("name", "description", description);
  setCanonical(canonical);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", canonical);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
}
