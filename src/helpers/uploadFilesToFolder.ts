import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const saveFileToFolder = (userImage: any, directoryName: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Ensure directoryName is resolved to an absolute path
      const uploadFolder = path.resolve(directoryName);

      // Generate a random file name
      const randomName = crypto.randomBytes(16).toString('hex'); // 32-character random string
      const fileExtension = path.extname(userImage.originalFilename); // Retain the original file extension
      const newFilename = `${randomName}${fileExtension}`; // Combine the random name with the file extension
      const destPath = path.join(uploadFolder, newFilename);

      // Ensure the upload folder exists
      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true }); // Create the folder and ensure all parent folders exist
      }

      // Move the file to the 'upload' folder
      await fs.promises.rename(userImage.filepath, destPath);

      resolve(destPath); // Resolve the promise with the destination path
    } catch (error) {
      console.error('Error while saving the file:', error);
      reject(error); // Reject the promise with the error
    }
  });
};
