import * as eth2 from '../src/eth2/index.js';
import { Amount } from '../src/eth2/amount.js';
import { Wallet } from '../src/eth2/wallet.js';

describe('Wallet', () => {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60;
  const PRIVATE_KEY = process.env.TEST_PRIVATE_KEY;
  

  beforeAll(async () => {
    if (!PRIVATE_KEY) {
      await User.deleteMany({});
      throw new Error(
        'You must provide an account in the TEST_PRIVATE_KEY environment variable'
      );
    }

    await eth2.init();
    const wallet = await Wallet.create(PRIVATE_KEY);
    const balance = await wallet.getBalance({ ticker: 'BAT' });
    expect(parseFloat(balance.getStringValue())).toBeGreaterThanOrEqual(10);
  });

  it('can get private key', async () => {
    const wallet = await Wallet.create(PRIVATE_KEY);
    const privateKey = wallet.getPrivateKey();
    expect(privateKey).toBeDefined();
    expect(privateKey).toEqual(`0x${PRIVATE_KEY}`);
  });

  it('can transfer to a new wallet, register and back', async () => {
    const wallet = await Wallet.create(PRIVATE_KEY);
    const wallet2 = await Wallet.create();

    expect(await wallet.getUnlocked()).toBeTrue();
    expect(await wallet2.getUnlocked()).toBeFalse();

    const token = { ticker: 'BAT' };

    const transferFee = await wallet.getTransferFee(token, wallet2.getAddress());
    const unlockFee2 = await wallet2.getUnlockFee(token);
    const transferFee2 = await wallet2.getTransferFee(token, wallet.getAddress());

    const bufferAmount = Amount.fromStringValue(token, '0.02');
    const sendBackAmount = Amount.fromStringValue(token, '0.05');

    expect(parseFloat((await sendBackAmount.getPrice()).slice(1)))
      .toBeGreaterThan(0);

    const sendAmount = unlockFee2.add(transferFee2)
      .add(bufferAmount)
      .add(sendBackAmount);

    await wallet.transfer(token, wallet2.getAddress(), sendAmount, transferFee);

    const balance = await wallet.getBalance(token);
    const balance2 = await wallet2.getBalance(token);
    expect(balance2.getValue()).toEqual(sendAmount.getClosestPackable().getValue());

    await wallet2.unlock(token);

    expect(await wallet2.getUnlocked()).toBeTrue();

    await wallet2.transfer(token, wallet.getAddress(), sendBackAmount, transferFee2);

    expect((await wallet.getBalance(token)).getValue())
      .toEqual(sendBackAmount.getClosestPackable().add(balance).getValue());
  });
});
