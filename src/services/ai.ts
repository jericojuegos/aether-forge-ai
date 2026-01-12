import { type GeneratorType } from '../store/StoreContext';

type AIResult = {
    intent: GeneratorType | 'unknown';
    configUpdate?: Record<string, any>;
    message: string;
};

export const processAICommand = (prompt: string, currentGenerator: GeneratorType): Promise<AIResult> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const p = prompt.toLowerCase();
            let intent = currentGenerator;
            const update: any = {};
            let message = "I've updated the design based on your request.";

            // Detect Intent Switch
            if (p.includes('shape') || p.includes('geometry')) intent = 'shapes';
            if (p.includes('planet') || p.includes('world') || p.includes('earth')) intent = 'planet';
            if (p.includes('particle') || p.includes('stars') || p.includes('flow')) intent = 'particles';

            // Colors
            const colors: Record<string, string> = {
                red: '#ef4444', blue: '#3b82f6', green: '#10b981',
                cyan: '#06b6d4', purple: '#8b5cf6', orange: '#f97316',
                pink: '#ec4899', yellow: '#eab308', white: '#ffffff',
                void: '#000000', gold: '#ffd700', emerald: '#10b981'
            };

            let foundColor = null;
            for (const [name, hex] of Object.entries(colors)) {
                if (p.includes(name)) foundColor = hex;
            }

            // Shape Logic
            if (intent === 'shapes') {
                if (p.includes('sphere')) update.geometryType = 'sphere';
                if (p.includes('box') || p.includes('cube')) update.geometryType = 'box';
                if (p.includes('torus') || p.includes('donut')) update.geometryType = 'torus';
                if (p.includes('pyramid') || p.includes('octahedron')) update.geometryType = 'octahedron';

                if (p.includes('big') || p.includes('huge')) update.size = 2.5;
                if (p.includes('small') || p.includes('tiny')) update.size = 0.8;

                if (p.includes('wireframe')) update.wireframe = true;
                if (p.includes('solid')) update.wireframe = false;

                if (foundColor) update.color = foundColor;

                if (Object.keys(update).length === 0) message = "I switched to Shapes, but didn't catch specific details. Try 'red box' or 'huge sphere'.";
            }

            // Planet Logic
            if (intent === 'planet') {
                if (p.includes('earth')) {
                    update.colorLand = '#10b981';
                    update.colorWater = '#3b82f6';
                    update.waterLevel = 0.5;
                    update.showAtmosphere = true;
                }
                if (p.includes('mars')) {
                    update.colorLand = '#ef4444';
                    update.colorWater = '#7f1d1d';
                    update.waterLevel = 0.1;
                    update.showAtmosphere = true;
                }
                if (p.includes('ice') || p.includes('hoth')) {
                    update.colorLand = '#ffffff';
                    update.colorWater = '#cbd5e1';
                    update.waterLevel = 0.6;
                }

                if (p.includes('more water') || p.includes('flood')) update.waterLevel = 0.8;
                if (p.includes('less water') || p.includes('dry')) update.waterLevel = 0.2;

                if (foundColor) update.colorLand = foundColor;
            }

            // Particle Logic
            if (intent === 'particles') {
                if (p.includes('fast') || p.includes('speed')) update.speed = 3;
                if (p.includes('slow')) update.speed = 0.2;
                if (p.includes('many') || p.includes('more')) update.count = 5000;
                if (p.includes('few') || p.includes('less')) update.count = 500;

                if (foundColor) update.color = foundColor;
            }

            resolve({ intent, configUpdate: update, message });
        }, 800); // Simulated "thinking" delay
    });
};
