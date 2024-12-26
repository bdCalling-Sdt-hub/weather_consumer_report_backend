import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WalletService } from './wallet.services';

const getWallet = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const result = await WalletService.getWalletByUserId(userId);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Wallet retrieved successfully.',
    data: result,
  });
});
const addMoney = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  const { amount } = req.body;
  const result = await WalletService.addMoney(userId, amount);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Money added to wallet successfully.',
    data: result,
  });
});

const withdrawMoney = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  const { amount } = req.body;
  const result = await WalletService.withdrawMoney(userId, amount);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Money withdrawn from wallet successfully.',
    data: result,
  });
});

export const WalletController = {
  getWallet,
  addMoney,
  withdrawMoney,
};
