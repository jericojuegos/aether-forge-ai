import { useState } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { processAICommand } from '../../services/ai';

export const AICommander = () => {
    const [prompt, setPrompt] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastResponse, setLastResponse] = useState<string | null>(null);
    const {
        activeGenerator, setActiveGenerator,
        updateShapeConfig, updatePlanetConfig, updateParticleConfig
    } = useStore();

    const handleCommand = async () => {
        if (!prompt.trim()) return;

        setIsProcessing(true);

        try {
            const result = await processAICommand(prompt, activeGenerator);

            if (result.intent !== activeGenerator && result.intent !== 'unknown') {
                setActiveGenerator(result.intent);
            }

            if (result.configUpdate && Object.keys(result.configUpdate).length > 0) {
                if (result.intent === 'shapes') updateShapeConfig(result.configUpdate);
                if (result.intent === 'planet') updatePlanetConfig(result.configUpdate);
                if (result.intent === 'particles') updateParticleConfig(result.configUpdate);
            }

            setLastResponse(result.message);
        } catch {
            setLastResponse("Systems offline. Please try again.");
        } finally {
            setIsProcessing(false);
            setPrompt('');
        }
    };

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-30 px-4">
            {lastResponse && (
                <div className="mb-4 bg-aether-panel backdrop-blur-md border border-aether-accent/20 rounded-lg p-3 text-sm flex items-start gap-3 animate-fade-in-up">
                    <div className="bg-aether-accent/10 p-1.5 rounded-md">
                        <Bot size={16} className="text-aether-accent" />
                    </div>
                    <div className="flex-1">
                        <span className="font-semibold text-aether-accent block mb-1">Aether AI</span>
                        <p className="text-slate-300">{lastResponse}</p>
                    </div>
                    <button onClick={() => setLastResponse(null)} className="text-slate-500 hover:text-white">×</button>
                </div>
            )}

            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-xl p-2 flex items-center gap-2 shadow-2xl">
                    <div className="pl-3 pr-2">
                        {isProcessing ? (
                            <Sparkles className="animate-spin text-purple-400" size={20} />
                        ) : (
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                        )}
                    </div>

                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                        placeholder={`Ask Aether to design your ${activeGenerator}...`}
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 h-10 px-2"
                        disabled={isProcessing}
                    />

                    <button
                        onClick={handleCommand}
                        disabled={!prompt.trim() || isProcessing}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            <div className="text-center mt-3 text-xs text-slate-500 font-mono">
                System Status: <span className="text-emerald-500">OPTIMAL</span> | GPU Acceleration: <span className="text-emerald-500">ACTIVE</span>
            </div>
        </div>
    );
};
