import { GoogleGenerativeAI } from "@google/generative-ai";
import { type GeneratorType, type AIConfig } from '../store/StoreContext';

type AIResult = {
    intent: GeneratorType | 'unknown';
    configUpdate?: Record<string, any>;
    message: string;
};

const SYSTEM_PROMPT = `You are the Aether AI, a 3D design assistant for AetherForge.
Your goal is to parse user natural language requests and convert them into 3D generator configurations.

Generators available:
- 'shapes': Basic 3D geometries (box, sphere, icosahedron, torus, octahedron). Parameters: geometryType, size (0.5 to 3), color (hex), wireframe (bool).
- 'planet': Procedural world. Parameters: detail (4 to 60), waterLevel (0 to 1), colorLand (hex), colorWater (hex), showAtmosphere (bool).
- 'particles': Moving flow of points. Parameters: count (100 to 5000), speed (0.1 to 5), spread (2 to 15), color (hex).
- 'fluid': Real-time fluid simulation. Parameters: curl (1 to 100), splatRadius (0.01 to 1), densityDissipation (0.1 to 10), shading (bool).
- 'neural': Pulsing network. Parameters: nodeCount (50 to 500), connectionRadius (1 to 5), pulseSpeed (0.1 to 5), baseColor (hex), glowColor (hex).
- 'void': Black hole accretion disk. Parameters: coreSize (0.5 to 3), diskColor (hex), distortion (0.1 to 5), intensity (0.5 to 3), rotationSpeed (0.1 to 2).

Rules:
1. Always respond with a VALID JSON object.
2. If the user wants to switch generator, set "intent" to that name.
3. If they want to change properties of the current generator, include them in "configUpdate".
4. Provide a friendly "message" about what you did.
5. If you cannot understand, set intent to 'unknown' and ask for clarification.

Return format:
{
  "intent": "shapes" | "planet" | "particles" | "fluid" | "neural" | "unknown",
  "configUpdate": { ... },
  "message": "Friendly confirmation text"
}`;

export const processAICommand = async (
    prompt: string,
    currentGenerator: GeneratorType,
    aiConfig: AIConfig
): Promise<AIResult> => {
    if (!aiConfig.apiKey) {
        throw new Error("API Key missing");
    }

    try {
        const genAI = new GoogleGenerativeAI(aiConfig.apiKey);
        const model = genAI.getGenerativeModel({ model: aiConfig.modelName });

        const fullPrompt = `Current Generator: ${currentGenerator}\nUser Request: ${prompt}\n\nRespond only with JSON based on the system instructions.`;

        const result = await model.generateContent([
            { text: SYSTEM_PROMPT },
            { text: fullPrompt }
        ]);

        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                intent: parsed.intent || currentGenerator,
                configUpdate: parsed.configUpdate || {},
                message: parsed.message || "Updated your design."
            };
        }

        throw new Error("Invalid AI response");
    } catch (error: any) {
        console.error("AI Service Error:", error);
        throw error;
    }
};
