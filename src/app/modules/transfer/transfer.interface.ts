export type ITransferFilterRequest = {
  searchTerm?: string;
  playerId?: string;
  agentId?: string;
  sourceClubId?: string;
  sourceAcademyId?: string;
  destClubId?: string;
  destAcademyId?: string;
  status?: string;
  category?: string;
};

export type ITransferCreateRequest = {
  playerId: string;
  agentId?: string;
  sourceClubId?: string;
  sourceAcademyId?: string;
  destClubId?: string;
  destAcademyId?: string;
  transferFee?: number;
  commissionAmount?: number;
  status?: string;
  category: string;
  academyTransferType?: string;
  initiatorType: string;
  negotiationTerms?: string;
  agreementDate?: string;
  completionDate?: string;
};

export type ITransferUpdateRequest = Partial<ITransferCreateRequest>;
