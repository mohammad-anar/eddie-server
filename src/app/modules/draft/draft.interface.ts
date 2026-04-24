export interface IDraftFilterRequest {
  searchTerm?: string;
  division?: string;
}

export interface IPickFighterPayload {
  fighterId: string;
}

export interface ISetQueuePayload {
  orderedFighterIds: string[];
}
