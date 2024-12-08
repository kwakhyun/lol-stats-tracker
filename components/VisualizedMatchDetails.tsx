"use client";

import { Bar, Pie, Radar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { MatchDto } from "@/app/api/getRecentMatches/types";

// Chart.js 플러그인 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

const VisualizedMatchDetails = ({
  match,
  championData,
  ddragonVersion,
}: {
  match: MatchDto;
  championData: Record<string, string>;
  ddragonVersion: string;
}) => {
  const participants = match.info.participants;

  // **팀별 분리**
  const team100 = participants.filter((p) => p.teamId === 100);
  const team200 = participants.filter((p) => p.teamId === 200);

  // **포지션별 골드 비교 문제 해결**
  const positionLabels = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];
  const calculateGold = (team: typeof participants, position: string) =>
    team
      .filter((p) => p.teamPosition === position)
      .reduce((sum, p) => sum + p.goldEarned, 0) || 0;

  const team100Gold = positionLabels.map((pos) => calculateGold(team100, pos));
  const team200Gold = positionLabels.map((pos) => calculateGold(team200, pos));

  const goldComparisonData = {
    labels: positionLabels,
    datasets: [
      {
        label: "1팀",
        data: team100Gold,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "2팀",
        data: team200Gold,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  // **주요 목표 달성 데이터**
  const objectivesData = {
    labels: ["타워", "드래곤", "바론", "억제기"],
    datasets: [
      {
        label: "1팀",
        data: [
          match.info.teams[0].objectives.tower.kills,
          match.info.teams[0].objectives.dragon.kills,
          match.info.teams[0].objectives.baron.kills,
          match.info.teams[0].objectives.inhibitor.kills,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "2팀",
        data: [
          match.info.teams[1].objectives.tower.kills,
          match.info.teams[1].objectives.dragon.kills,
          match.info.teams[1].objectives.baron.kills,
          match.info.teams[1].objectives.inhibitor.kills,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  // **KDA 계산**
  const calculateKDA = (p: (typeof participants)[0]) =>
    p.deaths > 0 ? ((p.kills + p.assists) / p.deaths).toFixed(2) : "Perfect";

  // **칭호 설정**
  const getTitles = () => {
    const titles: Record<string, string> = {};
    const maxKills = Math.max(...participants.map((p) => p.kills));
    const maxDeaths = Math.max(...participants.map((p) => p.deaths));
    const maxAssists = Math.max(...participants.map((p) => p.assists));

    participants.forEach((p) => {
      if (p.kills === maxKills) titles[p.puuid] = "무자비합니다! 🔥";
      if (p.deaths === maxDeaths) titles[p.puuid] = "박치기 공룡 🦖";
      if (p.assists === maxAssists) titles[p.puuid] = "팀워크 최고 🤩";
    });

    return titles;
  };

  const titles = getTitles();

  // **이미지 로드 상태 관리**
  const [championImages, setChampionImages] = useState<
    Record<string, HTMLImageElement>
  >({});

  useEffect(() => {
    const loadImages = async () => {
      const images: Record<string, HTMLImageElement> = {};
      for (const p of participants) {
        const img = new Image();
        img.src = `http://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${p.championName}.png`;
        await new Promise((resolve) => (img.onload = resolve));
        images[p.championName] = img;
      }
      setChampionImages(images);
    };
    loadImages();
  }, [participants]);

  // **KDA 산점도 데이터**
  const kdaScatterData = {
    datasets: participants.map((p, index) => ({
      label: `${championData[p.championName] || p.championName} (KDA: ${
        calculateKDA(p)
      })`,
      data: [{ x: p.kills, y: p.deaths, r: p.assists * 2 }], // Assists에 따라 점 크기 설정
      pointStyle: () => {
        const image = championImages[p.championName];
        if (image) {
          const canvas = document.createElement("canvas");
          const size = 40; // 크기 설정
          const ctx2d = canvas.getContext("2d")!;
          canvas.width = size;
          canvas.height = size;

          ctx2d.beginPath();
          ctx2d.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx2d.closePath();
          ctx2d.clip();

          ctx2d.drawImage(image, 0, 0, size, size);
          return canvas;
        }
        return "circle"; // 기본 원 스타일
      },
      pointRadius: Math.min(10 + p.kills, 30), // Kills에 따라 이미지 크기 조정
      backgroundColor: "transparent", // 이미지가 배경으로 사용되므로 투명 설정
    })),
  };

  // **탭 상태 관리**
  const [activeTab, setActiveTab] = useState("objectives");

  // **탭 구성**
  const tabs = [
    {
      id: "objectives",
      title: "팀별 목표 달성",
      description: "팀이 달성한 주요 목표(타워, 드래곤, 바론 등)를 비교합니다.",
      content: <Bar data={objectivesData} />,
    },
    {
      id: "kda",
      title: "플레이어 KDA 분석",
      description:
        "플레이어의 정확한 KDA를 이미지 크기와 텍스트로 시각화합니다.",
      content: (
        <div>
          <Scatter data={kdaScatterData} />
          <ul className="mt-4 text-sm text-gray-600">
            {participants.map((p) => (
              <li key={p.puuid}>
                <strong>
                  {championData[p.championName] || p.championName}
                </strong>
                : KDA = {calculateKDA(p)} (킬: {p.kills}, 데스: {p.deaths},
                어시스트: {p.assists}){" "}
                <span className="font-bold text-blue-500">
                  {titles[p.puuid]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: "gold",
      title: "포지션별 골드 총합 비교",
      description: "1팀과 2팀의 포지션별 골드 총합을 비교합니다.",
      content: <Bar data={goldComparisonData} />,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">경기 데이터 시각화</h2>

      {/* **탭 UI** */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-4 ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 font-bold text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      {/* **탭 내용** */}
      <div className="bg-white p-4 rounded-lg shadow">
        {tabs
          .filter((tab) => tab.id === activeTab)
          .map((tab) => (
            <div key={tab.id}>
              <h3 className="text-lg font-semibold mb-2">{tab.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{tab.description}</p>
              {tab.content}
            </div>
          ))}
      </div>
    </div>
  );
};

export default VisualizedMatchDetails;
