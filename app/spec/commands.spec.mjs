import { help } from '../src/commands/help.js';
import { balance } from '../src/commands/balance.js';
import { executeCommand, getOption } from '../src/commands/index.js';
import { embedResponse } from '../src/responses/index.js';
import mongoose from 'mongoose';
import { Pouch } from '../src/pouch/index.js';

describe('help', () => {
  it('should respond with help text', () => {
    const res = help({ type: 2 });
    expect(res).toEqual(embedResponse({
      title: 'Kangaroo Help',
      description: 'Hi there :)'
    }));
  });
});

describe('balance', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  describe('with balance', () => {
    beforeAll(async () => {
      const userId = '1234';
      await (new Pouch({ userId, ticker: 'ETH', balance: 0.2 })).save();
      await (new Pouch({ userId, ticker: 'DAI', balance: 30 })).save();
    });
    
    afterAll(async () => {
      await Pouch.deleteMany({});
    });


    it('should respond with a specific balance if ticker is provided', async () => {
      const interaction = {
        data: {
          options: [
            {
              name: 'ticker',
              value: 'ETH'
            }
          ]
        },
        member: { id: '1234' }
      };
      const res = await balance(interaction);
      expect(res).toEqual(embedResponse({
        title: 'ETH Balance',
        description: '0.2 ETH'
      }));
    });

    it('should respond with all balances if no options are provided', async () => {
      const interaction = { data: {}, member: { id: '1234' } };
      const res = await balance(interaction);
      expect(res).toEqual(embedResponse({
        title: 'All Balances',
        description: '0.2 ETH\n30 DAI\n0 DNT'
      }));
    });
  });

  describe('with no balance', () => {
    it('should show a no balance message if no options are provided', async () => {
      const interaction = { data: {}, member: { id: '1234' } };
      const res = await balance(interaction);
      expect(res).toEqual(embedResponse({
        title: 'All Balances',
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
        member: { id: '1234' }
      };
      const res = await balance(interaction);
      expect(res).toEqual(embedResponse({
        title: 'DAI Balance',
        description: '0 DAI'
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
      title: 'Kangaroo Help',
      description: 'Hi there :)'
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
