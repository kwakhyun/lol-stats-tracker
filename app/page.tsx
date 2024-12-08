"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import RecentMatches from "@/components/RecentMatches";
import { MatchDto } from "./api/getRecentMatches/types";

// Type definitions for API responses
interface SummonerInfo {
  accountId: string;
  profileIconId: number;
  revisionDate: number;
  id: string;
  puuid: string;
  name: string;
  summonerLevel: number;
}

interface LeagueEntry {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

const SummonerInfo = ({
  summonerInfo,
  leagueInfo,
  ddragonVersion,
  championMastery,
  championData,
}: any) => (
  <div className="w-full tablet:w-1/3 p-4 bg-gray-100 shadow-lg rounded-lg">
    {summonerInfo && (
      <>
        <div className="flex flex-col tablet:flex-row tablet:items-center space-y-4 tablet:space-y-0 tablet:space-x-4">
          <img
            src={`http://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/profileicon/${summonerInfo.profileIconId}.png`}
            alt="소환사 아이콘"
            className="w-20 h-20 rounded-full"
          />
          <div className="text-center tablet:text-left">
            <h2 className="text-xl tablet:text-2xl font-bold">
              {summonerInfo.name}
            </h2>
            <p className="text-sm text-gray-500">
              Level: {summonerInfo.summonerLevel}
            </p>
          </div>
        </div>

        {leagueInfo && leagueInfo.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md tablet:text-lg font-semibold mb-2">
              랭크 정보
            </h3>
            {leagueInfo
              .slice()
              .reverse() // 배열 순서 반대로
              .map((entry: any, index: number) => (
                <div key={index} className="mb-4">
                  {/* 타이틀 조건부 렌더링 */}
                  {entry.queueType === "RANKED_SOLO_5x5" && (
                    <h4 className="text-sm tablet:text-md font-semibold text-gray-700 mb-2">
                      개인/2인 랭크 게임
                    </h4>
                  )}
                  {entry.queueType === "RANKED_FLEX_SR" && (
                    <h4 className="text-sm tablet:text-md font-semibold text-gray-700 mb-2">
                      자유 랭크 게임
                    </h4>
                  )}

                  {/* 랭크 정보 */}
                  <div className="flex items-center space-x-2">
                    <img
                      src={`/rank-icons/Rank=${entry.tier}.png`}
                      alt={`${entry.tier} Rank Icon`}
                      className="w-8 h-8 tablet:w-10 tablet:h-10"
                    />
                    <div>
                      <p className="text-sm tablet:text-md font-bold">
                        {entry.tier} {entry.rank}
                      </p>
                      <p className="text-xs tablet:text-sm text-gray-600">
                        {entry.leaguePoints} LP | {entry.wins}승 {entry.losses}
                        패
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {championMastery && championMastery.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">모스트 챔피언</h3>
            <ul className="space-y-2">
              {championMastery
                .slice(0, 3)
                .map((champion: any, index: number) => {
                  const championName = championData[champion.championId]; // ID -> 이름 변환
                  return (
                    <li key={index} className="flex items-center space-x-4">
                      <img
                        src={`http://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${championName}.png`}
                        alt={championName}
                        className="w-10 h-10 rounded"
                      />
                      <div>
                        <p className="text-md font-bold">{championName}</p>
                        <p className="text-sm text-gray-600">
                          숙련도 점수:{" "}
                          {champion.championPoints.toLocaleString()}
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </>
    )}
  </div>
);

export default function Home() {
  const [summonerInput, setSummonerInput] = useState<string>("");

  const [puuid, setPuuid] = useState<string>("");
  const [summonerInfo, setSummonerInfo] = useState<SummonerInfo | null>(null);
  const [leagueInfo, setLeagueInfo] = useState<LeagueEntry[] | null>(null);
  const [championMastery, setChampionMastery] = useState<any[]>([]);
  const [championData, setChampionData] = useState<Record<string, string>>({});

  const [recentMatches, setRecentMatches] = useState<MatchDto[] | null>(null);

  // 상태 관리: 확장된 경기 ID 저장
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  // 토글 함수: 클릭한 matchId가 열리거나 닫힘
  const toggleMatchExpansion = (matchId: string) => {
    setExpandedMatchId((prev) => (prev === matchId ? null : matchId));
  };

  // const [championMastery, setChampionMastery] = useState<
  //   ChampionMastery[] | null
  // >(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // PUUID 가져오기
  const fetchPuuid = async (
    userNickname: string,
    tagLine: string
  ): Promise<string | false> => {
    console.log("Fetching PUUID...");
    try {
      const response = await axios.get("/api/getPuuid", {
        params: { userNickname, tagLine },
      });
      console.log("PUUID fetched successfully:", response.data.puuid);
      setPuuid(response.data.puuid);
      return response.data.puuid;
    } catch (err) {
      setError("PUUID를 가져오는 중 오류가 발생했습니다.");
      console.error("Error fetching PUUID:", err);
      return false;
    }
  };

  // 소환사 정보 가져오기
  const fetchSummonerInfo = async (
    puuid: string
  ): Promise<SummonerInfo | false> => {
    if (!puuid) {
      console.warn("PUUID is not set, cannot fetch summoner info");
      return false;
    }
    console.log("Fetching Summoner Info...");
    try {
      const response = await axios.get("/api/getSummonerInfo", {
        params: { puuid },
      });
      console.log("Summoner Info fetched successfully:", response.data);
      setSummonerInfo(response.data);
      return response.data; // 성공 시 반환
    } catch (err) {
      setError("소환사 정보를 가져오는 중 오류가 발생했습니다.");
      console.error("Error fetching summoner info:", err);
      return false;
    }
  };

  // 리그 정보 가져오기
  const fetchLeagueInfo = async (summonerId: string): Promise<boolean> => {
    if (!summonerId) {
      console.warn("Summoner ID is not set, cannot fetch league info");
      return false;
    }
    console.log("Fetching League Info...");
    try {
      const response = await axios.get("/api/getLeagueInfo", {
        params: { summonerId },
      });

      setLeagueInfo(response.data);
      return true;
    } catch (err) {
      setError("리그 정보를 가져오는 중 오류가 발생했습니다.");
      console.error("Error fetching league info:", err);
      return false;
    }
  };

  // 모스트 챔피언 숙련도 가져오기
  const fetchChampionMastery = async (puuid: string) => {
    if (!puuid) {
      console.warn("PUUID is not set, cannot fetch champion mastery");
      return [];
    }

    try {
      const response = await axios.get("/api/getChampionMastery", {
        params: { puuid },
      });

      // return response.data; // 숙련도 데이터 반환
      setChampionMastery(response.data);
    } catch (err) {
      console.error("Error fetching champion mastery:", err);
      return [];
    }
  };

  const fetchChampionData = async () => {
    try {
      const response = await axios.get(
        `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/data/en_US/champion.json`
      );
      const champions = response.data.data;

      const mapping: Record<string, string> = {};
      for (const key in champions) {
        mapping[champions[key].key] = champions[key].id; // 숫자 ID -> 챔피언 이름 매핑
      }
      setChampionData(mapping); // 상태로 저장
    } catch (err) {
      console.error("Error fetching champion data:", err);
    }
  };

  // 최근 경기 가져오기
  const fetchRecentMatches = async (puuid: string) => {
    if (!puuid) {
      console.warn("PUUID is not set, cannot fetch recent matches");
      return false;
    }

    try {
      const response = await axios.get("/api/getRecentMatches", {
        params: { puuid },
      });
      setRecentMatches(response.data);
      return response.data;
    } catch (err) {
      setError("최근 경기 기록을 가져오는 중 오류가 발생했습니다.");
      console.error("Error fetching recent matches:", err);
      return false;
    }
  };

  const fetchMatchDetails = async (
    matchId: string
  ): Promise<MatchDto | null> => {
    try {
      const response = await axios.get("/api/getMatchDetails", {
        params: { matchId },
      });

      return response.data;
    } catch (err) {
      console.error(`Error fetching match details for ${matchId}:`, err);
      return null;
    }
  };

  const fetchAllMatchDetails = async (
    matchIds: string[]
  ): Promise<MatchDto[]> => {
    const matchDetailsPromises = matchIds.map((id) => fetchMatchDetails(id));
    const matchDetails = await Promise.all(matchDetailsPromises);
    return matchDetails.filter((detail): detail is MatchDto => detail !== null); // 유효한 데이터만 반환
  };

  const fetchLatestVersion = async (): Promise<string> => {
    try {
      const response = await axios.get(
        "https://ddragon.leagueoflegends.com/realms/kr.json"
      );
      return response.data.v; // 최신 버전
    } catch (err) {
      console.error("Error fetching latest ddragon version:", err);
      return "14.23.1";
    }
  };

  const [ddragonVersion, setDdragonVersion] = useState<string>("14.23.1");

  useEffect(() => {
    const fetchVersion = async () => {
      const version = await fetchLatestVersion();
      setDdragonVersion(version);
    };
    fetchVersion();
  }, []);

  // 검색 처리 함수
  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    setSummonerInfo(null);
    setLeagueInfo(null);
    setChampionMastery([]);

    setRecentMatches([]);
    setPuuid("");

    // 입력된 값에서 소환사 이름과 태그라인을 분리
    const [userNickname, tagLine] = summonerInput.split("#");

    if (!userNickname || !tagLine) {
      setError("올바른 소환사 이름과 태그라인을 입력하세요. 예: player#123");
      setLoading(false);
      return;
    }

    const puuid = await fetchPuuid(userNickname, tagLine);
    if (!puuid) {
      console.log("Failed to fetch PUUID");
      setLoading(false);
      return;
    }

    const summonerData = await fetchSummonerInfo(puuid);
    if (!summonerData) {
      console.log("Failed to fetch Summoner Info");
      setLoading(false);
      return;
    }

    const leagueSuccess = await fetchLeagueInfo(summonerData.id);
    if (!leagueSuccess) {
      console.log("Failed to fetch League Info");
      setLoading(false);
      return;
    }

    const matchIds = await fetchRecentMatches(puuid);
    if (!matchIds) {
      setLoading(false);
      return;
    }

    const matchDetails = await fetchAllMatchDetails(matchIds);
    setRecentMatches(matchDetails);

    await fetchChampionMastery(puuid);
    await fetchChampionData();

    // const championMasterySuccess = await fetchChampionMastery(summonerData.id);
    // if (!championMasterySuccess) {
    //   console.log("Failed to fetch Champion Mastery");
    //   setLoading(false);
    //   return;
    // }

    console.log("Search completed successfully");
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 tablet:p-6 desktop:p-8">
      {/* 검색 입력 */}
      <div className="flex flex-col space-y-4 tablet:flex-row tablet:space-y-0 tablet:space-x-4 max-w-lg mx-auto mb-6">
        <input
          type="text"
          placeholder="소환사 이름#태그라인 (예: player#123)"
          value={summonerInput}
          onChange={(e) => setSummonerInput(e.target.value)}
          className="p-3 text-md tablet:text-lg border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="w-24 px-4 py-2 tablet:px-6 tablet:py-4 bg-blue-950 text-white text-md tablet:text-lg rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "검색 중..." : "검색"}
        </button>
      </div>

      <div className="flex flex-col tablet:flex-row space-y-6 tablet:space-y-0 tablet:space-x-6">
        <SummonerInfo
          summonerInfo={summonerInfo}
          leagueInfo={leagueInfo}
          ddragonVersion={ddragonVersion}
          championMastery={championMastery}
          championData={championData}
        />

        <RecentMatches
          matches={recentMatches}
          expandedMatchId={expandedMatchId}
          toggleMatchExpansion={toggleMatchExpansion}
          ddragonVersion={ddragonVersion}
          searchPuuid={puuid}
        />
      </div>
    </div>
  );
}
