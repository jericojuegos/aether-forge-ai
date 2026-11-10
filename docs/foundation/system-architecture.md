# 🏗️ AetherForge AI — System Architecture (`docs/foundation/system-architecture.md`)

---

## Directory Structure

```
src/
├── main.tsx                          # React 19 entry point
├── App.tsx                           # Main studio shell (Canvas, Sidebar, Controls, AICommander)
├── index.css / App.css               # Global styles & studio glassmorphism theme
├── store/
│   └── StoreContext.tsx              # Central React Context state for activeGenerator, configs, viewMode, and AI settings
├── services/
│   ├── ai.ts                         # Google Gemini natural-language-to-config parser (processAICommand)
│   └── generators/                   # Code exporters per platform/generator
│       ├── reactGenerator.ts         # React Three Fiber code exporter
│       ├── threeJsGenerator.ts       # Vanilla Three.js code exporter
│       ├── wordpressGenerator.ts     # WordPress embed code exporter
│       ├── fluidGenerator.ts         # Fluid simulation shader/code exporter
│       └── neuralGenerator.ts        # Neural nexus code exporter
└── components/
    ├── generators/                   # 3D Canvas scene components (R3F + custom GLSL shaders)
    │   ├── InteractiveShape.tsx      # Basic 3D geometries (icosahedron, sphere, box, torus, octahedron)
    │   ├── ProceduralPlanet.tsx      # Custom GLSL vertex/fragment shader planet with atmosphere
    │   ├── ParticleField.tsx         # Dynamic particle flow system
    │   ├── FluidSimulation.tsx       # Real-time fluid curl/density simulation
    │   ├── NeuralNexus.tsx           # Pulsing node/connection network
    │   └── CosmicVoid.tsx            # Black hole accretion disk shader
    ├── landing/                      # Marketing landing page & hero 3D background
    │   ├── LandingPage.tsx
    │   ├── NeuralBackground.tsx
    │   ├── FeatureCard.tsx
    │   └── HeroButton.tsx
    ├── layout/                       # Studio layout panels & code preview modal
    │   ├── CodePreview.tsx           # Multi-platform code preview & copy/export UI
    │   ├── AICommander.tsx
    │   ├── Layout.tsx
    │   └── Sidebar.tsx
    └── controls/
        └── Controls.tsx
```

---

## Architectural Conventions

1. **State Flow (`StoreContext.tsx`):**
   - Every 3D generator has a dedicated strongly-typed config interface (`ShapeConfig`, `PlanetConfig`, `ParticleConfig`, `FluidConfig`, `NeuralConfig`, `VoidConfig`) and a partial updater (`updateShapeConfig`, etc.).
   - Adding a new generator requires registering its type in `GeneratorType`, adding its config state to `StoreContext`, mounting its 3D component inside `<Canvas>` in `App.tsx`, and adding export templates in `src/services/generators/`.
2. **AI Prompt-to-Scene Flow (`src/services/ai.ts`):**
   - `processAICommand` sends `SYSTEM_PROMPT`, the active generator, and the user prompt to Google Gemini and parses a JSON response `{ intent, configUpdate, message }`.
   - `App.tsx` applies `intent` (switching generators if needed) and merges `configUpdate` into the target generator's state.
3. **Triple-Platform Code Export (`src/components/layout/CodePreview.tsx`):**
   - Reads the active generator and its current parameters from `useStore()` and generates standalone, copy-ready code for React Three Fiber, Vanilla Three.js, or WordPress.
