// MatchDto: 매치 데이터 타입 정의
export interface MatchDto {
  metadata: MetadataDto; // 매치 메타데이터
  info: InfoDto; // 매치 상세 정보
}

// MetadataDto: 매치 메타데이터 타입 정의
export interface MetadataDto {
  dataVersion: string; // 데이터 버전
  matchId: string; // 매치 ID
  participants: string[]; // 참가자의 PUUID 목록
}

// InfoDto: 매치 정보 타입 정의
export interface InfoDto {
  gameCreation: number; // 게임 생성 시간 (Unix 타임스탬프)
  gameDuration: number; // 게임 시간 (초)
  gameEndTimestamp: number; // 게임 종료 시간 (Unix 타임스탬프)
  gameId: number; // 게임 ID
  gameMode: string; // 게임 모드
  gameType: string; // 게임 타입
  gameVersion: string; // 게임 버전
  mapId: number; // 맵 ID
  participants: ParticipantDto[]; // 참가자 목록
  teams: TeamDto[]; // 팀 목록
  queueId: number; // 큐 ID
}

// ParticipantDto: 매치 참가자 정보 타입 정의
export interface ParticipantDto {
  puuid: string; // 플레이어 고유 ID
  teamId: number; // 소속 팀 ID (100 또는 200)
  championId: number; // 챔피언 ID
  championName: string; // 챔피언 이름
  individualPosition: string; // 개인 포지션
  teamPosition: string; // 팀 포지션
  summonerId: string; // 소환사 ID
  summonerName: string; // 소환사 이름
  profileIcon: number; // 소환사 아이콘 ID
  summoner1Id: number; // 소환사 주문 1 ID
  summoner2Id: number; // 소환사 주문 2 ID
  summoner1Casts: number; // 소환사 주문 1 사용 횟수
  summoner2Casts: number; // 소환사 주문 2 사용 횟수
  kills: number; // 킬 수
  deaths: number; // 데스 수
  assists: number; // 어시스트 수
  totalDamageDealt: number; // 총 가한 피해량
  totalDamageDealtToChampions: number; // 챔피언에게 가한 총 피해량
  magicDamageDealtToChampions: number; // 챔피언에게 가한 마법 피해량
  physicalDamageDealtToChampions: number; // 챔피언에게 가한 물리 피해량
  trueDamageDealtToChampions: number; // 챔피언에게 가한 순수 피해량
  damageSelfMitigated: number; // 방어한 피해량
  totalDamageTaken: number; // 받은 피해량
  magicDamageTaken: number; // 받은 마법 피해량
  physicalDamageTaken: number; // 받은 물리 피해량
  trueDamageTaken: number; // 받은 순수 피해량
  totalHeal: number; // 회복량
  totalHealsOnTeammates: number; // 팀원에게 적용된 회복량
  visionScore: number; // 시야 점수
  wardsPlaced: number; // 설치한 와드 수
  wardsKilled: number; // 제거한 와드 수
  detectorWardsPlaced: number; // 설치한 제어 와드 수
  timeCCingOthers: number; // 적에게 가한 군중 제어 시간
  totalMinionsKilled: number; // 처치한 미니언 수
  neutralMinionsKilled: number; // 처치한 중립 몬스터 수
  goldEarned: number; // 획득한 골드
  goldSpent: number; // 사용한 골드
  itemsPurchased: number; // 구매한 아이템 수
  item0: number; // 장착한 아이템 슬롯 0
  item1: number; // 장착한 아이템 슬롯 1
  item2: number; // 장착한 아이템 슬롯 2
  item3: number; // 장착한 아이템 슬롯 3
  item4: number; // 장착한 아이템 슬롯 4
  item5: number; // 장착한 아이템 슬롯 5
  item6: number; // 장착한 아이템 슬롯 6
  perks: PerksDto; // 룬 정보
  challenges: ChallengesDto; // 추가 통계
  win: boolean; // 승리 여부
  champLevel: number; // 챔피언 레벨
  baronKills: number; // 처치한 바론 수
  dragonKills: number; // 처치한 드래곤 수
  inhibitorKills: number; // 처치한 억제기 수
  turretKills: number; // 처치한 포탑 수
  lane: string; // 라인 정보
}

