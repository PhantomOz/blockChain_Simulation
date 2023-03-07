import mongoose from "mongoose";

export type Settings = {
  _id?: string;
  gasfee: number;
  privateKey: number;
};

const settingSchema = new mongoose.Schema({
  gasfee: {
    type: Number,
    default: 0.02,
  },
  privateKey: {
    type: Number,
    default: 0.02,
  },
});

const settingModel = mongoose.model("setting", settingSchema);

export default class SettingStore {
  async setFees(fees: Settings): Promise<void> {
    try {
      const set = await settingModel.findById(fees._id);
      set.gasfee = fees.gasfee;
      set.privateKey = fees.privateKey;
      set.save();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async create(fees: Settings): Promise<void> {
    try {
      const set = await settingModel.create(fees);
      set.save();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async index(): Promise<Settings[]> {
    try {
      const set: Settings[] = await settingModel.find({});
      return set;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
