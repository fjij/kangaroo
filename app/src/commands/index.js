import { UnknownCommandError } from './errors/UnknownCommandError.js';
import { help } from './help.js';

export function executeCommand(interaction) {
  const data = interaction.data;
  switch (data.name) {
    case 'help': {
      return help(interaction);
    }

    default: {
      throw new UnknownCommandError(`Unknown command: ${data.name}`);
    }
  }
}
