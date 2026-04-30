export type IPostFilterRequest = {
  searchTerm?: string;
  userId?: string;
  playerId?: string;
  academyId?: string;
  clubId?: string;
  coachId?: string;
  type?: string;
};

export type IPostCreateRequest = {
  userId: string;
  content?: string;
  type?: string;
  playerId?: string;
  academyId?: string;
  clubId?: string;
  coachId?: string;
  images?: string[];
  videos?: string[];
  article?: {
    title: string;
    body?: string;
    summary?: string;
    academyId?: string;
  };
};

export type IPostUpdateRequest = Partial<IPostCreateRequest>;
