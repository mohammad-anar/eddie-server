export interface ILeagueFilterRequest {
  searchTerm?: string;
  status?: string;
  leagueType?: "PUBLIC" | "PRIVATE";
}

export interface ICreateLeaguePayload {
  name: string;
  leagueType: "PUBLIC" | "PRIVATE";
  passcode?: string;
  memberLimit?: number;
  rosterSize?: number;
  draftTime: string;
  secondsPerPick?: number;
  scoringSettings?: {
    winPoints?: number;
    finishBonus?: number;
    winningChampionshipBout?: number;
    championVsChampionWin?: number;
    winningAgainstRankedOpponent?: number;
    winningFiveRoundFight?: number;
  };
}

export interface IJoinLeaguePayload {
  code: string;
  passcode?: string;
  teamName: string;
}
