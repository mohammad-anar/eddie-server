export type IParentFilterRequest = {
  searchTerm?: string;
  userId?: string;
};

export type IParentCreateRequest = {
  userId: string;
  addressId?: string;
};

export type IParentUpdateRequest = Partial<IParentCreateRequest>;
