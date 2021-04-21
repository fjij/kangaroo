import express from 'express';
import './db/index.js';
import { parser, security } from './middleware/index.js';
import { registerRoutes } from './interactions/index.js';
const app = express();

app.use(parser);

if (process.env.USE_SECURITY === 'true') {
  app.use(security);
}

registerRoutes(app);

app.listen(process.env.PORT, () => {
  console.log(`App listening at http://localhost:${process.env.PORT}`);
});
