
import { GoogleGenAI, Type } from "@google/genai";
import type { Settings, Scene } from '../types';

// IMPORTANT: This check is a placeholder. In a real environment, the API key would be set.
if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder.");
    process.env.API_KEY = "YOUR_API_KEY_HERE";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        scenes: {
            type: Type.ARRAY,
            description: "An array of generated scenes for the storyboard.",
            items: {
                type: Type.OBJECT,
                properties: {
                    promptEN: {
                        type: Type.STRING,
                        description: 'The detailed English prompt for the scene. It should describe actions, lighting, camera angles. It MUST NOT include the Character Bible.'
                    },
                    promptVI: {
                        type: Type.STRING,
                        description: 'The detailed Vietnamese prompt for the scene. It should describe actions, lighting, camera angles, and short, clear dialogue in Vietnamese if needed. It MUST NOT include the Character Bible.'
                    }
                },
                required: ["promptEN", "promptVI"]
            }
        }
    },
    required: ["scenes"]
};

const createSystemInstruction = (settings: Settings, characterBible: string, sceneCount: number, task: string) => `
You are an expert video storyboard creator for the VEO 3 AI video engine. Your task is to generate a series of detailed scene prompts based on user input.

**Strict Rules:**
1.  **JSON Output:** You MUST return a valid JSON object matching the provided schema.
2.  **Character Bible Exclusion:** DO NOT include the Character Bible in your generated 'promptEN' and 'promptVI' fields. The user interface will handle prepending it.
3.  **Language:** Generate both an English (promptEN) and a Vietnamese (promptVI) version for each scene.
4.  **Content:** Each prompt must be detailed, describing actions, lighting, camera angles, and style. Dialogue (in Vietnamese for promptVI) should be short and suitable for an 8-second scene.
5.  **Consistency:** Ensure style, aspect ratio, and lighting are consistent with the user's settings across all scenes.
6.  **Task:** ${task}

**User Inputs:**
- **Video Idea:** ${settings.videoIdea}
- **Bối cảnh (Context):** ${settings.context}
- **Thể loại (Genre/Style):** ${settings.genre}
- **Tỉ lệ khung hình (Aspect Ratio):** ${settings.aspectRatio}
- **Số lượng cảnh (Number of Scenes):** ${sceneCount}
- **Character Bible:**
  ---
  ${characterBible}
  ---
`;

export const generateStoryboard = async (settings: Settings, characterBible: string): Promise<Scene[]> => {
    const systemInstruction = createSystemInstruction(settings, characterBible, settings.numScenes, `Generate a full storyboard with ${settings.numScenes} scenes based on the video idea.`);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: "Please generate the storyboard now.",
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema
        }
    });

    try {
        const jsonResponse = JSON.parse(response.text);
        if (jsonResponse.scenes && Array.isArray(jsonResponse.scenes)) {
             return jsonResponse.scenes.map((scene: any, index: number) => ({
                id: Date.now() + index,
                basePromptEN: scene.promptEN || '',
                basePromptVI: scene.promptVI || ''
            }));
        }
        throw new Error("Invalid JSON structure from API.");
    } catch (e) {
        console.error("Failed to parse Gemini response:", response.text, e);
        throw new Error("Could not parse the response from the AI. It might be in an incorrect format.");
    }
};

export const regenerateScene = async (settings: Settings, characterBible: string, sceneToRegenerate: Scene): Promise<Omit<Scene, 'id'>> => {
     const systemInstruction = createSystemInstruction(settings, characterBible, 1, `Regenerate ONLY ONE scene. The previous version was: English - "${sceneToRegenerate.basePromptEN}" and Vietnamese - "${sceneToRegenerate.basePromptVI}". Create a new, different version of this scene.`);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: "Please regenerate just one scene.",
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema
        }
    });
    
    try {
        const jsonResponse = JSON.parse(response.text);
        if (jsonResponse.scenes && jsonResponse.scenes.length > 0) {
            const scene = jsonResponse.scenes[0];
            return {
                basePromptEN: scene.promptEN || '',
                basePromptVI: scene.promptVI || ''
            };
        }
        throw new Error("API did not return a scene for regeneration.");
    } catch (e) {
        console.error("Failed to parse Gemini response for regeneration:", response.text, e);
        throw new Error("Could not parse the regenerated scene from the AI.");
    }
}
