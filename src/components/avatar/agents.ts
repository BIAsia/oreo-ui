/**
 * Agent avatars use soft gradient "meshes" instead of a photo or initials.
 * Figma builds these from layered mesh gradients; we approximate each with a
 * couple of radial gradients that capture the same hue + mood. Values are CSS
 * `background` strings applied inline.
 */
export const AGENTS = ["nova", "void", "jade", "bloom", "silk", "flare"] as const;
export type AgentName = (typeof AGENTS)[number];

export const agentGradient: Record<AgentName, string> = {
  nova:
    "radial-gradient(circle at 30% 25%, #ff7ce5 0%, transparent 55%), radial-gradient(circle at 75% 70%, #7a4cff 0%, transparent 60%), radial-gradient(circle at 50% 50%, #ff3d8b 0%, #6a1f9c 100%)",
  void:
    "radial-gradient(circle at 30% 25%, #5b7cff 0%, transparent 55%), radial-gradient(circle at 75% 75%, #1b2370 0%, transparent 60%), radial-gradient(circle at 50% 50%, #2b3aa0 0%, #0b1136 100%)",
  jade:
    "radial-gradient(circle at 30% 25%, #9af7d2 0%, transparent 55%), radial-gradient(circle at 75% 70%, #18a07a 0%, transparent 60%), radial-gradient(circle at 50% 50%, #4fd6a0 0%, #0f6b53 100%)",
  bloom:
    "radial-gradient(circle at 30% 25%, #ffb3c8 0%, transparent 55%), radial-gradient(circle at 75% 70%, #ff5d7a 0%, transparent 60%), radial-gradient(circle at 50% 50%, #ff7a9c 0%, #c41e5a 100%)",
  silk:
    "radial-gradient(circle at 30% 25%, #fff7ec 0%, transparent 55%), radial-gradient(circle at 75% 70%, #ecd9bf 0%, transparent 60%), radial-gradient(circle at 50% 50%, #f6e6cf 0%, #d9bd95 100%)",
  flare:
    "radial-gradient(circle at 30% 25%, #ffd28a 0%, transparent 55%), radial-gradient(circle at 75% 70%, #ff7a18 0%, transparent 60%), radial-gradient(circle at 50% 50%, #ffae42 0%, #d2570a 100%)",
};
