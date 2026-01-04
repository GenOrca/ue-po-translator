import { NextRequest, NextResponse } from 'next/server';

const VARCO_API_URL = 'https://openapi.ai.nc.com/mt/chat-content/v1/translate';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { source_text, source_lang, target_lang, game_code = 'linw', api_key } = body;

    // Use client-provided API key or fall back to environment variable
    const apiKey = api_key || process.env.VARCO_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: 'API key not configured. Please set VARCO_API_KEY environment variable or provide your own API key.' },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!source_text || !source_lang || !target_lang) {
      return NextResponse.json(
        { message: 'Missing required fields: source_text, source_lang, target_lang' },
        { status: 400 }
      );
    }

    // Call VARCO API
    const varcoRequest = {
      TID: crypto.randomUUID(),
      game_code,
      provider: 'chat',
      source_lang,
      source_text,
      target_lang,
    };

    console.log('VARCO API Request:', varcoRequest);

    const response = await fetch(VARCO_API_URL, {
      method: 'POST',
      headers: {
        'openapi_key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(varcoRequest),
    });

    console.log('VARCO API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('VARCO API error response:', errorText);

      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText };
      }

      return NextResponse.json(
        { message: error.message || 'Translation failed', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('VARCO API success response:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
