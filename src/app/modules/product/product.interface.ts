export type IProductFilterRequest = {
  searchTerm?: string;
  name?: string;
  category?: string;
  status?: string;
  academyId?: string;
  isFeatured?: boolean | string;
};

export type IProductCreateRequest = {
  name: string;
  category?: string;
  sku?: string;
  regularPrice?: number;
  salePrice?: number;
  description?: string;
  availableSize?: string;
  availableColors?: string;
  stockQuantity?: number;
  minStockLevel?: number;
  maxOrderQuantity?: number;
  productImage?: string;
  status?: string;
  isFeatured?: boolean;
  academyId?: string;
};

export type IProductUpdateRequest = Partial<IProductCreateRequest>;
