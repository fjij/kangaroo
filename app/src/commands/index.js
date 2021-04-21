import { UnknownCommandError } from './errors/UnknownCommandError.js';
import { help } from './help.js';
import { balance } from './balance.js';

export function executeCommand(interaction) {
  const data = interaction.data;
  switch (data.name) {
    case 'help': {
      return help(interaction);
    }

    case 'balance': {
      return balance(interaction);
    }

    default: {
      throw new UnknownCommandError(`Unknown command: ${data.name}`);
    }
  }
}
