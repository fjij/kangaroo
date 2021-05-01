import { help } from '../src/commands/help.js';
import { balance } from '../src/commands/balance.js';
import { executeCommand, getOption } from '../src/commands/index.js';
import { embedResponse } from '../src/responses/index.js';
import { connect } from '../src/db/index.js';
import { Pouch } from '../src/pouch/index.js';
import { Token } from '../src/tokens/index.js';
import * as eth2 from '../src/eth2/index.js';
import { Amount } from '../src/eth2/amount.js';

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
        value: "Tip other users, deposit and withdraw ETH and ERC-20 tokens from your Layer 2 wallet. "
      },
      {
        name: "Layer 2 Native 👏",
        value: "Tip other users, deposit and withdraw ETH and ERC-20 tokens from your Layer 2 wallet. \n "
      }
    ]
    }));
  });
});

describe('balance', () => {
  beforeAll(async () => {
    await connect();
    await eth2.init();
  });

  describe('with balance', () => {
    beforeAll(async () => {
      const tokenETH = await (new Token({ ticker: 'ETH' })).save();
      const tokenDAI = await (new Token({ ticker: 'DAI' })).save();
      await (new Token({ ticker: 'DNT' })).save();
      const userId = '1234';
      await (new Pouch({
        userId,
        tokenId: tokenETH.id,
        balance: Amount.fromStringValue({ ticker: 'ETH' }, '0.2').getValue().toString()
      })).save();
      await (new Pouch({
        userId,
        tokenId: tokenDAI.id,
        balance: Amount.fromStringValue({ ticker: 'DAI' }, '30').getValue().toString()
      })).save();
    });
    
    afterAll(async () => {
      await Pouch.deleteMany({});
      await Token.deleteMany({});
    });

    it('should respond with a specific balance if ticker is provided', async () => {
      const interaction = {
        data: { options: [ { name: 'ticker', value: 'ETH' } ] },
        user: { id: '1234' }
      };
      const res = await balance(interaction);
      expect(res).toEqual(embedResponse({
        title: 'ETH Balance',
        color: 13370886,
        description: '0.2 ETH'
      }));
    });

    it('should respond with a specific balance if ticker is provided case-insensitive', async () => {
      const interaction = {
        data: { options: [ { name: 'ticker', value: 'dai' } ] },
        user: { id: '1234' }
      };
      const res = await balance(interaction);
      expect(res).toEqual(embedResponse({
        title: 'DAI Balance',
        color: 13370886,
        description: '30.0 DAI'
      }));
    });

    it('should respond with all balances if no options are provided', async () => {
      const interaction = { data: {}, user: { id: '1234' } };
      const res = await balance(interaction);
      expect(res).toEqual(embedResponse({
        title: 'All Balances',
        color: 13370886,
        description: '0.2 ETH\n30.0 DAI'
      }));
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
      await (new Token({ ticker: 'ETH' })).save();
      await (new Token({ ticker: 'DAI' })).save();
      await (new Token({ ticker: 'DNT' })).save();
    });

    afterAll(async () => {
      await Pouch.deleteMany({});
      await Token.deleteMany({});
    });
    it('should show a no balance message if no options are provided', async () => {
      const interaction = { data: {}, user: { id: '1234' } };
      const res = await balance(interaction);
      expect(res).toEqual(embedResponse({
        title: 'All Balances',
        color: 13370886,
        description: 'You don\'t have any tokens :('
      }));
    });

    it('should show a zero balance if no ticker is provided', async () => {
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
      expect(res).toEqual(embedResponse({
        title: 'DAI Balance',
        color: 13370886,
        description: '0.0 DAI'
      }));
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
          value: "Tip other users, deposit and withdraw ETH and ERC-20 tokens from your Layer 2 wallet. "
        },
        {
          name: "Layer 2 Native 👏",
          value: "Tip other users, deposit and withdraw ETH and ERC-20 tokens from your Layer 2 wallet. \n "
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
