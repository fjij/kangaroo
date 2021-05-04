import { help } from '../src/commands/help.js';
import { balance } from '../src/commands/balance.js';
import { executeCommand, getOption } from '../src/commands/index.js';
import { embedResponse } from '../src/responses/index.js';
import { connect } from '../src/db/index.js';
import { User } from '../src/user/index.js';
import { Token } from '../src/tokens/index.js';
import * as eth2 from '../src/eth2/index.js';
import { Amount } from '../src/eth2/amount.js';
import { Wallet } from '../src/eth2/wallet.js';
import { listTokens } from '../src/commands/listTokens.js';

describe('help', () => {
  it('should respond with help text', () => {
    const res = help({ type: 2 });
    expect(res).toEqual(embedResponse({
      title: 'Introduction to Kangaroo 🦘',
      "color": 15422875,
      fields: [
        {
          name: "What is It? ⁉️",
          value: "Kangaroo is a crypto tipping bot built with Layer 2 onboarding in mind. It supports Ethereum and a range of ERC-20 tokens."
        },
        {
          name: "Frictionless withdrawals 💸",
          value: "Typical Ethereum token transactions can have fees upwards of $20. Harness the power of Layer 2 and withdraw your funds for nearly 100 times less."
        },
        {
          name: "Grow your community 👥",
          value: "Engage your discord server with a plethora community oriented features. Better yet, give crypto funds that your community members can actually use."
        },
        {
          name: "The Basics 📘",
          value: "Tip other users, deposit and withdraw ETH and ERC-20 tokens to your Layer 2 wallet. "
        },
        {
          name: "Layer 2 Native 👏",
          value: "Kangaroo lives on Layer 2 Ethereum. No slow or expensive user experience."
        }
      ]
    }));
  });
});

describe('balance', () => {
  const PRIVATE_KEY = process.env.TEST_PRIVATE_KEY;

  beforeAll(async () => {
    if (!PRIVATE_KEY) {
      throw new Error(
        'You must provide an account in the TEST_PRIVATE_KEY environment variable'
      );
    }
    await connect();
    await eth2.init();
  });

  describe('with balance', () => {
    let balanceETH, balanceDAI;
    beforeAll(async () => {
      await (new Token({ ticker: 'ETH', name: 'Ethereum' })).save();
      await (new Token({ ticker: 'DAI', name: 'Dai'})).save();
      await (new Token({ ticker: 'USDT', name: 'USDT' })).save();
      const userId = '1234';
      await new User({ userId, privateKey: PRIVATE_KEY }).save();
      const wallet = await Wallet.create(PRIVATE_KEY);
      balanceETH = (await wallet.getBalance({ ticker: 'ETH' })).getStringValue();
      balanceDAI = (await wallet.getBalance({ ticker: 'DAI' })).getStringValue();
    });
    
    afterAll(async () => {
      await User.deleteMany({});
      await Token.deleteMany({});
    });

    it('should respond with a specific balance if ticker is provided', async () => {
      const interaction = {
        data: { options: [ { name: 'ticker', value: 'ETH' } ] },
        user: { id: '1234' }
      };
      const res = await balance(interaction);
      const description = res.data.embeds[0].description;
      expect(res).toEqual(embedResponse({
        title: 'ETH Balance',
        color: 15422875,
        description
      }));
      const [value, ticker, , price] = description.split(' ');
      expect(value).toEqual(balanceETH);
      expect(ticker).toEqual('ETH');
      expect(price[0]).toEqual('$');
      expect(parseFloat(price.slice(1))).toBeGreaterThan(0);
    });

    it('should respond with a specific balance if ticker is provided case-insensitive', async () => {
      const interaction = {
        data: { options: [ { name: 'ticker', value: 'dai' } ] },
        user: { id: '1234' }
      };
      const res = await balance(interaction);
      const description = res.data.embeds[0].description;
      expect(res).toEqual(embedResponse({
        title: 'DAI Balance',
        color: 15422875,
        description
      }));
      const [value, ticker, , price] = description.split(' ');
      expect(value).toEqual(balanceDAI);
      expect(ticker).toEqual('DAI');
      expect(price[0]).toEqual('$');
      expect(parseFloat(price.slice(1))).toBeGreaterThan(0);
    });

    it('should respond with all balances if no options are provided', async () => {
      const interaction = { data: {}, user: { id: '1234' } };
      const res = await balance(interaction);
      const description = res.data.embeds[0].description;
      expect(res).toEqual(embedResponse({
        title: 'All Balances',
        color: 15422875,
        description
      }));
      const [ETHscription, DAIscription] = description.split('\n');
      {
        const [value, ticker, , price] = ETHscription.split(' ');
        expect(value).toEqual(balanceETH);
        expect(ticker).toEqual('ETH');
        expect(price[0]).toEqual('$');
        expect(parseFloat(price.slice(1))).toBeGreaterThan(0);
      }
      {
        const [value, ticker, , price] = DAIscription.split(' ');
        expect(value).toEqual(balanceDAI);
        expect(ticker).toEqual('DAI');
        expect(price[0]).toEqual('$');
        expect(parseFloat(price.slice(1))).toBeGreaterThan(0);
      }
    });

    it('should respond with an error message if an invalid ticker is provided', async () => {
      const interaction = {
        data: { options: [ { name: 'ticker', value: 'DOGE' } ] },
        user: { id: '1234' }
      };
      const res = await balance(interaction);
      expect(res).toEqual(embedResponse({
        title: 'Error',
        color: 13370886,
        description: 'That token doesn\'t exist :('
      }));
    });
  });

  describe('with no balance', () => {
    beforeAll(async () => {
      await (new Token({ ticker: 'ETH', name: 'Ethereum' })).save();
      await (new Token({ ticker: 'DAI', name: 'Dai'})).save();
      await (new Token({ ticker: 'BAT', name: 'Basic Attention Token' })).save();
    });

    afterAll(async () => {
      await Token.deleteMany({});
      await User.deleteMany({});
    });
    it('should show a no balance message if no options are provided', async () => {
      const interaction = { data: {}, user: { id: '1234' } };
      const res = await balance(interaction);
      expect(res).toEqual(embedResponse({
        title: 'All Balances',
        color: 15422875,
        description: 'You don\'t have any tokens :('
      }));
    });

    it('should show a zero balance if a ticker is provided', async () => {
      const interaction = {
        data: {
          options: [
            {
              name: 'ticker',
              value: 'DAI'
            }
          ]
        },
        user: { id: '1234' }
      };
      const res = await balance(interaction);
      const description = res.data.embeds[0].description;
      expect(res).toEqual(embedResponse({
        title: 'DAI Balance',
        color: 15422875,
        description
      }));
      const [value, ticker, , price] = description.split(' ');
      expect(value).toEqual('0.0');
      expect(ticker).toEqual('DAI');
      expect(price).toEqual('$0.00');
    });
  });
});

