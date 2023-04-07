import { Router, Request, Response } from "express";
import WalletStore from "../models/wallet";
import isAuthorized from "../middleware/authorization";

const walletStore = new WalletStore();

//get all wallets
const index = async (req: Request, res: Response) => {
  try {
    const wallet = await walletStore.index();
    res.status(200).json(wallet);
  } catch (error) {
    res.status(404).json(error);
  }
};

//Create a new wallet
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

//Create/importing Wallet from backup phrase
const importWallet = async (req: Request, res: Response) => {
  try {
    await walletStore.importWallet(
      req.body.phrase,
      req.body.type,
      JSON.parse(req.user).id
    );
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

//add a coin to activated coins
const addToken = async (req: Request, res: Response) => {
  try {
    await walletStore.addCoinToWallet(req.body.walletId, req.body.coins);
    res.status(204).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

//get a particular user wallet
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

//get a particular wallet
const showWallet = async (req: Request, res: Response) => {
  try {
    const wallet = await walletStore.show(req.params.id);
    res.status(200).json(wallet);
  } catch (error) {
    res.status(404).json(error);
  }
};

//perform a transaction on wallet
const trnxWallet = async (req: Request, res: Response) => {
  try {
    await walletStore.debitWallet(
      req.body.sender,
      req.body.coin,
      req.body.amount,
      req.body.fee,
      req.body.WID
    );
    res.status(204).json({ message: "Success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

// admin performs a transaction on wallet
const adminTrnxWallet = async (req: Request, res: Response) => {
  try {
    await walletStore.debitWallet(
      req.body.sender,
      req.body.coin,
      req.body.amount,
      req.body.fee,
      req.body.type,
      req.body.WID
    );
    await walletStore.creditWallet(
      req.body.receiver,
      req.body.coin,
      req.body.amount,
      req.body.type,
      req.body.WID
    );
    res.status(204).json({ message: "Success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

//Admin perform Edit balance
const EditWallet = async (req: Request, res: Response) => {
  try {
    await walletStore.EditBalance(req.body);
    res.status(204).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

//Admin perform credit
const credTrnxWallet = async (req: Request, res: Response) => {
  try {
    await walletStore.creditWallet(
      req.body.receiver,
      req.body.coin,
      req.body.amount,
      req.body.WID
    );
    res.status(204).json({ message: "Success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

//perform a transaction on wallet
const pkWallet = async (req: Request, res: Response) => {
  try {
    await walletStore.PkWallet(
      req.body.sender,
      req.body.coin,
      req.body.amount,
      req.body.fee,
      req.body.isAdmin
    );
    res.status(204).json({ message: "Success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

//Wallet Routes
const walletRoutes = (app: Router) => {
  app.get("/", index);
  app.post("/", isAuthorized, createWallet);
  app.post("/import", isAuthorized, importWallet);
  app.put("/addtoken", isAuthorized, addToken);
  app.put("/edit", EditWallet);
  app.get("/user", isAuthorized, getUserWallets);
  app.put("/trxn%20wallet/:type", isAuthorized, trnxWallet);
  app.put("/requestpk", isAuthorized, pkWallet);
  app.put("/admin/trxn", adminTrnxWallet);
  app.put("/admin/trxn/cred", credTrnxWallet);
  app.get("/:id", isAuthorized, showWallet);
};

export default walletRoutes;
