export type IPlayerFilterRequest = {
  searchTerm?: string;
  userId?: string;
  academyId?: string;
  clubId?: string;
  agentId?: string;
  playerType?: string;
};

export type IPlayerCreateRequest = {
  userId: string;
  dob: string;
  age: number;
  styleImage?: string;
  playType?: string;
  playerType?: string;
  characteristics?: string;
  academyId?: string;
  clubId?: string;
  agentId?: string;
};

export type IPlayerUpdateRequest = Partial<IPlayerCreateRequest>;
