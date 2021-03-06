import { UnknownCommandError } from './errors/UnknownCommandError.js';
import { help } from './help.js';
import { balance } from './balance.js';
import { listTokens } from './listTokens.js';
import { unlock } from './unlock.js';
import { deposit } from './deposit.js';
import { send } from './send.js';
import { withdraw } from './withdraw.js';

export function getOption(interaction, name) {
  const options = interaction.data.options;
  if (!options) {
    return undefined;
  }
  const option = options.filter(option => option.name === name)[0];
  if (!option) {
    return undefined;
  }
  return option.value;
}

export async function executeCommand(interaction) {
  const data = interaction.data;
  switch (data.name) {
    case 'help': {
      return help(interaction);
    }

    case 'balance': {
      return await balance(interaction);
    }

    case 'listtokens': {
      return await listTokens(interaction);
    }

    case 'unlock': {
      return await unlock(interaction);
    }

    case 'deposit': {
      return await deposit(interaction)
    }
      
    case 'send':
    case 'tip': {
      return await send(interaction);
    }

    case 'withdraw': {
      return await withdraw(interaction);
    }

    default: {
      throw new UnknownCommandError(`Unknown command: ${data.name}`);
    }
  }
}
