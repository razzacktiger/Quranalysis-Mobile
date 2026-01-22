import { getGenerativeModel, Schema, SchemaType } from '@firebase/ai';
import { ai } from '../firebase';

const MODEL_NAME = 'gemini-2.5-flash';

const model = getGenerativeModel(ai, {
  model: MODEL_NAME,
});

export interface AIResponse {
  text: string;
}

export async function sendMessage(prompt: string): Promise<AIResponse> {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return { text };
  } catch (error) {
    throw new Error(
      `AI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function sendMessageWithSchema<T>(
  prompt: string,
  schema: Schema
): Promise<T> {
  try {
    const modelWithSchema = getGenerativeModel(ai, {
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const result = await modelWithSchema.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return JSON.parse(text) as T;
  } catch (error) {
    throw new Error(
      `AI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export { Schema, SchemaType };

export async function testAIConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const result = await model.generateContent('Say "Hello from Gemini!" in exactly 5 words.');
    const text = result.response.text();
    return {
      success: true,
      message: `AI Response: ${text}`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
