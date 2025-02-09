import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    const response = await fetch(`${process.env.LLAMAEDGE_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LLAMAEDGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.LLAMAEDGE_MODEL_NAME,
        messages: [{ role: 'user', content: message }],
        // Add any additional parameters required by your Stockbot configuration
      }),
    });

    const data = await response.json();
    return NextResponse.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
} 