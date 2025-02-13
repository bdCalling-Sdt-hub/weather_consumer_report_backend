import refineUrlAr7 from './refineUrlAr7';
import { saveFileToFolder } from './uploadFilesToFolder';

type fType = (myFile: any, directoryPath: string) => Promise<string>;

export const saveAndGiveRefinedUrl: fType = (myFile, directoryPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!myFile) {
        throw new Error('File does not exists');
      }
      const myUrl = (await saveFileToFolder(myFile, directoryPath)) as any;
      const refinedUrl = refineUrlAr7(myUrl);
      resolve(refinedUrl);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
