import { connect } from '../src/db/index.js';
import { Token } from '../src/tokens/index.js';

async function clearTokens() {
  await connect();
  await Token.deleteMany({});
}

clearTokens().then(() => {
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
