export type IMatchFilterRequest = {
  searchTerm?: string;
  academyId?: string;
  clubId?: string;
  leagueId?: string;
  status?: string;
  matchType?: string;
};

export type IMatchCreateRequest = {
  title?: string;
  academyId?: string;
  clubId?: string;
  leagueId?: string;
  homeTeamId: string;
  awayTeamId: string;
  matchType: string;
  status?: string;
  kickoffAt: string;
  venueName?: string;
  venueAddress?: string;
  videoLink?: string;
  galleryImages?: string[];
  matchHighlights?: string[];
  referees?: string;
  additionalNotes?: string;
};

export type IMatchUpdateRequest = Partial<IMatchCreateRequest>;
