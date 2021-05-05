import express from 'express';
import * as db from './db/index.js';
import * as eth2 from './eth2/index.js';
import { parser, security } from './middleware/index.js';
import { handleInteraction } from './interactions/index.js';
import { deferredResponse } from './responses/index.js';
import { editInteractionResponse } from './discord/index.js';
import config from './config/index.js';

const app = express();

function registerApiRoute(app) {
  if (config.useSecurity === 'true') {
    app.use(config.interactEndpoint, security);
  }
  app.post(config.interactEndpoint, async (req, res) => {
    const interaction = req.body;
    try {
      res.send(deferredResponse());
      const response = await handleInteraction(interaction);
      console.log('Response:');
      console.log(JSON.stringify(response, null, 2));
      await editInteractionResponse(interaction, response);
    } catch(error) {
      console.log('Interaction:');
      console.log(JSON.stringify(interaction, null, 2));
      console.error(error);
      res.send({ type: 4, data: {
        content: `Error: ${error.message}`
      }});
    };
  });
}

async function start() {
  app.use(parser);
  registerApiRoute(app);
  await db.connect();
  await eth2.init();
  app.listen(config.port, () => {
    console.log(`App listening at http://localhost:${config.port}`);
  });
}

start();
