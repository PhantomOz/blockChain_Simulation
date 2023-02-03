import mongoose from "mongoose";
import { Coin } from "./coin";
import randomWords from "random-words";

//Create type of Wallet For TypeScript
export type Wallet = {
  _id?: string;
  userId: string;
  type: string;
  privateKey: string;
  phrase: string;
  activatedCoins: Coin[];
  createdAt?: Date;
};

//Creating Wallet Schema & Model for DB
const walletSchema = new mongoose.Schema({
  userId: String,
  privateKey: String,
  phrase: String,
  type: String,
  activatedCoins: Array,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const WalletModel = mongoose.model("wallet", walletSchema);

//Creating Wallet Object
export default class WalletStore {
  //Get All Wallet
  async index(): Promise<Wallet[]> {
    try {
      const getAllWallet: Wallet[] = await WalletModel.find({});
      return getAllWallet;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //Get a Wallet By Id
  async show(id: string): Promise<Wallet> {
    try {
      const getWallet: Wallet | null = await WalletModel.findById(id);
      if (getWallet) {
        return getWallet;
      } else {
        throw new Error(`Wallet not found 404`);
      }
    } catch (error: unknown) {
      throw new Error(`${error}`);
    }
  }

  //Create Wallet for a User
  async create(wallet: Wallet): Promise<void> {
    try {
      const phrases = await randomWords({ exactly: 12 });
      phrases.join(" ");
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //Get All Wallets of a User
  async getUserWallets(userId: string): Promise<Wallet[]> {
    try {
      const getWallets: Wallet[] = await WalletModel.find({ userId: userId });
      return getWallets;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //Credit Transaction
  async creditWallet(
    walletId: string,
    crypto: string,
    amount: number
  ): Promise<void> {
    try {
      const getWallet = await WalletModel.findOne({ _id: walletId });
      if (getWallet) {
        const Coin = await getWallet.activatedCoins.find(
          (coin) => coin.code === crypto
        );
        Coin.amount += amount;
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //Debit Transaction
  async debitWallet(
    walletId: string,
    crypto: string,
    amount: number
  ): Promise<void> {
    try {
      const getWallet = await WalletModel.findOne({ _id: walletId });
      if (getWallet) {
        const Coin = await getWallet.activatedCoins.find(
          (coin) => coin.code === crypto
        );
        Coin.amount -= amount;
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
