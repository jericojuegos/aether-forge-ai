# 🧠 aether-forge-ai — Agent Brain (`AGENTS.md`)

**Project:** AetherForge AI — Generative 3D Visualization Studio powered by React Three Fiber & Google Gemini
**Context:** Personal / Standalone
**Stack:** React 19 · Vite 7 · TypeScript · Three.js (`@react-three/fiber` / `@react-three/drei`) · Tailwind CSS · Google Gemini SDK (`@google/generative-ai`)
**Architecture Pattern:** Component + Context Store + Generator Service Architecture (See `docs/foundation/system-architecture.md`)
**Master Brain:** `generic`
**Last synced:** `generic-v1.0` - 2026-11-10

---

## 🚦 Project State

**Stage:** `active`
**Stage last updated:** `2026-11-09`

| Stage | Meaning | Next Action / Skill |
|-------|---------|---------------------|
| `active` | Active development in progress | **`/next`** → **`/spec`** → **`/build`** → **`/verify`** → **`/ship`** |

---

## ⚡ Deterministic Verification Commands

Run these commands after every task before marking `[x]`:
- **Typecheck & Production Build:** `npm run build` (`tsc -b && vite build`)
- **Lint:** `npm run lint` (`eslint .`)

---

## 🗺️ Context Map (`docs/INDEX.md`) & Skills (`.agents/skills/`)

> **Progressive Disclosure Rule:** Do not read all docs at once. Read [`docs/INDEX.md`](docs/INDEX.md) or use this quick table:

| Question / Action | File or Skill |
|-------------------|---------------|
| What should I work on next? | **`/next`** ([`.agents/skills/next/SKILL.md`](.agents/skills/next/SKILL.md)) |
| What is the phased roadmap & feature backlog? | [`docs/planning/roadmap.md`](docs/planning/roadmap.md) |
| Create or expand a feature spec (`requirements`, `design`, `tasks`, `uat`) | **`/spec`** ([`.agents/skills/spec/SKILL.md`](.agents/skills/spec/SKILL.md)) |
| Build features or execute tasks/waves | **`/build`** ([`.agents/skills/build/SKILL.md`](.agents/skills/build/SKILL.md)) |
| Verify acceptance criteria, types, and quality standards | **`/verify`** ([`.agents/skills/verify/SKILL.md`](.agents/skills/verify/SKILL.md)) |
| Ship completed feature, update `roadmap.md`, and generate PR summary | **`/ship`** ([`.agents/skills/ship/SKILL.md`](.agents/skills/ship/SKILL.md)) |
| What are the detected technologies and dependencies? | [`docs/foundation/tech-stack.md`](docs/foundation/tech-stack.md) |
| Where do files live & what is the real folder layout? | [`docs/foundation/system-architecture.md`](docs/foundation/system-architecture.md) |
| How do we execute tasks, waves & cross-model reviews? | [`.agents/rules/execution-protocol.md`](.agents/rules/execution-protocol.md) |
| What are the discovered coding standards & boundaries? | [`.agents/rules/stack-rules.md`](.agents/rules/stack-rules.md) |

---

## ⚠️ Critical Constraints — Never Violate

- **Strict TypeScript & Clean Builds:** Every change must pass `npm run build` (`tsc -b && vite build`) with zero TypeScript errors.
- **Generator Synchronization:** Any new 3D generator or parameter added to `StoreContext.tsx` must be wired into: (1) the 3D scene component in `src/components/generators/`, (2) the parameter controls UI, (3) the AI system prompt in `src/services/ai.ts`, and (4) the code exporters in `src/services/generators/`.
- **WebGL / Three.js Resource Hygiene:** Custom geometries, materials, and `ShaderMaterial` uniforms inside `@react-three/fiber` `useFrame` loops must mutate refs in-place rather than re-instantiating objects every frame.
- **No Hardcoded API Keys:** Never commit Gemini API keys to source files or `.env` tracked by Git.
