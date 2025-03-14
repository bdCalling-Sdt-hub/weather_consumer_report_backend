import { userDataModelOfWeatherConsumerReport } from '../app/modules/user/userModelOfWeatherConsumerReport.model';

export const checkIfUserWithSameEmailExists = async (
  userEmail: string,
  userDataModel: typeof userDataModelOfWeatherConsumerReport
) => {
  try {
    const user = await userDataModel.findOne({ email: userEmail });
    if (!user) {
      return 'NO USER IS REGISTERED BY THIS EMAIL, AND AN EMAIL CAN BE CREATED WITH THIS EMAIL';
    } else {
      throw new Error('This user is already taken');
    }
  } catch (error: any) {
    console.error(error);
    throw new Error(
      'An error occurred while checking user email: ' + error.message
    );
  }
};
