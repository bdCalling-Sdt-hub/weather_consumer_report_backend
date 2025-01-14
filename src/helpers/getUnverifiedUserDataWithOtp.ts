export const getUnverifiedUserDataAccordingToOtp = (
  otp: string,
  unverifiedUserData: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const savedUserData = unverifiedUserData.filter(
        (data: any) => data.otp === otp
      )[0];
      if (savedUserData) {
        resolve(savedUserData);
      } else {
        reject('USER DATA NOT FOUND');
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
