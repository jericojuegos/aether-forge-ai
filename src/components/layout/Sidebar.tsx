import { useStore, type GeneratorType } from '../../store/StoreContext';
import { Box, Globe, Sparkles, Cpu, Zap, Droplets, Share2 } from 'lucide-react';

export const Sidebar = () => {
    const { activeGenerator, setActiveGenerator } = useStore();

    const navItems: { id: GeneratorType; label: string; icon: React.ReactNode }[] = [
        { id: 'shapes', label: 'Shapes', icon: <Box size={18} /> },
        { id: 'planet', label: 'Planet', icon: <Globe size={18} /> },
        { id: 'particles', label: 'Particles', icon: <Sparkles size={18} /> },
        { id: 'fluid' as const, label: 'Fluid', icon: <Droplets size={18} /> },
        { id: 'neural' as const, label: 'Neural', icon: <Share2 size={18} /> },
        { id: 'void' as const, label: 'Cosmic Void', icon: <Zap size={18} /> },
    ];

    return (
        <aside className="w-72 h-full glass-panel flex flex-col z-30 relative shrink-0">
            {/* Header */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Cpu className="text-white" size={22} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-wide bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
                            AETHERFORGE
                        </h1>
                        <p className="text-[10px] text-slate-500 font-mono tracking-widest">
                            3D VISUALIZATION STUDIO
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                    Generators
                </p>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveGenerator(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
              ${activeGenerator === item.id
                                ? 'btn-neon active'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className={activeGenerator === item.id ? 'text-cyan-400' : ''}>
                            {item.icon}
                        </span>
                        <span className="font-medium text-sm">{item.label}</span>
                        {activeGenerator === item.id && (
                            <Zap size={12} className="ml-auto text-cyan-400" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow" />
                    <span>SYSTEM ONLINE</span>
                </div>
                <p className="text-[10px] text-slate-600 mt-1">AETHER CORE v2.0.1</p>
            </div>
        </aside>
    );
};
