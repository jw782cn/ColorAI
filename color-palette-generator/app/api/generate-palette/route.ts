import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.siliconflow.cn/v1',
});

export async function POST(req: Request) {
  const { prompt } = await req.json();
  console.log('Prompt:', prompt);

  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V2-Chat",
      stream: false,
      messages: [
        {
          role: "system",
          content: "You are a color palette generator. Generate 3 color pallete with 5 colors each based on the given prompt. Return the result as an array of arrays, where each inner array represents a palette of 5 hexadecimal color codes. Only output array, nothing else!"
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const result = response.choices[0].message.content || '[]';
    // try to parse result into json array
    const palettes = JSON.parse(result);
    // sort palettes by hex color code
    palettes.forEach(palette => palette.sort());
    return NextResponse.json({ palettes });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate color palettes' }, { status: 500 });
  }
}
