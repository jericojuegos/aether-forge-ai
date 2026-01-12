import React from 'react';
import { useStore, type GeneratorType } from '../../store/StoreContext';
import { Box, Globe, Sparkles, Cpu } from 'lucide-react';

export const Sidebar = () => {
    const { activeGenerator, setActiveGenerator } = useStore();

    const navItems: { id: GeneratorType; label: string; icon: React.ReactNode }[] = [
        { id: 'shapes', label: 'Shapes', icon: <Box size={20} /> },
        { id: 'planet', label: 'Planet', icon: <Globe size={20} /> },
        { id: 'particles', label: 'Particles', icon: <Sparkles size={20} /> },
    ];

    return (
        <div className="w-64 h-full bg-aether-bg/80 backdrop-blur-xl border-r border-slate-800 flex flex-col p-4 z-20 absolute top-0 left-0">
            <div className="flex items-center gap-3 mb-8 px-2">
                <Cpu className="text-aether-accent" size={32} />
                <h1 className="text-xl font-bold font-mono tracking-wider bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                    AETHER
                    <span className="text-slate-400 font-light text-sm block tracking-widest">FORGE</span>
                </h1>
            </div>

            <nav className="space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveGenerator(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group
              ${activeGenerator === item.id
                                ? 'bg-gradient-to-r from-aether-accent/20 to-transparent border-l-2 border-aether-accent text-aether-accent'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className={activeGenerator === item.id ? 'stroke-[2px]' : ''}>
                            {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono">
                <p>AETHER CORE v2.0</p>
                <p className="opacity-50">SYSTEM ONLINE</p>
            </div>
        </div>
    );
};
