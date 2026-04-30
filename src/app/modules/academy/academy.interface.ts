export type IAcademyFilterRequest = {
  searchTerm?: string;
  name?: string;
  city?: string;
  clubId?: string;
};

export type IAcademyCreateRequest = {
  clubId?: string;
  name: string;
  logo?: string;
  coverPhoto?: string;
  nationality?: string;
  nationalityFlag?: string;
  dateOfEstablishment?: string;
  city?: string;
  secondaryEmail?: string;
  secondaryPhone?: string;
  website?: string;
  description?: string;
  visionAndMission?: string;
  trainingPhilosophy?: string;
  ageGroup?: string;
};

export type IAcademyUpdateRequest = Partial<IAcademyCreateRequest>;
