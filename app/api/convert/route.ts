import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    // 调用Dify API
    const response = await fetch('YOUR_DIFY_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        // 添加其他Dify API需要的参数
      })
    });

    if (!response.ok) {
      throw new Error('Failed to convert content');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert content' },
      { status: 500 }
    );
  }
} 