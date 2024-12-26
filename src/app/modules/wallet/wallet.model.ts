import mongoose, { Schema, model } from 'mongoose';
import { IWallet } from './wallet.interface';

const WalletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    balance: { type: Number, required: true, default: 0 },
    transactions: [
      {
        amount: { type: Number, required: true },
        type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
        description: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Wallet = model<IWallet>('Wallet', WalletSchema);
