import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Wallet } from './wallet.model';
import { IWallet } from './wallet.interface';

const getWalletByUserId = async (userId: string): Promise<IWallet | null> => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Wallet not found.');
  }
  return wallet;
};

const createWallet = async (userId: string): Promise<IWallet> => {
  const existingWallet = await Wallet.findOne({ userId });
  if (existingWallet) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Wallet already exists.');
  }
  const wallet = await Wallet.create({ userId, balance: 0, transactions: [] });
  return wallet;
};

const addMoney = async (userId: string, amount: number): Promise<IWallet> => {
  if (amount <= 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Amount must be greater than zero.'
    );
  }

  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    {
      $inc: { balance: amount },
      $push: {
        transactions: {
          amount,
          type: 'CREDIT',
          description: 'Money added to wallet',
        },
      },
    },
    { new: true }
  );
  if (!wallet) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Wallet not found.');
  }
  return wallet;
};

const withdrawMoney = async (
  userId: string,
  amount: number
): Promise<IWallet> => {
  if (amount <= 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Amount must be greater than zero.'
    );
  }

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Wallet not found.');
  }
  if (wallet.balance < amount) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient wallet balance.');
  }

  wallet.balance -= amount;
  wallet.transactions.push({
    amount,
    type: 'DEBIT',
    description: 'Money withdrawn from wallet',
    createdAt: new Date(),
  });
  await wallet.save();
  return wallet;
};

export const WalletService = {
  getWalletByUserId,
  createWallet,
  addMoney,
  withdrawMoney,
};
