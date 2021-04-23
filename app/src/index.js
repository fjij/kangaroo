import express from 'express';
import { connect } from './db/index.js';
import { parser, security } from './middleware/index.js';
import { handleInteraction } from './interactions/index.js';

const app = express();

function registerApiRoute(app) {
  if (process.env.USE_SECURITY === 'true') {
    app.use(process.env.INTERACTIONS_ENDPOINT, security);
  }
  app.post(process.env.INTERACTIONS_ENDPOINT, async (req, res) => {
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
  app.listen(process.env.PORT, () => {
    console.log(`App listening at http://localhost:${process.env.PORT}`);
  });
}

start();
