/* eslint-disable @typescript-eslint/no-explicit-any */

const folderMapping: Record<string, string> = {
  image: "image",
  logo: "image",
  countryFlag: "image",
  coverPhoto: "image",
  styleImage: "image",
  galleryImages: "image",
  productImage: "image",
  images: "image",
  media: "media",
  matchHighlights: "media",
  videos: "media",
  doc: "doc",
};

//single file
export const getSingleFilePath = (files: any, fieldName: string) => {
  const fileField = files && files[fieldName];
  if (fileField && Array.isArray(fileField) && fileField.length > 0) {
    const folderName = folderMapping[fieldName] || "image";
    return `/${folderName}/${fileField[0].filename}`;
  }

  return undefined;
};

//multiple files
export const getMultipleFilesPath = (files: any, fieldName: string) => {
  const folderFiles = files && files[fieldName];
  if (folderFiles && Array.isArray(folderFiles)) {
    const folderName = folderMapping[fieldName] || "image";
    return folderFiles.map((file: any) => `/${folderName}/${file.filename}`);
  }

  return undefined;
};
