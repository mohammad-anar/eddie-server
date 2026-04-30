import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AdminRole, UserRole } from "@prisma/client";
import { ProductController } from "./product.controller.js";
import { ProductValidation } from "./product.validation.js";
import fileUploadHandler from "../../middlewares/fileUploadHandler.js";

const router = express.Router();

router.get("/",
  ProductController.getAllProducts);
router.get("/:id", ProductController.getSingleProduct);

router.post(
  "/",
  auth(UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(ProductValidation.createProductZodSchema),
  ProductController.createProduct
);

router.patch(
  "/:id",
  auth(UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(ProductValidation.updateProductZodSchema),
  ProductController.updateProduct
);

router.delete(
  "/:id",
  auth(UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY),
  ProductController.deleteProduct
);

export const ProductRoutes = router;
