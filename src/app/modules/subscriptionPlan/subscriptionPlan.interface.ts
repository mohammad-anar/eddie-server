export type ISubscriptionPlanFilterRequest = {
  searchTerm?: string;
  name?: string;
  category?: string;
  status?: string;
};

export type ISubscriptionPlanCreateRequest = {
  name: string;
  category?: string;
  duration?: string;
  status?: string;
  price?: number;
};

export type ISubscriptionPlanUpdateRequest = Partial<ISubscriptionPlanCreateRequest>;
