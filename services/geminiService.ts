
import { GoogleGenAI, Type } from "@google/genai";
import { VideoPromptData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTechnicalPrompt = async (userIdea: string, imageBase64?: string): Promise<VideoPromptData> => {
  const modelId = "gemini-2.5-flash";

  let systemInstruction = `
    Act as an expert video prompt engineer for high-end AI video generation models like Google Veo and OpenAI Sora.
    
    Your task is to take a simple user idea (and optionally an input image) and expand it into a detailed, technical video specification JSON.
    Focus on cinematic terminology, precise lighting descriptions, and dynamic camera movements.
    
    Split the character description into two parts:
    1. "subject": Physical appearance (face, hair, body type, age, ethnicity).
    2. "outfit": Detailed clothing, costume, armor, accessories, and textures.
    
    If the idea implies characters speaking or a narrator, provide the script in the "dialogue" field. Otherwise, leave it empty.

    CRITICAL SAFETY & COMPLIANCE GUIDELINES (To prevent generation failure):
    1. NO REAL PEOPLE: Do not use names of celebrities, politicians, or public figures. Replace them with generic physical descriptions (e.g., instead of "Elon Musk", use "a wealthy tech entrepreneur in a suit").
    2. NO COPYRIGHTED CHARACTERS/IP: Do not use specific names like "Spider-Man", "Mickey Mouse", or "Star Wars". Use generic archetypes (e.g., "a masked superhero in a red and blue suit", "a space wizard with a laser sword").
    3. NO NSFW/VIOLENCE: The prompt must be safe for work. Avoid nudity, sexual acts, excessive gore, or self-harm.
    4. SANITIZE: If the user requests restricted content, rewrite it to be a safe, generic, and artistic equivalent without refusing the request entirely.
    5. NEGATIVE PROMPT: Automatically include safety guardrails in the 'negative_prompt' field (e.g., nsfw, nudity, watermark, text, distorted, ugly, blurry).
  `;

  if (imageBase64) {
    systemInstruction += `
    \nIMPORTANT: An image has been provided. Analyze the visual style, composition, subject, and lighting of this image heavily to construct the prompt. 
    Use the user's text idea to guide the *action* or *modification* of this base image.
    `;
  } else {
    systemInstruction += `\nUser Idea: "${userIdea}"`;
  }

  // Prepare contents. If image exists, we use multimodal input.
  const parts: any[] = [];
  
  if (imageBase64) {
    // Extract pure base64 if it has the data URL prefix
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg", // Assuming jpeg/png, Gemini handles common formats
        data: cleanBase64
      }
    });
    parts.push({ text: `Create a video prompt based on this image and this context: ${userIdea}` });
  } else {
    parts.push({ text: userIdea });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING, description: "Detailed description of the main subject(s) physical appearance (face, body, age, hair). Do not include clothing here." },
            outfit: { type: Type.STRING, description: "Detailed description of the subject's clothing, costume, accessories, and textures." },
            action: { type: Type.STRING, description: "Specific actions, movements, or interactions happening in the scene." },
            environment: { type: Type.STRING, description: "Detailed background, location, weather, and time of day." },
            lighting: { type: Type.STRING, description: "Technical lighting description (e.g., Golden hour, volumetric fog, cinematic rim lighting, softbox)." },
            camera_angle: { type: Type.STRING, description: "Camera angle (e.g., Low angle, bird's eye view, wide shot, macro)." },
            camera_movement: { type: Type.STRING, description: "Camera movement (e.g., Slow dolly zoom, tracking shot, handheld shake, static)." },
            mood: { type: Type.STRING, description: "Emotional tone and atmosphere (e.g., Melancholic, energetic, suspenseful, serene)." },
            style: { type: Type.STRING, description: "Visual style (e.g., Photorealistic 8k, Cyberpunk, 1950s film stock, 3D animation Pixar style)." },
            audio_prompt: { type: Type.STRING, description: "Description of sound effects and background music." },
            dialogue: { type: Type.STRING, description: "Spoken dialogue by characters or voiceover narration. Empty if silent." },
            negative_prompt: { type: Type.STRING, description: "Safety guardrails and elements to exclude (e.g., nsfw, nudity, deformed, distorted, text, watermark)." },
            duration_seconds: { type: Type.NUMBER, description: "Estimated optimal duration in seconds (usually 5-60)." },
            aspect_ratio: { type: Type.STRING, description: "Aspect ratio (e.g., 16:9, 9:16, 1:1)." },
          },
          required: [
            "subject", "outfit", "action", "environment", "lighting", 
            "camera_angle", "camera_movement", "mood", "style", 
            "audio_prompt", "dialogue", "negative_prompt", "duration_seconds", "aspect_ratio"
          ],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as VideoPromptData;
    } else {
      throw new Error("No response text received from Gemini.");
    }
  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
};
