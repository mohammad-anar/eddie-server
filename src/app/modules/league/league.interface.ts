export type ILeagueFilterRequest = {
  searchTerm?: string;
  name?: string;
  country?: string;
};

export type ILeagueCreateRequest = {
  name: string;
  country?: string;
  countryFlag?: string;
  logo?: string;
  description?: string;
};

export type ILeagueUpdateRequest = Partial<ILeagueCreateRequest>;
