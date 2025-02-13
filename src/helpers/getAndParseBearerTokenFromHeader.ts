import { parseJwtToken } from './jwtAR7';
import { refineToken } from './refineToken';

type fType = (
  req: any,
  jwtSecretKey: any
) => Promise<{ iat: number; exp: number; [key: string]: any }>;

export const getAndParseJwtTokenFromHeader: fType = (
  req: any,
  jwtSecretKey: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const authHeader = req.headers.authorization;
      const authToken = refineToken(authHeader) as any;
      const userData = (await parseJwtToken(authToken, jwtSecretKey)) as any;
      resolve(userData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
