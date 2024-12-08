import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return NextResponse.json({ message: 'Missing Match ID parameter' }, { status: 400 });
  }

  try {
    const url = `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`;

    const response = await axios.get(url, {
      headers: {
        'X-Riot-Token': process.env.NEXT_PUBLIC_RIOT_API_KEY!,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching match details:', error.response?.data || error.message);
    return NextResponse.json({ message: 'Error fetching match details' }, { status: error.response?.status || 500 });
  }
}