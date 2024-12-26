import { Types } from 'mongoose';

export interface IWallet {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  balance: number;
  transactions: {
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    description: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
