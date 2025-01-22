import { Response } from 'express';

type IData<T> = {
  code: number;
  message?: string;
  data?: T;
  token?: string;
};

const sendResponse = <T>(res: Response, data: IData<T>) => {
  const resData = {
    code: data.code,
    message: data.message,
    data: {
      attributes: data.data,
    },
  };
  res.status(data.code).json(resData);
};
export const sendResponse2 = <T>(res: Response, data: IData<T>) => {
  const resData = {
    data: data.data,
    statusCode: data.code,
    message: data.message,
    token: data.token,
    success: true,
  };
  res.status(data.code).json(resData);
};

export default sendResponse;
