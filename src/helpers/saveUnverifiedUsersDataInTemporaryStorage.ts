import { unverifiedUsers } from '../data/temporaryData';

export const saveUnverifiedUsersDataInTemporaryStorage = (userData: any) => {
  unverifiedUsers.push(userData);
};
