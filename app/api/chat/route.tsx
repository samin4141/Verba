// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HF_API_KEY!)

export async function POST(request: NextRequest) {
  const { messages } = await request.json() as {
    messages: { role: 'user' | 'assistant'; content: string }[]
  }
  if (!messages?.length) {
    return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
  }

  const prompt =
    messages
      .map(m => (m.role === 'user' ? `User: ${m.content}` : `AI: ${m.content}`))
      .join('\n') + '\nAI:'

  try {
    const output = await hf.textGeneration({
      model: 'tiiuae/falcon-7b-instruct',
      inputs: prompt,
      parameters: { max_new_tokens: 150, do_sample: true, temperature: 0.7 },
    })

    const text = Array.isArray(output)
      ? output[0].generated_text
      : (output as any).generated_text
    const reply = text.replace(prompt, '').trim()

    return NextResponse.json({ message: { role: 'assistant', content: reply } })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Inference failed' }, { status: 500 })
  }
}
