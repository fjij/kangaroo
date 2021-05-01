import { connect } from '../src/db/index.js';
import { Token } from '../src/tokens/index.js';

async function createToken(ticker) {
  await connect();
  const token = await (new Token({ ticker, name })).save();
  console.dir({
    id: token.id,
    ticker: token.ticker
  });
}

const ticker = process.argv[2];
if (ticker) {
  createToken(ticker).then(() => {
    process.exit(0);
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
} else {
  console.error('No ticker provided');
  process.exit(1);
}
