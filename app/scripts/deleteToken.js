import { connect } from '../src/db/index.js';
import { Token } from '../src/tokens/index.js';

async function deleteToken(ticker) {
  await connect();
  await Token.deleteMany({ ticker });
}

const ticker = process.argv[2];
if (ticker) {
  deleteToken(ticker).then(() => {
    process.exit(0);
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
} else {
  console.error('No ticker provided');
  process.exit(1);
}
