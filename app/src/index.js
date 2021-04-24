import express from 'express';
import { connect } from './db/index.js';
import { parser, security } from './middleware/index.js';
import { handleInteraction } from './interactions/index.js';
import config from './config/index.js';

const app = express();

function registerApiRoute(app) {
  if (config.use_security === 'true') {
    app.use(config.interact_endpoint, security);
  }
  app.post(config.interact_endpoint, async (req, res) => {
    const interaction = req.body;
    try {
      const response = await handleInteraction(interaction);
      res.send(response);
    } catch(error) {
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
  await connect();
  app.listen(config.port, () => {
    console.log(`App listening at http://localhost:${config.port}`);
  });
}

start();
