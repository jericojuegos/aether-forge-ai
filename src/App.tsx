import { Suspense } from 'react';
import { StoreProvider, useStore } from './store/StoreContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { InteractiveShape } from './components/generators/InteractiveShape';
import { ProceduralPlanet } from './components/generators/ProceduralPlanet';
import { ParticleField } from './components/generators/ParticleField';
import { FluidSimulation } from './components/generators/FluidSimulation';
import { NeuralNexus } from './components/generators/NeuralNexus';
import { CodePreview } from './components/layout/CodePreview';
import { Box, Globe, Sparkles, Cpu, Send, Bot, Sliders, Palette, RotateCw, Zap, Code2, Droplets, Share2 } from 'lucide-react';
import { useState } from 'react';
import { processAICommand } from './services/ai';
import './index.css';

// ============ SIDEBAR COMPONENT ============
function Sidebar() {
  const { activeGenerator, setActiveGenerator, toggleViewMode } = useStore();

  const navItems = [
    { id: 'shapes' as const, label: 'Shapes', icon: <Box size={18} /> },
    { id: 'planet' as const, label: 'Planet', icon: <Globe size={18} /> },
    { id: 'particles' as const, label: 'Particles', icon: <Sparkles size={18} /> },
    { id: 'fluid' as const, label: 'Fluid', icon: <Droplets size={18} /> },
    { id: 'neural' as const, label: 'Neural', icon: <Share2 size={18} /> },
  ];

  return (
    <div className="sidebar-section">
      {/* Logo */}
      <div className="logo-container">
        <div className="logo-icon">
          <Cpu size={22} />
        </div>
        <div>
          <h1 className="logo-title">AETHERFORGE AI</h1>
          <p className="logo-subtitle">3D VISUALIZATION STUDIO</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav-section">
        <p className="nav-label">GENERATORS</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveGenerator(item.id)}
            className={`nav-button ${activeGenerator === item.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {activeGenerator === item.id && <Zap size={12} className="nav-indicator" />}
          </button>
        ))}
      </nav>

      {/* Code Export */}
      <div className="status-section" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px', marginBottom: '8px', marginTop: '24px' }}>
        <p className="nav-label">EXPORT</p>
        <button
          className="nav-button"
          style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', borderColor: 'rgba(6, 182, 212, 0.2)' }}
          onClick={toggleViewMode}
        >
          <Code2 size={18} />
          <span>View Code</span>
        </button>
      </div>

      {/* Status */}
      <div className="status-section" style={{ marginTop: '0', paddingTop: '8px' }}>
        <div className="status-indicator">
          <div className="status-dot" />
          <span>SYSTEM ONLINE</span>
        </div>
        <p className="version-text">AETHER CORE v2.0.1</p>
      </div>
    </div>
  );
}

// ============ CONTROLS COMPONENT ============
function Controls() {
  const {
    activeGenerator,
    shapeConfig, updateShapeConfig,
    planetConfig, updatePlanetConfig,
    particleConfig, updateParticleConfig,
    fluidConfig, updateFluidConfig,
    neuralConfig, updateNeuralConfig
  } = useStore();

  const titles: Record<string, string> = {
    shapes: 'Shape Controls',
    planet: 'Planet Controls',
    particles: 'Particle Controls',
    fluid: 'Fluid Controls',
    neural: 'Neural Controls'
  };

  return (
    <div className="controls-section">
      <div className="controls-header">
        <Sliders size={16} />
        <h3>{titles[activeGenerator]}</h3>
      </div>

      <div className="controls-body">
        {activeGenerator === 'shapes' && (
          <>
            <div className="control-group">
              <label>Geometry</label>
              <select
                value={shapeConfig.geometryType}
                onChange={(e) => updateShapeConfig({ geometryType: e.target.value as 'icosahedron' })}
              >
                <option value="icosahedron">Icosahedron</option>
                <option value="sphere">Sphere</option>
                <option value="box">Box</option>
                <option value="torus">Torus</option>
                <option value="octahedron">Octahedron</option>
              </select>
            </div>

            <div className="control-group">
              <div className="control-row">
                <label>Size</label>
                <span className="control-value">{shapeConfig.size.toFixed(1)}</span>
              </div>
              <input
                type="range" min="0.5" max="3" step="0.1"
                value={shapeConfig.size}
                onChange={(e) => updateShapeConfig({ size: parseFloat(e.target.value) })}
              />
            </div>

            <div className="control-group">
              <label><Palette size={12} /> Color</label>
              <input
                type="color"
                value={shapeConfig.color}
                onChange={(e) => updateShapeConfig({ color: e.target.value })}
              />
            </div>

            <div className="control-checkbox">
              <input
                type="checkbox"
                id="wireframe"
                checked={shapeConfig.wireframe}
                onChange={(e) => updateShapeConfig({ wireframe: e.target.checked })}
              />
              <label htmlFor="wireframe">Wireframe Mode</label>
            </div>

            <div className="control-checkbox">
              <input
                type="checkbox"
                id="autoRotate"
                checked={shapeConfig.autoRotate}
                onChange={(e) => updateShapeConfig({ autoRotate: e.target.checked })}
              />
              <label htmlFor="autoRotate"><RotateCw size={14} /> Auto Rotate</label>
            </div>
          </>
        )}

        {activeGenerator === 'planet' && (
          <>
            <div className="control-group">
              <div className="control-row">
                <label>Detail Level</label>
                <span className="control-value">{planetConfig.detail}</span>
              </div>
              <input
                type="range" min="4" max="60" step="2"
                value={planetConfig.detail}
                onChange={(e) => updatePlanetConfig({ detail: parseInt(e.target.value) })}
              />
            </div>

            <div className="control-group">
              <div className="control-row">
                <label>Water Level</label>
                <span className="control-value">{(planetConfig.waterLevel * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={planetConfig.waterLevel}
                onChange={(e) => updatePlanetConfig({ waterLevel: parseFloat(e.target.value) })}
              />
            </div>

            <div className="control-group">
              <label>Land Color</label>
              <input
                type="color"
                value={planetConfig.colorLand}
                onChange={(e) => updatePlanetConfig({ colorLand: e.target.value })}
              />
            </div>

            <div className="control-group">
              <label>Water Color</label>
              <input
                type="color"
                value={planetConfig.colorWater}
                onChange={(e) => updatePlanetConfig({ colorWater: e.target.value })}
              />
            </div>

            <div className="control-checkbox">
              <input
                type="checkbox"
                id="atmosphere"
                checked={planetConfig.showAtmosphere}
                onChange={(e) => updatePlanetConfig({ showAtmosphere: e.target.checked })}
              />
              <label htmlFor="atmosphere">Show Atmosphere</label>
            </div>
          </>
        )}

        {activeGenerator === 'particles' && (
          <>
            <div className="control-group">
              <div className="control-row">
                <label>Particle Count</label>
                <span className="control-value">{particleConfig.count.toLocaleString()}</span>
              </div>
              <input
                type="range" min="100" max="5000" step="100"
                value={particleConfig.count}
                onChange={(e) => updateParticleConfig({ count: parseInt(e.target.value) })}
              />
            </div>

            <div className="control-group">
              <div className="control-row">
                <label>Speed</label>
                <span className="control-value">{particleConfig.speed.toFixed(1)}x</span>
              </div>
              <input
                type="range" min="0.1" max="5" step="0.1"
                value={particleConfig.speed}
                onChange={(e) => updateParticleConfig({ speed: parseFloat(e.target.value) })}
              />
            </div>

            <div className="control-group">
              <div className="control-row">
                <label>Spread</label>
                <span className="control-value">{particleConfig.spread}</span>
              </div>
              <input
                type="range" min="2" max="15" step="1"
                value={particleConfig.spread}
                onChange={(e) => updateParticleConfig({ spread: parseFloat(e.target.value) })}
              />
            </div>

            <div className="control-group">
              <label><Palette size={12} /> Color</label>
              <input
                type="color"
                value={particleConfig.color}
                onChange={(e) => updateParticleConfig({ color: e.target.value })}
              />
            </div>
          </>
        )}

        {activeGenerator === 'fluid' && (
          <>
            <div className="control-group">
              <div className="control-row">
                <label>Curl Intensity</label>
                <span className="control-value">{fluidConfig.curl}</span>
              </div>
              <input
                type="range" min="1" max="100" step="1"
                value={fluidConfig.curl}
                onChange={(e) => updateFluidConfig({ curl: parseInt(e.target.value) })}
              />
            </div>

            <div className="control-group">
              <div className="control-row">
                <label>Splat Radius</label>
                <span className="control-value">{fluidConfig.splatRadius.toFixed(2)}</span>
              </div>
              <input
                type="range" min="0.01" max="1" step="0.01"
                value={fluidConfig.splatRadius}
                onChange={(e) => updateFluidConfig({ splatRadius: parseFloat(e.target.value) })}
              />
            </div>

            <div className="control-group">
              <div className="control-row">
                <label>Dissipation</label>
                <span className="control-value">{fluidConfig.densityDissipation.toFixed(1)}</span>
              </div>
              <input
                type="range" min="0.1" max="10" step="0.1"
                value={fluidConfig.densityDissipation}
                onChange={(e) => updateFluidConfig({ densityDissipation: parseFloat(e.target.value) })}
              />
            </div>

            <div className="control-checkbox">
              <input
                type="checkbox"
                id="shading"
                checked={fluidConfig.shading}
                onChange={(e) => updateFluidConfig({ shading: e.target.checked })}
              />
              <label htmlFor="shading">Enable Shading</label>
            </div>
          </>
        )}

        {activeGenerator === 'neural' && (
          <>
            <div className="control-group">
              <div className="control-row">
                <label>Node Count</label>
                <span className="control-value">{neuralConfig.nodeCount}</span>
              </div>
              <input
                type="range" min="50" max="500" step="10"
                value={neuralConfig.nodeCount}
                onChange={(e) => updateNeuralConfig({ nodeCount: parseInt(e.target.value) })}
              />
            </div>

            <div className="control-group">
              <div className="control-row">
                <label>Connection Radius</label>
                <span className="control-value">{neuralConfig.connectionRadius.toFixed(1)}</span>
              </div>
              <input
                type="range" min="1" max="5" step="0.1"
                value={neuralConfig.connectionRadius}
                onChange={(e) => updateNeuralConfig({ connectionRadius: parseFloat(e.target.value) })}
              />
            </div>

            <div className="control-group">
              <div className="control-row">
                <label>Pulse Speed</label>
                <span className="control-value">{neuralConfig.pulseSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range" min="0.1" max="5" step="0.1"
                value={neuralConfig.pulseSpeed}
                onChange={(e) => updateNeuralConfig({ pulseSpeed: parseFloat(e.target.value) })}
              />
            </div>

            <div className="control-group">
              <label>Base Color</label>
              <input
                type="color"
                value={neuralConfig.baseColor}
                onChange={(e) => updateNeuralConfig({ baseColor: e.target.value })}
              />
            </div>

            <div className="control-group">
              <label>Glow Color</label>
              <input
                type="color"
                value={neuralConfig.glowColor}
                onChange={(e) => updateNeuralConfig({ glowColor: e.target.value })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============ AI COMMANDER COMPONENT ============
const MODEL_NAMES = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-flash-latest",
  "gemini-pro"
];

function AICommander() {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const {
    activeGenerator, setActiveGenerator,
    updateShapeConfig, updatePlanetConfig, updateParticleConfig, updateFluidConfig, updateNeuralConfig,
    aiConfig, updateAIConfig
  } = useStore();

  const handleCommand = async () => {
    if (!prompt.trim()) return;
    if (!aiConfig.apiKey) {
      setLastResponse("Please enter a Gemini API Key in settings first.");
      setShowSettings(true);
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processAICommand(prompt, activeGenerator, aiConfig);
      if (result.intent !== activeGenerator && result.intent !== 'unknown') {
        setActiveGenerator(result.intent);
      }
      if (result.configUpdate && Object.keys(result.configUpdate).length > 0) {
        if (result.intent === 'shapes' || result.intent === 'unknown') updateShapeConfig(result.configUpdate);
        if (result.intent === 'planet') updatePlanetConfig(result.configUpdate);
        if (result.intent === 'particles') updateParticleConfig(result.configUpdate);
        if (result.intent === 'fluid') updateFluidConfig(result.configUpdate);
        if (result.intent === 'neural') updateNeuralConfig(result.configUpdate);
      }
      setLastResponse(result.message);
    } catch (err: any) {
      setLastResponse(err.message || "Systems offline. Please verify API key and model.");
    } finally {
      setIsProcessing(false);
      setPrompt('');
    }
  };

  return (
    <div className="ai-section">
      <div className="ai-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <p className="nav-label" style={{ marginBottom: 0 }}>AI ASSISTANT</p>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`settings-toggle ${showSettings ? 'active' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            color: showSettings ? '#06b6d4' : 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <Sliders size={14} />
        </button>
      </div>

      {showSettings && (
        <div className="ai-settings-panel" style={{
          background: 'rgba(255,255,255,0.03)',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '12px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div className="control-group">
            <label style={{ fontSize: '10px' }}>GEMINI API KEY</label>
            <input
              type="password"
              placeholder="Paste your key here..."
              value={aiConfig.apiKey}
              onChange={(e) => updateAIConfig({ apiKey: e.target.value })}
              style={{ fontSize: '11px', padding: '6px' }}
            />
          </div>
          <div className="control-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '10px' }}>MODEL</label>
            <select
              value={aiConfig.modelName}
              onChange={(e) => updateAIConfig({ modelName: e.target.value })}
              style={{ fontSize: '11px', padding: '6px' }}
            >
              {MODEL_NAMES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      )}

      {lastResponse && (
        <div className="ai-response">
          <div className="ai-avatar">
            <Bot size={14} />
          </div>
          <div className="ai-content">
            <p className="ai-label">Aether AI</p>
            <p className="ai-message">{lastResponse}</p>
          </div>
          <button onClick={() => setLastResponse(null)} className="ai-close">×</button>
        </div>
      )}

      <div className="ai-input-container">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
          placeholder={isProcessing ? "Processing..." : `Transform your ${activeGenerator}...`}
          disabled={isProcessing}
        />
        <button onClick={handleCommand} disabled={!prompt.trim() || isProcessing}>
          {isProcessing ? <RotateCw className="animate-spin" size={14} /> : <Send size={14} />}
        </button>
      </div>
    </div>
  );
}

// ============ 3D SCENE COMPONENT ============
function SceneContent() {
  const { activeGenerator } = useStore();

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8b5cf6" />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

      <group>
        {activeGenerator === 'shapes' && <InteractiveShape />}
        {activeGenerator === 'planet' && <ProceduralPlanet />}
        {activeGenerator === 'particles' && <ParticleField />}
        {activeGenerator === 'neural' && <NeuralNexus />}
      </group>

      <OrbitControls makeDefault enableDamping dampingFactor={0.05} minDistance={3} maxDistance={20} />
      <Environment preset="night" />
    </>
  );
}

function MainCanvas() {
  const { activeGenerator } = useStore();

  if (activeGenerator === 'fluid') {
    return <FluidSimulation />;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}

// ============ MAIN APP ============
function App() {
  return (
    <StoreProvider>
      <div className="app-container">
        <CodePreview />

        {/* LEFT PANEL: Sidebar + Controls + AI */}
        <div className="left-panel">
          <Sidebar />
          <Controls />
          <AICommander />
        </div>

        {/* RIGHT PANEL: 3D Canvas */}
        <div className="right-panel">
          <MainCanvas />
        </div>
      </div>
    </StoreProvider>
  );
}

export default App;
