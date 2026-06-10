import { useState } from "react";
import { ButtonDocs } from "@/pages/ButtonDocs";
import { IconButtonDocs } from "@/pages/IconButtonDocs";
import type { DocsNav } from "@/docs/DocsPage";

export default function App() {
  const [page, setPage] = useState("button");

  const nav: DocsNav = {
    active: page,
    onNavigate: (id) => {
      setPage(id);
      window.scrollTo({ top: 0 });
    },
  };

  return page === "icon-button" ? <IconButtonDocs nav={nav} /> : <ButtonDocs nav={nav} />;
}
