import { ping } from './ping.js';
import { executeCommand } from '../commands/index.js';
import { BadInteractionTypeError } from './errors/BadInteractionTypeError.js';

export const InteractionType = {
  Ping: 1,
  ApplicationCommand: 2,
};

export async function handleInteraction(interaction) {
  switch (interaction.type) {
    case InteractionType.Ping: {
      return ping(interaction);
    }

    case InteractionType.ApplicationCommand: {
      return await executeCommand(interaction);
    }

    default: {
      throw new BadInteractionTypeError(`Unexpected interaction type ${interaction.type}`);
    }
  }
}

export function getUserId(interaction) {
  if (interaction?.user) {
    return interaction?.user?.id;
  } else {
    return interaction?.member?.user?.id;
  }
}
