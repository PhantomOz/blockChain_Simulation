import mongoose from "mongoose";

//Creating type for TypeScript
export type Coin = {
  _id?: string;
  coinName: string;
  code: string;
  img: string;
  amount: number;
};

//Creating Schema and Model For DB
const coinSchema = new mongoose.Schema({
  coinName: String,
  code: String,
  img: String,
  amount: {
    type: Number,
    default: 0,
  },
});

const CoinModel = mongoose.model("coin", coinSchema);

//Creating Coin Object
export default class CoinStore {
  //Getting All Coins
  async index(): Promise<Coin[]> {
    try {
      const getAllCoins: Coin[] = await CoinModel.find({});
      return getAllCoins;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //Creating Coin
  async create(coin: Coin): Promise<void> {
    try {
      const newCoin = await CoinModel.create({
        ...coin,
      });
      newCoin.save();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
