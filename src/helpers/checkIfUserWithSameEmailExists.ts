import { userDataModelOfWeatherConsumerReport } from '../app/modules/user/userModelOfWeatherConsumerReport.model';

export const checkIfUserWithSameEmailExists = (
  userEmail: string,
  userDataModel: typeof userDataModelOfWeatherConsumerReport
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await userDataModel.findOne({ email: userEmail });
      if (!users) {
        resolve(
          'NO USER IS REGISTERED BY THIS EMAIL AND A EMAIL CAN BE CREATED WITH THIS EMAIL'
        );
      } else {
        reject('This user is already taken');
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
