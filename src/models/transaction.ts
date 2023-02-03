import mongoose from "mongoose";

//Creating Type For TypeScript
export type Transaction = {
  _id?: string;
  walletId: string;
  amount: number;
  to: string;
  type: string;
  createdat?: string;
};
// Creating Schema & Model for Transaction

class TransactionStore {
  async index(): Promise<Transaction[]> {
    return [];
  }
  async getTransactionByWalletId(walletId: string): Promise<Transaction[]> {
    return [];
  }
  async create(trnx: Transaction): Promise<void> {}
}
