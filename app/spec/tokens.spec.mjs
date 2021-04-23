import { Token, getAllTokens, getTokenByTicker } from '../src/tokens/index.js';
import { connect } from '../src/db/index.js';

describe('getAllTokens', () => {
  beforeAll(async () => {
    await connect();
  });

  it('should get all tokens', async () => {
    await (new Token({ ticker: 'ETH' })).save();
    await (new Token({ ticker: 'DAI' })).save();

    const tokens = await getAllTokens();
    expect(tokens.length).toEqual(2);
    tokens.forEach(token => {
      expect(token.id).toBeDefined();
      expect(token.ticker).toBeDefined();
    });

    const tickers = tokens.map(token => token.ticker);
    expect(tickers).toContain('ETH');
    expect(tickers).toContain('DAI');

    await Token.deleteMany({});
  });
});

describe('getTokenByTicker', () => {
  let DAIid;

  beforeAll(async () => {
    await connect();
    await (new Token({ ticker: 'ETH' })).save();
    const DAI = await (new Token({ ticker: 'DAI' })).save();
    DAIid = DAI.id;
  });

  afterAll(async () => {
    await Token.deleteMany({});
  });

  it('should get a token by ticker', async () => {
    const token = await getTokenByTicker('DAI');
    expect(token.ticker).toEqual('DAI');
    expect(token.id).toEqual(DAIid);
  });

  it('should return undefined for a non-existent ticker', async () => {
    const token = await getTokenByTicker('DOGE');
    expect(token).toBeNull();
  });
});
