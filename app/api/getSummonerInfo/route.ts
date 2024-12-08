// app/api/getSummonerInfo/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get('puuid');

  if (!puuid) {
    return NextResponse.json({ message: 'Missing PUUID parameter' }, { status: 400 });
  }

  try {
    const url = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;

    const response = await axios.get(url, {
      headers: {
        'X-Riot-Token': process.env.NEXT_PUBLIC_RIOT_API_KEY!,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching summoner info:', error.response?.data || error.message);
    return NextResponse.json({ message: 'Error fetching summoner info' }, { status: error.response?.status || 500 });
  }
}
