import { parseJwtToken } from './jwtAR7';

export const getAndParseJwtTokenFromHeader = (
  req: any,
  jwtSecretKey: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const authHeader = req.headers.authorization;
      const authToken = authHeader?.split(' ')[1] as string;
      const userData = (await parseJwtToken(authToken, jwtSecretKey)) as any;
      resolve(userData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
