import { ping } from './ping.js';
import { applicationCommand } from './applicationCommand.js';

const InteractionType = {
  Ping: 1,
  ApplicationCommand: 2,
};

export function registerRoutes(app) {
  app.post('/api/interactions', () => {
    const interaction = req.body;

    switch (interaction.type) {
      case InteractionType.Ping: {
        return ping(interaction);
      }

      case InteractionType.ApplicationCommand: {
        return applicationCommand(interaction);
      }
    }
  });
}
