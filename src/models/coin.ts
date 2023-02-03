import mongoose from "mongoose";

export type Coin = {
  _id?: string;
  coinName: string;
  code: string;
  img: string;
  amount: number;
};

class CoinStore {
  async index(): Promise<Coin[]> {
    return [];
  }
  async create(coin: Coin): Promise<void> {}
}
