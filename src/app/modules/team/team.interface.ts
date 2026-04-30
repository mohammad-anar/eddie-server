export type ITeamFilterRequest = {
  searchTerm?: string;
  name?: string;
  clubId?: string;
  academyId?: string;
};

export type ITeamCreateRequest = {
  name: string;
  clubId?: string;
  academyId?: string;
};

export type ITeamUpdateRequest = Partial<ITeamCreateRequest>;
