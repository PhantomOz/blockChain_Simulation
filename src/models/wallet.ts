import mongoose from "mongoose";
import { Coin } from "./coin";

export type Wallet = {
  _id: string;
  userId: string;
  privateKey: string;
  phrase: string;
  balance: number;
  activatedCoins: Coin[];
};

class WalletStore {
  async index(): Promise<Wallet[]> {
    return [];
  }
  async show(id: string): Promise<void> {
    return;
  }
  async create(wallet: Wallet): Promise<void> {}
  // async
}
