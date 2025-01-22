import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../shared/sendResponse';
import { myControllerHandler } from '../controller/myControllerHandler.utils';

export const myController = myControllerHandler(async (req, res) => {
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Review Given Successfully',
    data: {},
  });
});
