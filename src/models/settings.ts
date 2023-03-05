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

const settingModel = new mongoose.Model("setting", settingSchema);

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

  async index(): Promise<Settings> {
    try {
      const set = await settingModel.find({});
      return set[0];
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
