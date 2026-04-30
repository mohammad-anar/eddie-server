export type IClubFilterRequest = {
  searchTerm?: string;
  name?: string;
  country?: string;
  city?: string;
};

export type IClubCreateRequest = {
  userId: string;
  name: string;
  country?: string;
  countryFlag?: string;
  city?: string;
  coverPhoto?: string;
  logo?: string;
  dateOfEstablishment?: string;
  secondaryEmail?: string;
  secondaryPhone?: string;
  website?: string;
  description?: string;
  visionAndMission?: string;
  leagueId?: string;
};

export type IClubUpdateRequest = Partial<IClubCreateRequest>;
