
export interface VideoPromptData {
  subject: string;
  outfit: string;
  action: string;
  environment: string;
  lighting: string;
  camera_angle: string;
  camera_movement: string;
  mood: string;
  style: string;
  audio_prompt: string;
  dialogue: string;
  negative_prompt: string;
  duration_seconds: number;
  aspect_ratio: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  userIdea: string;
  technicalPrompt: VideoPromptData;
  imageBase64?: string; // Optional base64 string for image-to-prompt history
}

export enum AppStep {
  IDEA_INPUT = 'IDEA_INPUT',
  GENERATING = 'GENERATING',
  EDIT_DETAILS = 'EDIT_DETAILS',
  JSON_RESULT = 'JSON_RESULT',
  HISTORY = 'HISTORY'
}
