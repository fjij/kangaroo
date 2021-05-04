import * as db from '../src/db/index.js';
import * as eth2 from '../src/eth2/index.js';
import { User, getOrCreateWallet } from '../src/user/index.js';
import { Wallet } from '../src/eth2/wallet.js';

describe('getOrCreateWallet', () => {
  beforeAll(async () => {
    await eth2.init();
    await db.connect();
  });

  it('should get a wallet with private key for an existing user', async () => {
    const ogWallet = await Wallet.create();
    const userId = '1234';
    await new User({ userId, privateKey: ogWallet.getPrivateKey() }).save();

    const fetchedWallet = await getOrCreateWallet(userId);

    expect(fetchedWallet.getPrivateKey()).toEqual(ogWallet.getPrivateKey());

    await User.deleteMany({});
  });

  it('should create a private key for a non-existing user', async () => {
    const userId = '1234';
    const fetchedWallet = await getOrCreateWallet(userId);
    const privateKey = fetchedWallet.getPrivateKey()
    expect(privateKey).toBeDefined();

    const user = await User.findOne({ userId }).exec();
    expect(user.privateKey).toEqual(privateKey);

    await User.deleteMany({});
  });
});
