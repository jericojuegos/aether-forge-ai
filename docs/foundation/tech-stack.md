# 🛠️ AetherForge AI — Tech Stack (`docs/foundation/tech-stack.md`)

---

## Stack Overview

| Layer | Technology | Version / Notes |
|-------|------------|-----------------|
| **Framework & Bundler** | React + Vite | React `^19.2.0`, Vite `^7.2.4` |
| **Language** | TypeScript | `~5.9.3` (ES Module, strict mode) |
| **3D Rendering** | Three.js + React Three Fiber | `three` `^0.182.0`, `@react-three/fiber` `^9.5.0`, `@react-three/drei` `^10.7.7` |
| **Styling & Motion** | Tailwind CSS + Framer Motion | `tailwindcss` `^3.4.1`, `framer-motion` `^12.25.0`, `lucide-react` `^0.562.0` |
| **AI SDK** | Google Generative AI | `@google/generative-ai` `^0.24.1` (Gemini 2.0 Flash / 1.5 Flash / Pro) |
| **Package Manager** | npm | `package-lock.json` present |
| **Deployment** | Vercel | `vercel.json` SPA rewrites |

---

## Build & Verification Scripts (`package.json`)

- **Dev Server:** `npm run dev` (`vite`)
- **Production Build & Typecheck:** `npm run build` (`tsc -b && vite build`)
- **Lint:** `npm run lint` (`eslint .`)
- **Preview:** `npm run preview` (`vite preview`)

---

## AI & Configuration State

- **API Key Management:** Stored in client-side memory via `StoreContext` (`aiConfig.apiKey` and `aiConfig.modelName`, defaulting to `gemini-2.0-flash`).
- **Generators Supported (`GeneratorType`):** `'shapes' | 'planet' | 'particles' | 'fluid' | 'neural' | 'void'`
- **Export Targets (`CodePlatform`):** `'react'` (React Three Fiber), `'threejs'` (Vanilla Three.js), `'wordpress'` (WordPress custom HTML/shortcode snippet).
