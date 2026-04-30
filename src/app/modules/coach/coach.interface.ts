export type ICoachFilterRequest = {
  searchTerm?: string;
  fullName?: string;
  license?: string;
  specialization?: string;
  nationality?: string;
};

export type ICoachCreateRequest = {
  userId: string;
  fullName?: string;
  dob?: string;
  age?: number;
  gender?: string;
  nationality?: string;
  nationalityFlag?: string;
  phone?: string;
  email?: string;
  location?: string;
  websiteUrl?: string;
  license?: string;
  experienceYears?: number;
  specialization?: string;
  keyAccomplishments?: string[];
  totalMatches?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  currentValue?: number;
  salary?: number;
  tactics?: number;
  leadership?: number;
  discipline?: number;
};

export type ICoachUpdateRequest = Partial<ICoachCreateRequest>;
