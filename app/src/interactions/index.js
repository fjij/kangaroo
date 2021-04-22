import { ping } from './ping.js';
import { executeCommand } from '../commands/index.js';
import { BadInteractionTypeError } from './errors/BadInteractionTypeError.js';
import { embedResponse } from '../responses/index.js';

export const InteractionType = {
  Ping: 1,
  ApplicationCommand: 2,
};

async function handleInteraction(interaction) {
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
  return interaction?.member?.id;
}

export function registerRoutes(app) {
  app.post('/api/interactions', async (req, res) => {
    const interaction = req.body;
    try {
      const response = await handleInteraction(interaction);
      res.send(response);
    } catch(error) {
      console.error(error);
      res.send(embedResponse({
        title: `Error: ${error.message}`,
        description: error.stack,
      }));
    };
  });
}
