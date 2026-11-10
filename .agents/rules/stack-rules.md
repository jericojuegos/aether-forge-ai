---
trigger: always_on
description: Universal, framework-agnostic coding standards, quality boundaries, and pre-commit verification checklist for generic/brownfield repositories
---

# 🏗️ Stack Rules: Generic / Codebase-Discovered Architecture (`generic`)

---

## 1. Golden Law: Foundation Docs Are The Single Source of Truth

Because this repository uses a custom, multi-language, or discovered tech stack:
1. **Never Assume Framework Conventions:** Do not inject Next.js, WordPress, Supabase, or other specific paradigms unless they are explicitly defined in [`docs/foundation/tech-stack.md`](../../docs/foundation/tech-stack.md).
2. **Strict Adherence to Existing Directory Structure:** All new files, components, functions, and tests must strictly follow the folder conventions mapped in [`docs/foundation/architecture.md`](../../docs/foundation/architecture.md).
3. **Match Existing Code Style & Idioms:** Follow the exact casing (camelCase vs snake_case), naming conventions, and file organization established by existing modules in the codebase.

---

## 2. Universal Quality Boundaries

1. **No Phantom / Uninstalled Dependencies:** Never import external libraries unless they already exist in the project's dependency manifest (`package.json`, `composer.json`, `requirements.txt`, `Cargo.toml`, etc.).
2. **Boundary Isolation:** Keep business logic decoupled from presentation/framework glue. Reusable logic belongs in dedicated service/utility modules.
3. **Hard Failure Checks:**
   - ❌ Never commit syntax errors or broken imports.
   - ❌ Never commit hardcoded secrets, API keys, or raw environment values.
   - ❌ Never bypass existing project linters, formatters, or typecheckers.
   - ❌ Never modify unrelated files outside the scope of the active spec task wave.

---

## 3. Pre-Commit Verification Checklist

Before completing any task wave or marking a task `[x]`:
- [ ] Run the project-specific syntax/typecheck command defined in `AGENTS.md` (e.g. `npm run typecheck`, `php -l`, `pytest`, `cargo check`).
- [ ] Run unit tests covering the modified files.
- [ ] Verify that zero regression occurred in existing modules and all `AGENTS.md` Critical Constraints pass.
