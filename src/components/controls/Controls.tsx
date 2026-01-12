import { useStore } from '../../store/StoreContext';
import { Sliders, Palette, RotateCw } from 'lucide-react';

export const Controls = () => {
    const {
        activeGenerator,
        shapeConfig, updateShapeConfig,
        planetConfig, updatePlanetConfig,
        particleConfig, updateParticleConfig
    } = useStore();

    const renderShapeControls = () => (
        <div className="space-y-5">
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Geometry
                </label>
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

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Size</label>
                    <span className="text-xs font-mono text-cyan-400">{shapeConfig.size.toFixed(1)}</span>
                </div>
                <input
                    type="range" min="0.5" max="3" step="0.1"
                    value={shapeConfig.size}
                    onChange={(e) => updateShapeConfig({ size: parseFloat(e.target.value) })}
                    className="w-full"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Palette size={12} /> Color
                </label>
                <input
                    type="color"
                    value={shapeConfig.color}
                    onChange={(e) => updateShapeConfig({ color: e.target.value })}
                />
            </div>

            <div className="flex items-center gap-3 py-2">
                <input
                    type="checkbox"
                    id="wireframe"
                    checked={shapeConfig.wireframe}
                    onChange={(e) => updateShapeConfig({ wireframe: e.target.checked })}
                />
                <label htmlFor="wireframe" className="text-sm text-slate-300 cursor-pointer">
                    Wireframe Mode
                </label>
            </div>

            <div className="flex items-center gap-3 py-2">
                <input
                    type="checkbox"
                    id="autoRotate"
                    checked={shapeConfig.autoRotate}
                    onChange={(e) => updateShapeConfig({ autoRotate: e.target.checked })}
                />
                <label htmlFor="autoRotate" className="text-sm text-slate-300 cursor-pointer flex items-center gap-2">
                    <RotateCw size={14} /> Auto Rotate
                </label>
            </div>
        </div>
    );

    const renderPlanetControls = () => (
        <div className="space-y-5">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detail Level</label>
                    <span className="text-xs font-mono text-cyan-400">{planetConfig.detail}</span>
                </div>
                <input
                    type="range" min="4" max="60" step="2"
                    value={planetConfig.detail}
                    onChange={(e) => updatePlanetConfig({ detail: parseInt(e.target.value) })}
                    className="w-full"
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Water Level</label>
                    <span className="text-xs font-mono text-blue-400">{(planetConfig.waterLevel * 100).toFixed(0)}%</span>
                </div>
                <input
                    type="range" min="0" max="1" step="0.05"
                    value={planetConfig.waterLevel}
                    onChange={(e) => updatePlanetConfig({ waterLevel: parseFloat(e.target.value) })}
                    className="w-full"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Land</label>
                    <input
                        type="color"
                        value={planetConfig.colorLand}
                        onChange={(e) => updatePlanetConfig({ colorLand: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Water</label>
                    <input
                        type="color"
                        value={planetConfig.colorWater}
                        onChange={(e) => updatePlanetConfig({ colorWater: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 py-2">
                <input
                    type="checkbox"
                    id="atmosphere"
                    checked={planetConfig.showAtmosphere}
                    onChange={(e) => updatePlanetConfig({ showAtmosphere: e.target.checked })}
                />
                <label htmlFor="atmosphere" className="text-sm text-slate-300 cursor-pointer">
                    Show Atmosphere
                </label>
            </div>
        </div>
    );

    const renderParticleControls = () => (
        <div className="space-y-5">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Particle Count</label>
                    <span className="text-xs font-mono text-violet-400">{particleConfig.count.toLocaleString()}</span>
                </div>
                <input
                    type="range" min="100" max="5000" step="100"
                    value={particleConfig.count}
                    onChange={(e) => updateParticleConfig({ count: parseInt(e.target.value) })}
                    className="w-full"
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Speed</label>
                    <span className="text-xs font-mono text-violet-400">{particleConfig.speed.toFixed(1)}x</span>
                </div>
                <input
                    type="range" min="0.1" max="5" step="0.1"
                    value={particleConfig.speed}
                    onChange={(e) => updateParticleConfig({ speed: parseFloat(e.target.value) })}
                    className="w-full"
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Spread</label>
                    <span className="text-xs font-mono text-violet-400">{particleConfig.spread}</span>
                </div>
                <input
                    type="range" min="2" max="15" step="1"
                    value={particleConfig.spread}
                    onChange={(e) => updateParticleConfig({ spread: parseFloat(e.target.value) })}
                    className="w-full"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Palette size={12} /> Color
                </label>
                <input
                    type="color"
                    value={particleConfig.color}
                    onChange={(e) => updateParticleConfig({ color: e.target.value })}
                />
            </div>
        </div>
    );

    const titles: Record<string, string> = {
        shapes: 'Shape Controls',
        planet: 'Planet Controls',
        particles: 'Particle Controls'
    };

    return (
        <div className="absolute top-4 right-4 z-20 w-72 glass-panel rounded-2xl overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <Sliders size={16} className="text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {titles[activeGenerator]}
                </h3>
            </div>

            <div className="p-5">
                {activeGenerator === 'shapes' && renderShapeControls()}
                {activeGenerator === 'planet' && renderPlanetControls()}
                {activeGenerator === 'particles' && renderParticleControls()}
            </div>
        </div>
    );
};
