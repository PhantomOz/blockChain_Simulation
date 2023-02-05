import { Application, Request, Response } from "express";
import WalletStore from "../models/wallet";
import { read } from "fs";
import isAuthorized from "../middleware/authorization";

const walletStore = new WalletStore();

const index = async (req: Request, res: Response) => {
  try {
    const wallet = await walletStore.index();
    res.status(200).json(wallet);
  } catch (error) {
    res.status(404).json(error);
  }
};

const createWallet = async (req: Request, res: Response) => {
  try {
    await walletStore.create(
      JSON.parse(req.user).id,
      req.body.activatedCoins,
      req.params.type
    );
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getUserWallets = async (req: Request, res: Response) => {
  try {
    const userWallets = await walletStore.getUserWallets(
      JSON.parse(req.user).id
    );
    res.status(200).json(userWallets);
  } catch (error) {
    res.status(404).json(error);
  }
};

const showWallet = async (req: Request, res: Response) => {
  try {
    const wallet = await walletStore.show(req.params.id);
    res.status(200).json(wallet);
  } catch (error) {
    res.status(404).json(error);
  }
};

const trnxWallet = async (req: Request, res: Response) => {
  try {
    await walletStore.creditWallet(
      req.body.receiver,
      req.body.coin,
      req.body.amount
    );
    await walletStore.debitWallet(
      req.body.sender,
      req.body.coin,
      req.body.amount
    );
    res.status(200).send({ message: "Success" });
  } catch (error) {
    res.status(404).json(error);
  }
};

const walletRoutes = (app: Application) => {
  app.get("/wallet", index);
  app.post("/wallet", isAuthorized, createWallet);
  app.get("/wallet/user", isAuthorized, getUserWallets);
  app.put("/wallet/trxn%20wallet/:type", isAuthorized, trnxWallet);
  app.get("/wallet/:id", isAuthorized, showWallet);
};

export default walletRoutes;
