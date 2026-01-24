import { createContext, useContext, useState, type ReactNode } from 'react';

export type GeneratorType = 'shapes' | 'planet' | 'particles' | 'fluid' | 'neural' | 'void';

export interface ShapeConfig {
    geometryType: 'icosahedron' | 'sphere' | 'box' | 'torus' | 'octahedron';
    size: number;
    color: string;
    wireframe: boolean;
    autoRotate: boolean;
}

export interface PlanetConfig {
    detail: number;
    waterLevel: number; // 0-1
    showAtmosphere: boolean;
    colorLand: string;
    colorWater: string;
}

export interface ParticleConfig {
    count: number;
    color: string;
    speed: number;
    spread: number;
}

export interface FluidConfig {
    simResolution: number;
    dyeResolution: number;
    densityDissipation: number;
    velocityDissipation: number;
    pressure: number;
    curl: number;
    splatRadius: number;
    shading: boolean;
    colorSpeed: number;
    paused: boolean;
}

export interface NeuralConfig {
    nodeCount: number;
    connectionRadius: number;
    pulseSpeed: number;
    baseColor: string;
    glowColor: string;
}

export interface VoidConfig {
    coreSize: number;
    diskColor: string;
    distortion: number;
    intensity: number;
    rotationSpeed: number;
}


export interface AIConfig {
    apiKey: string;
    modelName: string;
}

interface AppState {
    activeGenerator: GeneratorType;
    shapeConfig: ShapeConfig;
    planetConfig: PlanetConfig;
    particleConfig: ParticleConfig;
    fluidConfig: FluidConfig;
    neuralConfig: NeuralConfig;
    voidConfig: VoidConfig;
    viewMode: 'visual' | 'code';
    codePlatform: 'react' | 'threejs' | 'wordpress';
    aiConfig: AIConfig;
    view: 'landing' | 'studio';
}

interface AppContextType extends AppState {
    setActiveGenerator: (type: GeneratorType) => void;
    updateShapeConfig: (update: Partial<ShapeConfig>) => void;
    updatePlanetConfig: (update: Partial<PlanetConfig>) => void;
    updateParticleConfig: (update: Partial<ParticleConfig>) => void;
    updateFluidConfig: (update: Partial<FluidConfig>) => void;
    updateNeuralConfig: (update: Partial<NeuralConfig>) => void;
    updateVoidConfig: (update: Partial<VoidConfig>) => void;
    updateAIConfig: (update: Partial<AIConfig>) => void;
    toggleViewMode: () => void;
    setCodePlatform: (platform: 'react' | 'threejs' | 'wordpress') => void;
    setView: (view: 'landing' | 'studio') => void;
}

const StoreContext = createContext<AppContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [activeGenerator, setActiveGenerator] = useState<GeneratorType>('shapes');

    const [shapeConfig, setShapeConfig] = useState<ShapeConfig>({
        geometryType: 'icosahedron',
        size: 1.5,
        color: '#06b6d4', // cyan-500
        wireframe: true,
        autoRotate: true,
    });

    const [planetConfig, setPlanetConfig] = useState<PlanetConfig>({
        detail: 16,
        waterLevel: 0.4,
        showAtmosphere: true,
        colorLand: '#10b981', // emerald-500
        colorWater: '#3b82f6', // blue-500
    });

    const [particleConfig, setParticleConfig] = useState<ParticleConfig>({
        count: 2000,
        color: '#8b5cf6', // violet-500
        speed: 1,
        spread: 5,
    });

    const [fluidConfig, setFluidConfig] = useState<FluidConfig>({
        simResolution: 128,
        dyeResolution: 1024,
        densityDissipation: 3.5,
        velocityDissipation: 2,
        pressure: 0.8,
        curl: 30,
        splatRadius: 0.25,
        shading: true,
        colorSpeed: 10,
        paused: false
    });

    const [neuralConfig, setNeuralConfig] = useState<NeuralConfig>({
        nodeCount: 100,
        connectionRadius: 2.5,
        pulseSpeed: 1,
        baseColor: '#2563eb', // blue-600
        glowColor: '#60a5fa', // blue-400
    });

    const [voidConfig, setVoidConfig] = useState<VoidConfig>({
        coreSize: 1.5,
        diskColor: '#a855f7', // purple-500
        distortion: 2.0,
        intensity: 1.5,
        rotationSpeed: 0.5
    });

    const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
    const [codePlatform, setCodePlatform] = useState<'react' | 'threejs' | 'wordpress'>('react');
    const [aiConfig, setAIConfig] = useState<AIConfig>({
        apiKey: '',
        modelName: 'gemini-2.0-flash'
    });

    const [view, setView] = useState<'landing' | 'studio'>('landing');

    const updateShapeConfig = (update: Partial<ShapeConfig>) => setShapeConfig(prev => ({ ...prev, ...update }));
    const updatePlanetConfig = (update: Partial<PlanetConfig>) => setPlanetConfig(prev => ({ ...prev, ...update }));
    const updateParticleConfig = (update: Partial<ParticleConfig>) => setParticleConfig(prev => ({ ...prev, ...update }));
    const updateFluidConfig = (update: Partial<FluidConfig>) => setFluidConfig(prev => ({ ...prev, ...update }));
    const updateNeuralConfig = (update: Partial<NeuralConfig>) => setNeuralConfig(prev => ({ ...prev, ...update }));
    const updateVoidConfig = (update: Partial<VoidConfig>) => setVoidConfig(prev => ({ ...prev, ...update }));
    const updateAIConfig = (update: Partial<AIConfig>) => setAIConfig(prev => ({ ...prev, ...update }));
    const toggleViewMode = () => setViewMode(prev => prev === 'visual' ? 'code' : 'visual');

    return (
        <StoreContext.Provider value={{
            activeGenerator,
            shapeConfig,
            planetConfig,
            particleConfig,
            fluidConfig,
            neuralConfig,
            voidConfig,
            viewMode,
            codePlatform,
            aiConfig,
            setActiveGenerator,
            updateShapeConfig,
            updatePlanetConfig,
            updateParticleConfig,
            updateFluidConfig,
            updateNeuralConfig,
            updateVoidConfig,
            updateAIConfig,
            toggleViewMode,
            setCodePlatform,
            view,
            setView
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useStore must be used within StoreProvider");
    return context;
};
