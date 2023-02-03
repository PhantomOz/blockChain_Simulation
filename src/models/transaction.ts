import mongoose from "mongoose";

//Creating Type For TypeScript
export type Transaction = {
  _id?: string;
  walletId: string;
  amount: number;
  to: string;
  type: string;
  desc: string;
  code: string;
  createdAt?: string;
};
// Creating Schema & Model for Transaction
const TransactionSchema = new mongoose.Schema({
  walletId: String,
  amount: Number,
  to: String,
  type: String,
  desc: String,
  code: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const TransactionModel = mongoose.model("transaction", TransactionSchema);

//Creating Transaction Object
export default class TransactionStore {
  async index(): Promise<Transaction[]> {
    try {
      const getAllTransaction: Transaction[] = await TransactionModel.find({});
      return getAllTransaction;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async getTransactionByWalletId(walletId: string): Promise<Transaction[]> {
    try {
      const getWalletTransaction: Transaction[] = await TransactionModel.find({
        walletId,
      });
      return getWalletTransaction;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async create(trnx: Transaction): Promise<void> {
    try {
      if (trnx.type === "debit") {
        await TransactionModel.create({
          ...trnx,
        })
          .then((res) => {
            res.save();
          })
          .catch((e) => {
            throw new Error(e.message);
          });
        await TransactionModel.create({
          ...trnx,
          walletId: trnx.to,
          to: trnx.walletId,
          type: "credit",
        })
          .then((res) => {
            res.save;
          })
          .catch((e) => {
            throw new Error(e.message);
          });
      } else {
        await TransactionModel.create({
          ...trnx,
        })
          .then((res) => {
            res.save();
          })
          .catch((e) => {
            throw new Error(e.message);
          });
        await TransactionModel.create({
          ...trnx,
          walletId: trnx.to,
          to: trnx.walletId,
          type: "debit",
        })
          .then((res) => {
            res.save;
          })
          .catch((e) => {
            throw new Error(e.message);
          });
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