// ChallengesDto: 참가자의 추가 통계 정보
export interface ChallengesDto {
  "12AssistStreakCount": number;
  baronBuffGoldAdvantageOverThreshold: number;
  controlWardTimeCoverageInRiverOrEnemyHalf: number;
  earliestBaron: number;
  earliestDragonTakedown: number;
  earliestElderDragon: number;
  earlyLaningPhaseGoldExpAdvantage: number;
  fasterSupportQuestCompletion: number;
  fastestLegendary: number;
  hadAfkTeammate: number;
  highestChampionDamage: number;
  highestCrowdControlScore: number;
  highestWardKills: number;
  junglerKillsEarlyJungle: number;
  killsOnLanersEarlyJungleAsJungler: number;
  laningPhaseGoldExpAdvantage: number;
  legendaryCount: number;
  maxCsAdvantageOnLaneOpponent: number;
  maxLevelLeadLaneOpponent: number;
  mostWardsDestroyedOneSweeper: number;
  mythicItemUsed: number;
  playedChampSelectPosition: number;
  soloTurretsLategame: number;
  takedownsFirst25Minutes: number;
  teleportTakedowns: number;
  thirdInhibitorDestroyedTime: number;
  threeWardsOneSweeperCount: number;
  visionScoreAdvantageLaneOpponent: number;
  InfernalScalePickup: number;
  fistBumpParticipation: number;
  voidMonsterKill: number;
  abilityUses: number;
  acesBefore15Minutes: number;
  alliedJungleMonsterKills: number;
  baronTakedowns: number;
  blastConeOppositeOpponentCount: number;
  bountyGold: number;
  buffsStolen: number;
  completeSupportQuestInTime: number;
  controlWardsPlaced: number;
  damagePerMinute: number;
  damageTakenOnTeamPercentage: number;
  dancedWithRiftHerald: number;
  deathsByEnemyChamps: number;
  dodgeSkillShotsSmallWindow: number;
  doubleAces: number;
  dragonTakedowns: number;
  legendaryItemUsed: number[];
  effectiveHealAndShielding: number;
  elderDragonKillsWithOpposingSoul: number;
  elderDragonMultikills: number;
  enemyChampionImmobilizations: number;
  enemyJungleMonsterKills: number;
  epicMonsterKillsNearEnemyJungler: number;
  epicMonsterKillsWithin30SecondsOfSpawn: number;
  epicMonsterSteals: number;
  epicMonsterStolenWithoutSmite: number;
  firstTurretKilled: number;
  firstTurretKilledTime: number;
  flawlessAces: number;
  fullTeamTakedown: number;
  gameLength: number;
  getTakedownsInAllLanesEarlyJungleAsLaner: number;
  goldPerMinute: number;
  hadOpenNexus: number;
  immobilizeAndKillWithAlly: number;
  initialBuffCount: number;
  initialCrabCount: number;
  jungleCsBefore10Minutes: number;
  junglerTakedownsNearDamagedEpicMonster: number;
  kda: number;
  killAfterHiddenWithAlly: number;
  killedChampTookFullTeamDamageSurvived: number;
  killingSprees: number;
  killParticipation: number;
  killsNearEnemyTurret: number;
  killsOnOtherLanesEarlyJungleAsLaner: number;
  killsOnRecentlyHealedByAramPack: number;
  killsUnderOwnTurret: number;
  killsWithHelpFromEpicMonster: number;
  knockEnemyIntoTeamAndKill: number;
  kTurretsDestroyedBeforePlatesFall: number;
  landSkillShotsEarlyGame: number;
  laneMinionsFirst10Minutes: number;
  lostAnInhibitor: number;
  maxKillDeficit: number;
  mejaisFullStackInTime: number;
  moreEnemyJungleThanOpponent: number;
  multiKillOneSpell: number;
  multikills: number;
  multikillsAfterAggressiveFlash: number;
  multiTurretRiftHeraldCount: number;
  outerTurretExecutesBefore10Minutes: number;
  outnumberedKills: number;
  outnumberedNexusKill: number;
  perfectDragonSoulsTaken: number;
  perfectGame: number;
  pickKillWithAlly: number;
  poroExplosions: number;
  quickCleanse: number;
  quickFirstTurret: number;
  quickSoloKills: number;
  riftHeraldTakedowns: number;
  saveAllyFromDeath: number;
  scuttleCrabKills: number;
  shortestTimeToAceFromFirstTakedown: number;
  skillshotsDodged: number;
  skillshotsHit: number;
  snowballsHit: number;
  soloBaronKills: number;
  SWARM_DefeatAatrox: number;
  SWARM_DefeatBriar: number;
  SWARM_DefeatMiniBosses: number;
  SWARM_EvolveWeapon: number;
  SWARM_Have3Passives: number;
  SWARM_KillEnemy: number;
  SWARM_PickupGold: number;
  SWARM_ReachLevel50: number;
  SWARM_Survive15Min: number;
  SWARM_WinWith5EvolvedWeapons: number;
  soloKills: number;
  stealthWardsPlaced: number;
  survivedSingleDigitHpCount: number;
  survivedThreeImmobilizesInFight: number;
  takedownOnFirstTurret: number;
  takedowns: number;
  takedownsAfterGainingLevelAdvantage: number;
  takedownsBeforeJungleMinionSpawn: number;
  takedownsFirstXMinutes: number;
  takedownsInAlcove: number;
  takedownsInEnemyFountain: number;
  teamBaronKills: number;
  teamDamagePercentage: number;
  teamElderDragonKills: number;
  teamRiftHeraldKills: number;
  tookLargeDamageSurvived: number;
  turretPlatesTaken: number;
  turretsTakenWithRiftHerald: number;
  turretTakedowns: number;
  twentyMinionsIn3SecondsCount: number;
  twoWardsOneSweeperCount: number;
  unseenRecalls: number;
  visionScorePerMinute: number;
  wardsGuarded: number;
  wardTakedowns: number;
  wardTakedownsBefore20M: number;
}

