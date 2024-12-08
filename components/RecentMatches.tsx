import { useEffect, useState } from "react";
import axios from "axios";
import VisualizedMatchDetails from "./VisualizedMatchDetails"; // 경기 상세 데이터 시각화 컴포넌트
import { MatchDto } from "@/app/api/getRecentMatches/types";

const RecentMatches = ({
  matches,
  expandedMatchId,
  toggleMatchExpansion,
  ddragonVersion,
  searchPuuid,
}: {
  matches: MatchDto[] | null;
  expandedMatchId: string | null;
  toggleMatchExpansion: (matchId: string) => void;
  ddragonVersion: string;
  searchPuuid: string;
}) => {
  const [championData, setChampionData] = useState<Record<string, string>>({});
  const [playerData, setPlayerData] = useState<Record<string, any>>({}); // 소환사 ID를 기준으로 데이터 저장

  // 챔피언 데이터 가져오기
  const fetchChampionData = async () => {
    try {
      const response = await axios.get(
        `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/data/ko_KR/champion.json`
      );
      const champions = response.data.data;

      const mapping: Record<string, string> = {};
      for (const key in champions) {
        mapping[champions[key].id] = champions[key].name;
      }
      setChampionData(mapping);
    } catch (err) {
      console.error("Error fetching champion data:", err);
    }
  };

  const fetchPlayerData = async (summonerId: string) => {
    if (!summonerId) {
      console.warn("Summoner ID is not set, cannot fetch player data");
      return false;
    }

    console.log(`Fetching data for summonerId: ${summonerId}`);
    try {
      // 소환사 기본 정보 가져오기
      // const summonerResponse = await axios.get("/api/getSummoner", {
      //   params: { summonerId },
      // });
      // const summonerInfo = summonerResponse.data;

      // 소환사 랭크 정보 가져오기
      const leagueResponse = await axios.get("/api/getLeagueInfo", {
        params: { summonerId },
      });
      const leagueInfo = leagueResponse.data;

      // 랭크 정보 필터링 (솔로 랭크)
      const soloRank = leagueInfo.find(
        (entry: any) => entry.queueType === "RANKED_SOLO_5x5"
      );

      // 상태 업데이트
      setPlayerData((prevData) => ({
        ...prevData,
        [summonerId]: {
          // summonerName: summonerInfo.name || "Unknown",
          tier: soloRank?.tier || "Unranked",
          rank: soloRank?.rank || "",
          leaguePoints: soloRank?.leaguePoints || 0,
        },
      }));

      console.log(`Data fetched successfully for summonerId: ${summonerId}`);
      return true;
    } catch (err: any) {
      console.error(
        `Error fetching data for summonerId ${summonerId}:`,
        err?.response?.data || err.message
      );
      return false;
    }
  };

  // 모든 참가자 데이터 가져오기
  useEffect(() => {
    const summonerIds = matches?.flatMap((match) =>
      match?.info?.participants.map((p) => p.summonerId)
    );
    const uniqueSummonerIds = [...new Set(summonerIds)];
    uniqueSummonerIds.forEach((summonerId) => {
      if (!playerData[summonerId]) {
        fetchPlayerData(summonerId);
      }
    });
  }, [matches]);

  useEffect(() => {
    fetchChampionData();
  }, [ddragonVersion]);

  return (
    <div className="container mx-auto max-w-screen-lg p-4">
      <h2 className="text-lg tablet:text-xl font-semibold mb-4">최근 경기</h2>
      <div className="grid grid-cols-1 gap-4">
        {matches?.map((match: any, index: number) => {
          if (!match || !match.metadata || !match.info) {
            console.warn(`Invalid match data at index ${index}`, match);
            return null;
          }

          const { matchId } = match.metadata;
          const { gameMode, gameDuration, participants, teams } = match.info;

          // 검색 대상 플레이어 정보
          const targetParticipant = participants.find(
            (p: any) => p.puuid === searchPuuid
          );

          if (!targetParticipant) {
            return null;
          }

          // 승리 여부 판단
          const isWinner = teams.find(
            (team: any) => team.teamId === targetParticipant.teamId
          )?.win;

          // 팀 구분
          const team100 = participants.filter((p: any) => p.teamId === 100);
          const team200 = participants.filter((p: any) => p.teamId === 200);

          const renderTeamTable = (team: any[], teamColor: string) => (
            <div
              className={`p-4 ${
                teamColor === "red"
                  ? "bg-red-100 tablet:bg-red-200"
                  : "bg-blue-100 tablet:bg-blue-200"
              } overflow-x-auto`}
            >
              <table className="w-full text-xs tablet:text-sm text-left border-collapse">
                <thead className="text-gray-700">
                  <tr>
                    <th className="border-b p-2">플레이어</th>
                    <th className="border-b p-2">티어/LP</th>
                    <th className="border-b p-2">KDA</th>
                    <th className="border-b p-2">킬 관여율</th>
                    <th className="border-b p-2">피해량</th>
                    <th className="border-b p-2 hidden tablet:table-cell">
                      아이템
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((participant: any, idx: number) => {
                    const playerInfo = playerData[participant.summonerId] || {};
                    const killParticipation =
                      teams.find((t: any) => t.teamId === participant.teamId)
                        .objectives.champion.kills > 0
                        ? Math.round(
                            ((participant.kills + participant.assists) /
                              teams.find(
                                (t: any) => t.teamId === participant.teamId
                              ).objectives.champion.kills) *
                              100
                          )
                        : 0;

                    const isHighlighted = participant.puuid === searchPuuid;

                    return (
                      <tr
                        key={idx}
                        className={`hover:bg-gray-200 ${
                          isHighlighted ? "bg-yellow-200 font-bold" : ""
                        }`}
                      >
                        <td className="border-b p-2 flex items-center space-x-2">
                          <img
                            src={`http://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${participant.championName}.png`}
                            alt={`${participant.championName} Icon`}
                            className="w-6 h-6 rounded"
                          />
                          <span>
                            {championData[participant.championName] ||
                              participant.championName}
                          </span>
                        </td>
                        <td className="border-b p-2 text-gray-600">
                          {playerInfo.tier || "Unranked"}{" "}
                          {playerInfo.rank || ""} {playerInfo.leaguePoints || 0}{" "}
                          LP
                        </td>
                        <td className="border-b p-2 text-gray-600">
                          {participant.kills}/{participant.deaths}/
                          {participant.assists}
                        </td>
                        <td className="border-b p-2 text-gray-600">
                          {killParticipation}%
                        </td>
                        <td className="border-b p-2 text-gray-600">
                          {participant.totalDamageDealtToChampions}
                        </td>
                        <td className="border-b p-2 hidden tablet:table-cell">
                          <div className="flex space-x-1">
                            {[...Array(7)].map((_, i) => (
                              <img
                                key={i}
                                src={`http://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/item/${
                                  participant[`item${i}`]
                                }.png`}
                                alt={`아이템 ${i}`}
                                className="w-6 h-6"
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );

          return (
            <div
              key={index}
              className={`border rounded-lg shadow transition ${
                isWinner ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleMatchExpansion(matchId)}
              >
                <p className="text-sm tablet:text-lg font-bold">
                  {gameMode === "CLASSIC" && "개인/2인 랭크 게임"} |{" "}
                  {Math.floor(gameDuration / 60)}분
                </p>
                <p className="text-xs tablet:text-sm text-gray-600">
                  {isWinner ? "승리" : "패배"}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <img
                    src={`http://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${targetParticipant.championName}.png`}
                    alt={`${targetParticipant.championName} Icon`}
                    className="w-8 h-8 rounded"
                  />
                  <span className="text-sm tablet:text-md">
                    {championData[targetParticipant.championName] ||
                      targetParticipant.championName}
                  </span>
                  <span className="text-sm tablet:text-md">
                    {targetParticipant.kills}/{targetParticipant.deaths}/
                    {targetParticipant.assists} (KDA)
                  </span>
                </div>
              </div>

              {/* 경기 상세 정보 (드롭다운) */}
              {expandedMatchId === matchId && (
                <>
                  <h3 className="text-base tablet:text-lg font-semibold mb-2 ml-2">
                    1팀
                  </h3>
                  {renderTeamTable(team100, "red")}

                  <h3 className="text-base tablet:text-lg font-semibold mt-4 mb-2 ml-2">
                    2팀
                  </h3>
                  {renderTeamTable(team200, "blue")}

                  <div className="mt-4">
                    <VisualizedMatchDetails
                      match={match}
                      championData={championData}
                      ddragonVersion={ddragonVersion}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentMatches;
