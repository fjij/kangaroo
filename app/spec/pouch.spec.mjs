import { Pouch, getBalance } from '../src/pouch/index.js';
import { connect } from '../src/db/index.js';
import * as eth2 from '../src/eth2/index.js';

describe('Pouches', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await Pouch.deleteMany({});
  });

  it('should enforce a unique userId/tokenId combo', async () => {
    await (new Pouch({ userId: '1', tokenId: '1', balance: 0 })).save();
    await (new Pouch({ userId: '2', tokenId: '1', balance: 0 })).save();
    await (new Pouch({ userId: '2', tokenId: '2', balance: 0 })).save();
    await (new Pouch({ userId: '1', tokenId: '2', balance: 0 })).save();
    await new Promise(resolve => setTimeout(resolve, 100));
    try {
      await (new Pouch({ userId: '1', tokenId: '1', balance: 0  })).save();
      throw new Error('Should reject!');
    } catch(e) {
      expect(e.name).toEqual('MongoError');
      expect(e.code).toEqual(11000);
    }
  });
});

describe('getBalance', () => {
  beforeAll(async () => {
    await connect();
    await eth2.init();
    await (new Pouch({ userId: '1', tokenId: '5', balance: '20' })).save();
  });

  afterAll(async () => {
    await Pouch.deleteMany({});
  });

  it('should get a balance for a token', async () => {
    const token = { id: '5' };
    const balance = await getBalance('1', token);
    expect(balance.getValue().toString()).toEqual('20');
  });

  it('should get a balance of zero a pouch that doesn\'t exist', async () => {
    const token = { id: '3' };
    const balance = await getBalance('1', token);
    expect(balance.getValue().toString()).toEqual('0');
  });
});