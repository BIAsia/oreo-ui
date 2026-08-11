import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { PAGE_SLUGS, SITE } from "./src/lib/site";

/**
 * Emit sitemap.xml from the route table in src/lib/site.ts, so adding a docs
 * page can never leave the sitemap stale. Served in dev too, for checking.
 */
function sitemap(): Plugin {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${SITE.url}/</loc></url>`,
    ...PAGE_SLUGS.map((slug) => `  <url><loc>${SITE.url}/${slug}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");

  return {
    name: "oreo-sitemap",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split("?")[0] !== "/sitemap.xml") return next();
        res.setHeader("Content-Type", "application/xml");
        res.end(xml);
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: xml });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), sitemap()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
