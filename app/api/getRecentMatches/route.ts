// app/api/getRecentMatches/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get('puuid');

  if (!puuid) {
    return NextResponse.json({ message: 'Missing PUUID parameter' }, { status: 400 });
  }

  try {
    const url = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=3`;

    const response = await axios.get(url, {
      headers: {
        'X-Riot-Token': process.env.NEXT_PUBLIC_RIOT_API_KEY!,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching recent matches:', error.response?.data || error.message);
    return NextResponse.json({ message: 'Error fetching recent matches' }, { status: error.response?.status || 500 });
  }
}
