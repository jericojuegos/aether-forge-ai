import { useState } from 'react';
import { Send, Bot, Sparkles, MessageSquare } from 'lucide-react';
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl z-30 px-4">
            {/* Response Message */}
            {lastResponse && (
                <div className="mb-3 glass-panel rounded-xl p-3 animate-fade-in-up">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-cyan-400 mb-1">Aether AI</p>
                            <p className="text-sm text-slate-300">{lastResponse}</p>
                        </div>
                        <button
                            onClick={() => setLastResponse(null)}
                            className="text-slate-500 hover:text-white text-lg leading-none"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Input Bar */}
            <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-violet-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative glass-panel rounded-2xl p-1.5 flex items-center gap-2">
                    {/* Status indicator */}
                    <div className="pl-3 pr-1">
                        {isProcessing ? (
                            <Sparkles className="animate-spin text-violet-400" size={18} />
                        ) : (
                            <MessageSquare size={18} className="text-slate-500" />
                        )}
                    </div>

                    {/* Input */}
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                        placeholder={`Describe your ${activeGenerator}... (e.g. "red torus", "mars planet")`}
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 h-10 px-2 text-sm"
                        disabled={isProcessing}
                    />

                    {/* Send Button */}
                    <button
                        onClick={handleCommand}
                        disabled={!prompt.trim() || isProcessing}
                        className="p-2.5 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-lg shadow-cyan-500/20"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>

            {/* Status bar */}
            <div className="flex justify-center items-center gap-4 mt-3 text-[10px] text-slate-600 font-mono">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>SYSTEM ONLINE</span>
                </div>
                <span>•</span>
                <span>GPU ACCELERATED</span>
                <span>•</span>
                <span>60 FPS</span>
            </div>
        </div>
    );
};
