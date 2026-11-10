# 🗺️ AetherForge AI — Roadmap (`docs/planning/roadmap.md`)

> **Vision:** Transform natural language prompts into immersive, real-time 3D environments with instant multi-platform code export.

## 🧭 Legend
- `[ ]` Pending · `[>]` Current Focus · `[x]` Completed · `[-]` Deferred · `[!]` Blocked

---

## [x] Phase 1: Core Studio & 3D Generators (Completed / Existing Baseline)
- [x] Vite + React 19 + TypeScript + Tailwind CSS + Three.js (`@react-three/fiber`, `@react-three/drei`) setup
- [x] Central `StoreContext` state management for generators, view modes, and AI settings
- [x] Landing Page (`src/components/landing/LandingPage.tsx`) with interactive `NeuralBackground`
- [x] 6 Real-Time 3D Generators:
  - [x] `InteractiveShape` (Icosahedron, Sphere, Box, Torus, Octahedron)
  - [x] `ProceduralPlanet` (Custom GLSL shaders + atmosphere)
  - [x] `ParticleField` (Animated 3D particle flow)
  - [x] `FluidSimulation` (Curl & dissipation fluid shaders)
  - [x] `NeuralNexus` (Pulsing neural network nodes & edges)
  - [x] `CosmicVoid` (Black hole accretion disk shader)
- [x] Google Gemini AI Commander (`src/services/ai.ts`) for natural-language parameter & scene switching
- [x] Triple-Platform Code Exporter (`CodePreview.tsx` — React Three Fiber, Vanilla Three.js, WordPress)

---

## [>] Phase 2: Consolidation, Polish & Next Features
- [ ] Consolidate duplicate layout/control components (`App.tsx` inline vs `src/components/layout/*` and `src/components/controls/Controls.tsx`)
- [ ] Add Cosmic Void (`void`) code export support across React, Three.js, and WordPress generators
- [ ] Add preset scene templates & shareable config JSON export/import
- [ ] Optional backend proxy / secure key handling for Gemini API requests
