export type ISponsorFilterRequest = {
  searchTerm?: string;
  companyName?: string;
  status?: string;
  paymentStatus?: string;
  academyId?: string;
};

export type ISponsorCreateRequest = {
  companyName: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  contactPersonAddress?: string;
  sponsorType?: string;
  status?: string;
  contractValue?: number;
  paymentStatus?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  benefitsOrDeliverables?: string;
  academyId?: string;
};

export type ISponsorUpdateRequest = Partial<ISponsorCreateRequest>;
