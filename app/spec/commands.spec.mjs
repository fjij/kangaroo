import { help } from '../src/commands/help.js';
import { executeCommand } from '../src/commands/index.js';
import { embedResponse } from '../src/responses/index.js';

describe('help', () => {
  it('should respond with help text', () => {
    const res = help({ type: 2 });
    expect(res).toEqual(embedResponse({
      title: 'Kangaroo Help',
      description: 'Hi there :)'
    }));
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

    const res = executeCommand(interaction);
    expect(res).toEqual(embedResponse({
      title: 'Kangaroo Help',
      description: 'Hi there :)'
    }));
  });
});
