import * as eth2 from '../src/eth2/index.js';

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  throw new Error('You must provide an account in the PRIVATE_KEY environment variable');
}

describe('Wallet', () => {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60;

  beforeAll(async () => {
    await eth2.init();
    const wallet = await eth2.Wallet.create(PRIVATE_KEY);
    const balance = await wallet.getBalance({ ticker: 'BAT' });
    expect(parseFloat(balance.getStringValue())).toBeGreaterThanOrEqual(10);
  });

  it('can transfer to a new wallet, register and back', async () => {
    const wallet = await eth2.Wallet.create(PRIVATE_KEY);
    const wallet2 = await eth2.Wallet.create();

    const token = { ticker: 'BAT' };

    const transferFee = await wallet.getTransferFee(token, wallet2.getAddress());
    const unlockFee2 = await wallet2.getUnlockFee(token);
    const transferFee2 = await wallet2.getTransferFee(token, wallet.getAddress());

    const bufferAmount = eth2.Amount.fromStringValue(token, '0.02');
    const sendBackAmount = eth2.Amount.fromStringValue(token, '0.05');

    const sendAmount = unlockFee2.add(transferFee2)
      .add(bufferAmount)
      .add(sendBackAmount);

    await wallet.transfer(token, wallet2.getAddress(), sendAmount, transferFee);

    const balance = await wallet.getBalance(token);
    const balance2 = await wallet2.getBalance(token);
    expect(balance2.getValue()).toEqual(sendAmount.getClosestPackable().getValue());

    await wallet2.unlock(token);
    await wallet2.transfer(token, wallet.getAddress(), sendBackAmount, transferFee2);

    expect((await wallet.getBalance(token)).getValue())
      .toEqual(sendBackAmount.getClosestPackable().add(balance).getValue());
  });
});
