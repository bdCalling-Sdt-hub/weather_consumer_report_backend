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

const addMoney = async (userId: string, amount: number): Promise<IWallet> => {
  if (amount <= 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Amount must be greater than zero.'
    );
  }
  // Use findOneAndUpdate with upsert to add money and create wallet if necessary
  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    {
      $inc: { balance: amount },
      $push: {
        transactions: {
          amount,
          type: 'CREDIT',
          description: 'Money added to wallet',
          createdAt: new Date(),
        },
      },
    },
    { new: true, upsert: true } // `upsert` creates the wallet if it doesn't exist
  );

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
  addMoney,
  withdrawMoney,
};
