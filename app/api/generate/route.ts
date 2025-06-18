import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Walidacja danych wejściowych
    if (!body.query || !body.id || !body.template_id) {
      return NextResponse.json(
        { error: 'Brakuje wymaganych pól: query, id, template_id' },
        { status: 400 }
      );
    }

    // Pobranie URL webhooka ze zmiennych środowiskowych
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error('NEXT_PUBLIC_N8N_WEBHOOK_URL nie jest ustawione');
      return NextResponse.json(
        { error: 'Błąd konfiguracji serwera' },
        { status: 500 }
      );
    }

    // Wywołanie webhooka n8n
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: body.query.trim(),
        id: body.id,
        template_id: body.template_id
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Generate Error:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas generowania infografiki' },
      { status: 500 }
    );
  }
}
