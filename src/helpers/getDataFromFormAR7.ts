import formidable from 'formidable';

export const getDataFromFormOfRequest = (req: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const form = formidable({
        allowEmptyFiles: true,
        minFileSize: 0,
      });
      let fields: any;
      let files: any;
      [fields, files] = await form.parse(req);
      resolve({ fields, files });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