describe('execute command', () => {
  it('should select function based on command', async () => {
    const interaction = {
      type: 2,
      data: {
        name: 'help'
      }
    };
    const res = await executeCommand(interaction);
    expect(res).toEqual(embedResponse({
      title: 'Introduction to Kangaroo 🦘',
      "color": 15422875,
      fields: [
        {
          name: "What is It? ⁉️",
          value: "Kangaroo is a crypto tipping bot built with Layer 2 onboarding in mind. It supports Ethereum and a range of ERC-20 tokens."
        },
        {
          name: "Frictionless withdrawals 💸",
          value: "Typical Ethereum token transactions can have fees upwards of $20. Harness the power of Layer 2 and withdraw your funds for nearly 100 times less."
        },
        {
          name: "Grow your community 👥",
          value: "Engage your discord server with a plethora community oriented features. Better yet, give crypto funds that your community members can actually use."
        },
        {
          name: "The Basics 📘",
          value: "Tip other users, deposit and withdraw ETH and ERC-20 tokens to your Layer 2 wallet. "
        },
        {
          name: "Layer 2 Native 👏",
          value: "Kangaroo lives on Layer 2 Ethereum. No slow or expensive user experience."
        }
      ]
    }));
  });
});

describe('getOption', () => {
  it('should return the value of an option', () => {
    const interaction = {
      data: {
        options: [
          { name: 'jkl', value: 'pio', },
          { name: 'abc', value: 'def', }
        ]
      }
    };
    const value = getOption(interaction, 'abc');
    expect(value).toEqual('def');
  });

  it('should return undefined if the option is not there', () => {
    const interaction = {
      data: {
        options: [
          { name: 'jkl', value: 'pio', },
          { name: 'abc', value: 'def', }
        ]
      }
    };
    const value = getOption(interaction, 'not here');
    expect(value).toBeUndefined();
  });

  it('should return undefined if there are no options', () => {
    const interaction = { data: {} };
    const value = getOption(interaction, 'abc');
    expect(value).toBeUndefined();
  });
});

describe('list all tokens', () => {

  beforeAll(async () => {
    await connect();
    await (new Token({ ticker: 'ETH', name: 'Ethereum' })).save();
    await (new Token({ ticker: 'DAI', name: 'Dai'})).save();
    await (new Token({ ticker: 'BAT', name: 'Basic Attention Token' })).save();
  });

  afterAll(async () => {
    await Token.deleteMany({});
  });

  it('should respond with all tokens', async () => {
    const res = await(listTokens)({ type: 2 });
    expect(res).toEqual(embedResponse({
      title: 'All Supported Tokens📖',
      "color": 15422875,
      description: 'ETH | Ethereum\nDAI | Dai\nBAT | Basic Attention Token'
    }));
  });
});
