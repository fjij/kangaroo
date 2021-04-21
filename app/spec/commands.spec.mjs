import { help } from '../src/commands/help.js';
import { executeCommand } from '../src/commands/index.js';

describe('help', () => {
  const helpRes = {
    type: 4,
    data: {
      tts: false,
      content: "",
      embeds: [
        {
          title: 'Kangaroo Help',
          description: 'Hi there :)'
        }
      ],
      allowed_mentions: {
        parse: []
      }
    }
  };

  it('should respond with help text', () => {
    const res = help({ type: 2 });
    expect(res).toEqual(helpRes);
  });
});

describe('execute command', () => {
  it('should select function based on command', () => {
    const interaction = {
      type: 2,
      data: {
        name: 'help'
      }
    };

    const helpRes = help(interaction);
    const executeRes = help(interaction);
    expect(executeRes).toEqual(helpRes);
  });
});
