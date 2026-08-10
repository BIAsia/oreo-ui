import { useEffect, useState, type ComponentType } from "react";
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
import { ToolCallDocs } from "@/pages/ToolCallDocs";
import { ReasoningDocs } from "@/pages/ReasoningDocs";
import { PlanDocs } from "@/pages/PlanDocs";
import { SourcesDocs } from "@/pages/SourcesDocs";
import { ConfirmationDocs } from "@/pages/ConfirmationDocs";
import { AttachmentDocs } from "@/pages/AttachmentDocs";
import { BranchPickerDocs } from "@/pages/BranchPickerDocs";
import { ThreadListDocs } from "@/pages/ThreadListDocs";
import { AssistantModalDocs } from "@/pages/AssistantModalDocs";
import { CodeDiffDocs } from "@/pages/CodeDiffDocs";
import { TerminalDocs } from "@/pages/TerminalDocs";
import { WebSearchDocs } from "@/pages/WebSearchDocs";
import { SubagentsDocs } from "@/pages/SubagentsDocs";
import { MenuDocs } from "@/pages/MenuDocs";
import { PromptBoxDocs } from "@/pages/PromptBoxDocs";
import { ContextBarDocs } from "@/pages/ContextBarDocs";
import type { DocsNav } from "@/docs/DocsPage";

const PAGES: Record<string, ComponentType<{ nav: DocsNav }>> = {
  button: ButtonDocs,
  "icon-button": IconButtonDocs,
  shortcut: ShortcutDocs,
  chip: ChipDocs,
  tag: TagDocs,
  avatar: AvatarDocs,
  menu: MenuDocs,
  "code-block": CodeBlockDocs,
  response: ResponseDocs,
  message: MessageDocs,
  conversation: ConversationDocs,
  "tool-call": ToolCallDocs,
  reasoning: ReasoningDocs,
  plan: PlanDocs,
  sources: SourcesDocs,
  confirmation: ConfirmationDocs,
  attachment: AttachmentDocs,
  "branch-picker": BranchPickerDocs,
  "thread-list": ThreadListDocs,
  "assistant-modal": AssistantModalDocs,
  "code-diff": CodeDiffDocs,
  terminal: TerminalDocs,
  "web-search": WebSearchDocs,
  subagents: SubagentsDocs,
  "prompt-box": PromptBoxDocs,
  "context-bar": ContextBarDocs,
  "onboarding-board": BoardPage,
};

const DEFAULT_PAGE = "button";

/** Every page lives at /<slug> so any component doc can be shared as a URL. */
function pageFromPath() {
  const slug = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return slug in PAGES ? slug : DEFAULT_PAGE;
}

function pageTitle(slug: string) {
  return slug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export default function App() {
  const [page, setPage] = useState(pageFromPath);

  useEffect(() => {
    const onPop = () => setPage(pageFromPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    document.title = `Oreo UI · ${pageTitle(page)}`;
  }, [page]);

  const nav: DocsNav = {
    active: page,
    onNavigate: (id) => {
      if (id !== page) window.history.pushState(null, "", `/${id}`);
      setPage(id);
      window.scrollTo({ top: 0 });
    },
  };

  const Page = PAGES[page] ?? ButtonDocs;
  return <Page key={page} nav={nav} />;
}
