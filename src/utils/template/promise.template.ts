export const myPromiseFunction = () => {
  return new Promise(async (resolve, reject) => {
    try {
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
