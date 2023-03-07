import mongoose from "mongoose";
import { Coin } from "./coin";
import generateAddress from "../utils/genAddress";

//Create type of Wallet For TypeScript
export type Wallet = {
  _id?: string;
  userId: string;
  type: string;
  privateKey: string;
  pubKey: string;
  address: string;
  phrase: string;
  activatedCoins: Coin[];
  activationBalance: number;
  createdAt?: Date;
};

//Creating Wallet Schema & Model for DB
const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId || String,
    ref: "user",
  },
  privateKey: String,
  pubKey: String,
  address: String,
  phrase: String,
  type: String,
  activatedCoins: Array,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  activationBalance: {
    type: Number,
    default: 0,
  },
  pk: {
    type: Boolean,
    default: false,
  },
});

const WalletModel = mongoose.model("wallet", walletSchema);

//Creating Wallet Object
export default class WalletStore {
  //Get All Wallet
  async index(): Promise<Wallet[]> {
    try {
      const getAllWallet: Wallet[] = await WalletModel.find({}).populate(
        "userId"
      );
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
  async create(
    userId: string,
    activatedCoins: Coin[],
    type: string
  ): Promise<void> {
    try {
      const address = await generateAddress();
      const newWallet = await WalletModel.create({
        activatedCoins,
        userId,
        type,
        phrase: address.mnemonic,
        privateKey: address.privKey,
        address: address.address,
        pubKey: address.pubKey,
      });
      newWallet.save();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //Importing Wallet
  async importWallet(
    phrase: string[],
    type: string,
    userId: string
  ): Promise<void> {
    try {
      const wallet = await WalletModel.findOne({ phrase: phrase.join(" ") });
      if (wallet) {
        wallet.userId = userId;
        wallet.save();
      } else {
        const activatedCoins = [
          {
            _id: "63e76100da1821d053c21432",
            coinName: "Bitcoin",
            code: "BTC",
            img: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
            amount: 0,
            __v: 0,
          },
        ];
        const address = await generateAddress(phrase);
        const newWallet = await WalletModel.create({
          activatedCoins,
          userId,
          type,
          phrase: address.mnemonic,
          privateKey: address.privKey,
          address: address.address,
          pubKey: address.pubKey,
        });
        newWallet.save();
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //Add ActivatedCoins
  async addCoinToWallet(walletId: string, coins: Coin[]): Promise<void> {
    try {
      const Wallet = await WalletModel.findById(walletId);
      if (Wallet) {
        Wallet.activatedCoins = [...Wallet.activatedCoins, ...coins];
      }
      Wallet.save();
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
    address: string,
    crypto: string,
    amount: number
  ): Promise<void> {
    try {
      let getWallet = await WalletModel.findOne({ address: address });
      if (getWallet) {
        const Coin = await getWallet.activatedCoins.find(
          (coin) => coin.code === crypto
        );
        Coin.amount = Number(amount) + Number(Coin.amount);
        console.log(getWallet, Coin);
        await WalletModel.updateOne(
          { address },
          {
            activatedCoins: getWallet.activatedCoins,
          }
        );
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //Debit Transaction
  async debitWallet(
    walletId: string,
    crypto: string,
    amount: number,
    fee: number
  ): Promise<void> {
    try {
      const getWallet = await WalletModel.findOne({ address: walletId });
      if (getWallet) {
        const Coin = await getWallet.activatedCoins.find(
          (coin) => coin.code === crypto
        );
        const Btc = await getWallet.activatedCoins.find(
          (coin) => coin.code === "BTC"
        );
        Coin.amount -= amount;
        Btc.amount -= fee;
        await WalletModel.updateOne(
          { address: walletId },
          {
            activatedCoins: getWallet.activatedCoins,
          }
        );
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  //Edit Balance
  async EditBalance(wallet: Wallet): Promise<void> {
    try {
      let getWallet = await WalletModel.findById(wallet._id);
      getWallet.activatedCoins = wallet.activatedCoins;
      getWallet.activationBalance = wallet.activationBalance;
      getWallet.save();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //pk
  async PkWallet(
    walletId: string,
    crypto: string,
    amount: number,
    fee: number
  ): Promise<void> {
    try {
      const getWallet = await WalletModel.findOne({ address: walletId });
      if (getWallet) {
        const Coin = await getWallet.activatedCoins.find(
          (coin) => coin.code === crypto
        );
        const Btc = await getWallet.activatedCoins.find(
          (coin) => coin.code === "BTC"
        );
        Coin.amount -= amount;
        Btc.amount -= fee;
        await WalletModel.updateOne(
          { address: walletId },
          {
            activatedCoins: getWallet.activatedCoins,
            pk: true,
          }
        );
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
