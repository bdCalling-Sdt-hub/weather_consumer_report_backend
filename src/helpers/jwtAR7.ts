import jwt, { JwtPayload } from 'jsonwebtoken';

export const giveAuthenticationToken = (email: string, secretKey: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const forSaving = { email: email };
      const authenticationToken = await jwt.sign(forSaving, secretKey, {
        expiresIn: '1y',
      });
      resolve(authenticationToken);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const parseJwtToken = (token: string, secretKey: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await jwt.verify(token, secretKey);
      resolve(data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
