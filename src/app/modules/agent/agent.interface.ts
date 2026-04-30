export type IAgentFilterRequest = {
  searchTerm?: string;
  agencyName?: string;
  verificationStatus?: string;
  clubId?: string;
};

export type IAgentCreateRequest = {
  userId: string;
  agencyName?: string;
  licenseNumber?: string;
  experienceYears?: number;
  specialization?: string;
  verificationStatus?: string;
  commissionRate?: number;
  clubId?: string;
};

export type IAgentUpdateRequest = Partial<IAgentCreateRequest>;