// ObjectivesDto: 팀 목표 정보 타입 정의
export interface ObjectiveDto {
  first: boolean; // 첫 번째 목표 달성 여부
  kills: number; // 목표를 달성한 횟수
}

// TeamDto: 팀 정보 타입 정의
export interface TeamDto {
  teamId: number; // 팀 ID (100 또는 200)
  win: boolean; // 승리 여부
  bans: BanDto[]; // 밴한 챔피언 정보
  objectives: {
    baron: ObjectiveDto;
    champion: ObjectiveDto;
    dragon: ObjectiveDto;
    horde: ObjectiveDto;
    inhibitor: ObjectiveDto;
    riftHerald: ObjectiveDto;
    tower: ObjectiveDto;
  };
}

// BanDto: 밴 정보 타입 정의
export interface BanDto {
  championId: number; // 밴한 챔피언 ID
  pickTurn: number; // 밴 순서
}

// PerksDto: 룬 정보 타입 정의
export interface PerksDto {
  statPerks: PerkStatsDto; // 룬 통계
  styles: PerkStyleDto[]; // 룬 스타일
}

// PerkStatsDto: 룬 통계 정보
export interface PerkStatsDto {
  defense: number;
  flex: number;
  offense: number;
}

// PerkStyleDto: 룬 스타일 정보
export interface PerkStyleDto {
  description: string; // 스타일 설명
  selections: PerkStyleSelectionDto[]; // 선택한 룬
  style: number; // 스타일 ID
}

// PerkStyleSelectionDto: 선택한 룬 세부 정보
export interface PerkStyleSelectionDto {
  perk: number; // 룬 ID
  var1: number;
  var2: number;
  var3: number;
}
