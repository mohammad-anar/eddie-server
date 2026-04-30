import ApiError from "../../errors/ApiError.js";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const fileUploadHandler = () => {
  //create upload folder
  const baseUploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  //folder create for different file
  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  //create filename
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;
      switch (file.fieldname) {
        case "image":
        case "logo":
        case "countryFlag":
        case "coverPhoto":
        case "styleImage":
        case "galleryImages":
        case "productImage":
        case "images":
          uploadDir = path.join(baseUploadDir, "image");
          break;
        case "media":
        case "matchHighlights":
        case "videos":
          uploadDir = path.join(baseUploadDir, "media");
          break;
        case "doc":
          uploadDir = path.join(baseUploadDir, "doc");
          break;
        default:
          throw new ApiError(StatusCodes.BAD_REQUEST, "File is not supported");
      }
      createDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  //file filter
  const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    const imageFields = ["image", "logo", "countryFlag", "coverPhoto", "styleImage", "galleryImages", "productImage", "images"];
    const mediaFields = ["media", "matchHighlights", "videos"];
    const docFields = ["doc"];

    if (imageFields.includes(file.fieldname)) {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/webp" ||
        file.mimetype === "image/jpg"
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "Only .jpeg, .png, .jpg file supported",
          ),
        );
      }
    } else if (mediaFields.includes(file.fieldname)) {
      if (file.mimetype === "video/mp4" || file.mimetype === "audio/mpeg") {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "Only .mp4, .mp3, file supported",
          ),
        );
      }
    } else if (docFields.includes(file.fieldname)) {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new ApiError(StatusCodes.BAD_REQUEST, "Only pdf supported"));
      }
    } else {
      cb(new ApiError(StatusCodes.BAD_REQUEST, "This file is not supported"));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: filterFilter,
  }).fields([
    { name: "image", maxCount: 10 },
    { name: "media", maxCount: 10 },
    { name: "doc", maxCount: 10 },
    { name: "logo", maxCount: 10 },
    { name: "countryFlag", maxCount: 10 },
    { name: "coverPhoto", maxCount: 10 },
    { name: "styleImage", maxCount: 10 },
    { name: "galleryImages", maxCount: 10 },
    { name: "matchHighlights", maxCount: 10 },
    { name: "productImage", maxCount: 10 },
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 10 },
  ]);
  return upload;
};

export default fileUploadHandler;
