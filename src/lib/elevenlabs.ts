import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

let _client: ElevenLabsClient | null = null;

export function getElevenLabsClient(): ElevenLabsClient {
  if (!_client) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error("ELEVENLABS_API_KEY is not set");
    }
    _client = new ElevenLabsClient({ apiKey });
  }
  return _client;
}

export const ELEVENLABS_MODEL_ID =
  process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

export async function cloneVoiceFromSample(args: {
  name: string;
  sample: Blob;
  filename: string;
  description?: string;
}): Promise<string> {
  const client = getElevenLabsClient();
  const result = await client.voices.ivc.create({
    name: args.name,
    files: [new File([args.sample], args.filename, { type: args.sample.type })],
    description: args.description,
  });
  if (!result.voiceId) {
    throw new Error("ElevenLabs did not return a voice_id");
  }
  return result.voiceId;
}

export async function deleteVoice(voiceId: string): Promise<void> {
  const client = getElevenLabsClient();
  await client.voices.delete(voiceId);
}

export async function generateSpeech(args: {
  voiceId: string;
  text: string;
}): Promise<Uint8Array> {
  const client = getElevenLabsClient();
  const audioStream = await client.textToSpeech.convert(args.voiceId, {
    text: args.text,
    modelId: ELEVENLABS_MODEL_ID,
    outputFormat: "mp3_44100_128",
  });

  const chunks: Uint8Array[] = [];
  const reader = audioStream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return merged;
}

const MAX_CHARS_PER_REQUEST = 4500;

export function chunkTextForTTS(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= MAX_CHARS_PER_REQUEST) return [normalized];

  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let current = "";

  for (const p of paragraphs) {
    const para = p.trim();
    if (!para) continue;

    if (para.length > MAX_CHARS_PER_REQUEST) {
      if (current) {
        chunks.push(current.trim());
        current = "";
      }
      const sentences = para.split(/(?<=[.!?])\s+/);
      let sentChunk = "";
      for (const s of sentences) {
        if ((sentChunk + " " + s).length > MAX_CHARS_PER_REQUEST) {
          if (sentChunk) chunks.push(sentChunk.trim());
          sentChunk = s;
        } else {
          sentChunk = sentChunk ? `${sentChunk} ${s}` : s;
        }
      }
      if (sentChunk) chunks.push(sentChunk.trim());
      continue;
    }

    if ((current + "\n\n" + para).length > MAX_CHARS_PER_REQUEST) {
      chunks.push(current.trim());
      current = para;
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

export async function generateSpeechForLongText(args: {
  voiceId: string;
  text: string;
}): Promise<Uint8Array> {
  const chunks = chunkTextForTTS(args.text);
  const parts: Uint8Array[] = [];
  for (const chunk of chunks) {
    const audio = await generateSpeech({ voiceId: args.voiceId, text: chunk });
    parts.push(audio);
  }
  const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    merged.set(part, offset);
    offset += part.length;
  }
  return merged;
}

export function estimateDurationSeconds(text: string): number {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.round((wordCount / 150) * 60);
}
