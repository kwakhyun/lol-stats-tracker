// app/api/getPuuid/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userNickname = searchParams.get("userNickname");
  const tagLine = searchParams.get("tagLine");

  if (!userNickname || !tagLine) {
    return NextResponse.json(
      { message: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const encodedName = encodeURIComponent(userNickname);
    const url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedName}/${tagLine}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://developer.riotgames.com",
        "X-Riot-Token": process.env.NEXT_PUBLIC_RIOT_API_KEY!,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      "Error fetching PUUID:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { message: "Error fetching PUUID" },
      { status: error.response?.status || 500 }
    );
  }
}
