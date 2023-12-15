import OpenAI from 'openai';
import path from 'path';
import fs from 'fs';

const openAi = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY
});

export async function describeImage(imagePath: string) {
  try {
    function encodeImage(imagePath: string): string {
      const imageBuffer = fs.readFileSync(imagePath);
      return imageBuffer.toString('base64');
    }

    const base64Image = encodeImage(imagePath);

    const description = await openAi.chat.completions.create({
      model: 'gpt-4-vision-preview',
      max_tokens: 100,
      messages: [
        {
          role: 'system',
          content: 'You must respond as if you were David Attenborough.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Describe what is in this image. Maximum of one sentence! You must be concise.'
            },

            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ]
    });
    return description.choices[0].message.content;
  } catch (error) {
    console.log(error);
  }
}

export async function textToAudio(prompt: string) {
  try {
    const speechFile = path.resolve('./speech.mp3');

    const mp3 = await openAi.audio.speech.create({
      model: 'tts-1',
      voice: 'fable',
      input: prompt,
      response_format: 'mp3'
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
  } catch (error) {
    console.log(error);
  }
}
