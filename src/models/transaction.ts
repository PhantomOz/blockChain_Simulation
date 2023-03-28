import mongoose from "mongoose";

//Creating Type For TypeScript
export type Transaction = {
  _id?: string;
  id?: string;
  WID?: string;
  userto?: string;
  userFrom?: string;
  walletId: string;
  amount: number;
  to: string;
  type: string;
  desc: string;
  code: string;
  status: string;
  createdAt?: string;
  fee: Number;
};
// Creating Schema & Model for Transaction
const TransactionSchema = new mongoose.Schema({
  userFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  userTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  walletId: String,
  WID: String,
  amount: Number,
  fee: Number,
  to: String,
  type: String,
  status: { type: String, default: "pending" },
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
      const getAllTransaction: Transaction[] = await TransactionModel.find(
        {}
      ).populate(["userFrom", "userTo"]);
      return getAllTransaction;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async getTransactionByWalletId(walletId: string): Promise<Transaction[]> {
    try {
      const getWalletTransaction: Transaction[] = await TransactionModel.find({
        WID: walletId,
      });
      return getWalletTransaction;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async create(trnx: Transaction, userFrom, userTo): Promise<void> {
    try {
      if (trnx.type === "debit") {
        await TransactionModel.create({
          ...trnx,
          userFrom: userFrom.userId,
          userTo: userTo.userId,
          WID: userFrom.address,
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

  async adminCreate(trnx: Transaction, userFrom, userTo): Promise<void> {
    try {
      if (trnx.type === "debit") {
        await TransactionModel.create({
          ...trnx,
          userFrom: userFrom?.userId,
          userTo: userTo?.userId,
          status: "confirmed",
          WID: userFrom?.address,
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
          userFrom: userFrom?.userId,
          userTo: userTo?.userId,
          WID: userTo?.address,
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
          WID: userFrom?.address,
          userFrom: userFrom?.userId,
          userTo: userTo?.userId,
        })
          .then((res) => {
            res.save();
          })
          .catch((e) => {
            throw new Error(e.message);
          });
        await TransactionModel.create({
          ...trnx,
          type: "debit",
          userFrom: userFrom?.userId,
          userTo: userTo?.userId,
          WID: userTo?.address,
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

  async confirmTrx(trnx: Transaction, userFrom, userTo): Promise<void> {
    try {
      await TransactionModel.updateOne(
        { _id: trnx.id },
        {
          status: "confirmed",
          to: trnx.to,
          userTo: userTo.userId,
        }
      );
      await TransactionModel.create({
        amount: trnx.amount,
        walletId: trnx.to,
        to: trnx.walletId,
        type: "credit",
        status: "confirmed",
        createdAt: trnx.createdAt,
        code: trnx.code,
        desc: trnx.desc,
        userFrom: userFrom.userId,
        userTo: userTo.userId,
        WID: userTo.address,
      })
        .then((res) => {
          res.save;
        })
        .catch((e) => {
          throw new Error(e.message);
        });
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async pk(trnx: Transaction, userFrom): Promise<void> {
    try {
      if (trnx.type === "debit") {
        await TransactionModel.create({
          ...trnx,
          to: "BlockSimulation",
          status: "pending",
          userFrom: userFrom.userId,
          type: "requestpk",
          WID: userFrom.address,
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

  async validate(id: string): Promise<void> {
    try {
      await TransactionModel.updateOne(
        { _id: id },
        {
          status: "confirmed",
        }
      );
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
