import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

// Define the function type
type saveFileToFolderType = (
  userImage: any,
  directoryName: string
) => Promise<string>;

export const saveFileToFolder: saveFileToFolderType = async (
  userImage,
  directoryName
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadFolder = path.resolve(directoryName);
      const randomName = crypto.randomBytes(16).toString('hex');
      const fileExtension = path
        .extname(userImage.originalFilename)
        .toLowerCase();
      const isImage = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.bmp',
        '.tiff',
        '.webp',
      ].includes(fileExtension);
      const newFilename = isImage
        ? `${randomName}.webp`
        : `${randomName}${fileExtension}`;
      const destPath = path.join(uploadFolder, newFilename);

      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      if (isImage) {
        // Convert image to WebP
        await sharp(userImage.filepath)
          .webp({ quality: 80 }) // Adjust quality as needed
          .toFile(destPath);
      } else {
        await fs.promises.copyFile(userImage.filepath, destPath);
      }

      resolve(destPath);
    } catch (error) {
      console.error('Error while saving the file:', error);
      reject(error);
    }
  });
};
