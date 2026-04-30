import { z } from "zod";

const createProductZodSchema = z.object({
  name: z.string({
    message: "Name is required",
  }),
  category: z.string().optional(),
  sku: z.string().optional(),
  regularPrice: z.number().optional(),
  salePrice: z.number().optional(),
  description: z.string().optional(),
  availableSize: z.string().optional(),
  availableColors: z.string().optional(),
  stockQuantity: z.number().optional(),
  minStockLevel: z.number().optional(),
  maxOrderQuantity: z.number().optional(),
  productImage: z.string().optional(),
  status: z.string().optional(),
  isFeatured: z.boolean().optional(),
  academyId: z.string().optional(),
});

const updateProductZodSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  sku: z.string().optional(),
  regularPrice: z.number().optional(),
  salePrice: z.number().optional(),
  description: z.string().optional(),
  availableSize: z.string().optional(),
  availableColors: z.string().optional(),
  stockQuantity: z.number().optional(),
  minStockLevel: z.number().optional(),
  maxOrderQuantity: z.number().optional(),
  productImage: z.string().optional(),
  status: z.string().optional(),
  isFeatured: z.boolean().optional(),
  academyId: z.string().optional(),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
};
