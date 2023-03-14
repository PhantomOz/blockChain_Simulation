import randomWords from "random-words";
import HdAddGen from "hdaddressgenerator";

type Address = {
  address: string;
  privKey: string;
  pubKey: string;
  mnemonic: string;
};
const generateAddress = async (
  mnePhrase: string[] = null,
  coin: string = "BTC"
): Promise<Address> => {
  const phrases = mnePhrase || (await randomWords({ exactly: 12 }));
  const mnemonic = phrases.join(" ");

  const bip44 = await HdAddGen.withMnemonic(mnemonic, false, coin);
  const address = await bip44.generate(1);
  return {
    privKey: address[0].privKey,
    pubKey: address[0].pubKey,
    address: address[0].address,
    mnemonic,
  };
};
export default generateAddress;
