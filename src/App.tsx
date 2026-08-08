import { useState, type ComponentType } from "react";
import { ButtonDocs } from "@/pages/ButtonDocs";
import { IconButtonDocs } from "@/pages/IconButtonDocs";
import { ShortcutDocs } from "@/pages/ShortcutDocs";
import { ChipDocs } from "@/pages/ChipDocs";
import { TagDocs } from "@/pages/TagDocs";
import { AvatarDocs } from "@/pages/AvatarDocs";
import { BoardPage } from "@/pages/BoardPage";
import { CodeBlockDocs } from "@/pages/CodeBlockDocs";
import { ResponseDocs } from "@/pages/ResponseDocs";
import { MessageDocs } from "@/pages/MessageDocs";
import { ConversationDocs } from "@/pages/ConversationDocs";
import type { DocsNav } from "@/docs/DocsPage";

const PAGES: Record<string, ComponentType<{ nav: DocsNav }>> = {
  button: ButtonDocs,
  "icon-button": IconButtonDocs,
  shortcut: ShortcutDocs,
  chip: ChipDocs,
  tag: TagDocs,
  avatar: AvatarDocs,
  "code-block": CodeBlockDocs,
  response: ResponseDocs,
  message: MessageDocs,
  conversation: ConversationDocs,
  "onboarding-board": BoardPage,
};

export default function App() {
  const [page, setPage] = useState("button");

  const nav: DocsNav = {
    active: page,
    onNavigate: (id) => {
      setPage(id);
      window.scrollTo({ top: 0 });
    },
  };

  const Page = PAGES[page] ?? ButtonDocs;
  return <Page key={page} nav={nav} />;
}
