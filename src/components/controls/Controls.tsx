import { useStore } from '../../store/StoreContext';

export const Controls = () => {
    const {
        activeGenerator,
        shapeConfig, updateShapeConfig,
        planetConfig, updatePlanetConfig,
        particleConfig, updateParticleConfig
    } = useStore();

    const renderShapeControls = () => (
        <>
            <div className="control-group">
                <label>Geometry</label>
                <select
                    value={shapeConfig.geometryType}
                    onChange={(e) => updateShapeConfig({ geometryType: e.target.value as 'icosahedron' | 'sphere' | 'box' | 'torus' | 'octahedron' })}
                >
                    <option value="icosahedron">Icosahedron</option>
                    <option value="sphere">Sphere</option>
                    <option value="box">Box</option>
                    <option value="torus">Torus</option>
                    <option value="octahedron">Octahedron</option>
                </select>
            </div>

            <div className="control-group">
                <label>Size: {shapeConfig.size.toFixed(1)}</label>
                <input
                    type="range" min="0.5" max="3" step="0.1"
                    value={shapeConfig.size}
                    onChange={(e) => updateShapeConfig({ size: parseFloat(e.target.value) })}
                />
            </div>

            <div className="control-group">
                <label>Color</label>
                <input
                    type="color"
                    value={shapeConfig.color}
                    onChange={(e) => updateShapeConfig({ color: e.target.value })}
                />
            </div>

            <div className="control-group checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={shapeConfig.wireframe}
                        onChange={(e) => updateShapeConfig({ wireframe: e.target.checked })}
                    />
                    Wireframe Mode
                </label>
            </div>

            <div className="control-group checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={shapeConfig.autoRotate}
                        onChange={(e) => updateShapeConfig({ autoRotate: e.target.checked })}
                    />
                    Auto Rotate
                </label>
            </div>
        </>
    );

    const renderPlanetControls = () => (
        <>
            <div className="control-group">
                <label>Detail Level: {planetConfig.detail}</label>
                <input
                    type="range" min="0" max="60" step="1"
                    value={planetConfig.detail}
                    onChange={(e) => updatePlanetConfig({ detail: parseInt(e.target.value) })}
                />
            </div>
            <div className="control-group">
                <label>Water Level: {planetConfig.waterLevel.toFixed(2)}</label>
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
        </>
    );

    const renderParticleControls = () => (
        <>
            <div className="control-group">
                <label>Particle Count: {particleConfig.count}</label>
                <input
                    type="range" min="100" max="5000" step="100"
                    value={particleConfig.count}
                    onChange={(e) => updateParticleConfig({ count: parseInt(e.target.value) })}
                />
            </div>
            <div className="control-group">
                <label>Speed: {particleConfig.speed.toFixed(1)}</label>
                <input
                    type="range" min="0.1" max="5" step="0.1"
                    value={particleConfig.speed}
                    onChange={(e) => updateParticleConfig({ speed: parseFloat(e.target.value) })}
                />
            </div>
            <div className="control-group">
                <label>Color</label>
                <input
                    type="color"
                    value={particleConfig.color}
                    onChange={(e) => updateParticleConfig({ color: e.target.value })}
                />
            </div>
        </>
    );

    return (
        <div className="absolute top-4 right-4 z-20 w-80 bg-aether-panel backdrop-blur-md rounded-lg border border-slate-800 p-4 shadow-xl animate-fade-in-left">
            <h3 className="text-sm font-bold text-slate-300 mb-4 border-b border-white/10 pb-2 uppercase tracking-wider">
                {activeGenerator} Controls
            </h3>

            <div className="space-y-4">
                {activeGenerator === 'shapes' && renderShapeControls()}
                {activeGenerator === 'planet' && renderPlanetControls()}
                {activeGenerator === 'particles' && renderParticleControls()}
            </div>

            <style>{`
                .control-group label {
                    display: block;
                    font-size: 0.75rem;
                    color: #94a3b8;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }
                .control-group select, .control-group input[type="text"] {
                    width: 100%;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    padding: 0.5rem;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                }
                .control-group input[type="range"] {
                    width: 100%;
                    accent-color: #06b6d4;
                }
                .control-group input[type="color"] {
                    width: 100%;
                    height: 32px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                }
                .control-group.checkbox label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    color: #e2e8f0;
                }
                .control-group.checkbox input {
                    accent-color: #06b6d4;
                    width: 1rem;
                    height: 1rem;
                }
            `}</style>
        </div>
    );
};
