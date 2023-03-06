import mongoose from "mongoose";

//Creating Type For TypeScript
export type Transaction = {
  _id?: string;
  id?: string;
  walletId: string;
  amount: number;
  to: string;
  type: string;
  desc: string;
  code: string;
  status: string;
  createdAt?: string;
};
// Creating Schema & Model for Transaction
const TransactionSchema = new mongoose.Schema({
  walletId: String,
  amount: Number,
  to: String,
  type: String,
  status: String,
  desc: String,
  code: String,
  createdAt: {
    type: Date,
    default: new Date(),
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
          status: "pending",
        })
          .then((res) => {
            res.save();
          })
          .catch((e) => {
            throw new Error(e.message);
          });
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async adminCreate(trnx: Transaction): Promise<void> {
    try {
      if (trnx.type === "debit") {
        await TransactionModel.create({
          ...trnx,
          status: "confirmed",
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
          status: "confirmed",
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

  async confirmTrx(trnx: Transaction): Promise<void> {
    console.log(trnx);
    try {
      const getTrnx = await TransactionModel.findById(trnx.id);
      getTrnx.status = "confirmed";
      getTrnx.to = trnx.to;
      getTrnx.save();
      await TransactionModel.create({
        amount: trnx.amount,
        walletId: trnx.to,
        to: trnx.walletId,
        type: "credit",
        status: "confirmed",
        createdAt: trnx.createdAt,
        code: trnx.code,
        desc: trnx.desc,
      })
        .then((res) => {
          res.save;
        })
        .catch((e) => {
          throw new Error(e.message);
          console.log(e);
        });
    } catch (error) {
      throw new Error(`${error}`);
      console.log(error);
    }
  }
}
