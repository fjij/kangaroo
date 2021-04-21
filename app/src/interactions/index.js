import { ping } from './ping.js';
import { executeCommand } from '../commands/index.js';
import { BadInteractionTypeError } from './errors/BadInteractionTypeError.js';
import { embedResponse } from '../responses/index.js';

export const InteractionType = {
  Ping: 1,
  ApplicationCommand: 2,
};

function handleInteraction(interaction) {
  switch (interaction.type) {
    case InteractionType.Ping: {
      return ping(interaction);
    }

    case InteractionType.ApplicationCommand: {
      return executeCommand(interaction);
    }

    default: {
      throw new BadInteractionTypeError(`Unexpected interaction type ${interaction.type}`);
    }
  }
}

export function registerRoutes(app) {
  app.post('/api/interactions', (req, res) => {
    const interaction = req.body;
    try {
      res.send(handleInteraction(interaction));
    } catch(error) {
      console.error(error);
      res.send(embedResponse({
        title: `Error: ${error.message}`,
        description: error.stack,
      }));
    };
  });
}
