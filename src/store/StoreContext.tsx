import { createContext, useContext, useState, type ReactNode } from 'react';

export type GeneratorType = 'shapes' | 'planet' | 'particles';

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

interface AppState {
    activeGenerator: GeneratorType;
    shapeConfig: ShapeConfig;
    planetConfig: PlanetConfig;
    particleConfig: ParticleConfig;
    viewMode: 'visual' | 'code';
    codePlatform: 'react' | 'threejs' | 'wordpress';
}

interface AppContextType extends AppState {
    setActiveGenerator: (type: GeneratorType) => void;
    updateShapeConfig: (update: Partial<ShapeConfig>) => void;
    updatePlanetConfig: (update: Partial<PlanetConfig>) => void;
    updateParticleConfig: (update: Partial<ParticleConfig>) => void;
    toggleViewMode: () => void;
    setCodePlatform: (platform: 'react' | 'threejs' | 'wordpress') => void;
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

    const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
    const [codePlatform, setCodePlatform] = useState<'react' | 'threejs' | 'wordpress'>('react');

    const updateShapeConfig = (update: Partial<ShapeConfig>) => setShapeConfig(prev => ({ ...prev, ...update }));
    const updatePlanetConfig = (update: Partial<PlanetConfig>) => setPlanetConfig(prev => ({ ...prev, ...update }));
    const updateParticleConfig = (update: Partial<ParticleConfig>) => setParticleConfig(prev => ({ ...prev, ...update }));
    const toggleViewMode = () => setViewMode(prev => prev === 'visual' ? 'code' : 'visual');

    return (
        <StoreContext.Provider value={{
            activeGenerator,
            shapeConfig,
            planetConfig,
            particleConfig,
            viewMode,
            codePlatform,
            setActiveGenerator,
            updateShapeConfig,
            updatePlanetConfig,
            updateParticleConfig,
            toggleViewMode,
            setCodePlatform
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
