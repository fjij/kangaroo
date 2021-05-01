import { connect } from '../src/db/index.js';
import { getAllTokens } from '../src/tokens/index.js';

async function listTokens() {
  await connect();
  const tokens = await getAllTokens();
  console.dir(tokens.map(token => ({
    id: token.id,
    ticker: token.ticker,
    name: token.name
  })));
}

listTokens().then(() => {
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
