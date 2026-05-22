export type VoiceCloneStatus = "none" | "processing" | "ready" | "failed";

export type AppSettings = {
  id: number;
  elevenlabs_voice_id: string | null;
  voice_clone_status: VoiceCloneStatus;
  updated_at: string;
};

export type AudioGenerationStatus = "processing" | "ready" | "failed";

export type AudioGeneration = {
  id: string;
  title: string;
  source_text: string;
  source_url: string | null;
  audio_path: string | null;
  duration_seconds: number | null;
  status: AudioGenerationStatus;
  error_message: string | null;
  created_at: string;
};
