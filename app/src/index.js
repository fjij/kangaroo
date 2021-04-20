import express from 'express';
import { parser, security } from './middleware/index.js';
const app = express();

app.use(parser);

if (process.env.USE_SECURITY === 'true') {
  app.use(security);
}

// PING
app.post('/', (req, res) => {
  if (req.body.type === 1) {
    res.send({ type: 1 });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`App listening at http://localhost:${process.env.PORT}`);
});
