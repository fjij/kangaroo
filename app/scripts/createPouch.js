import { connect } from '../src/db/index.js';
import { getTokenByTicker } from '../src/tokens/index.js';
import { Pouch } from '../src/pouch/index.js';
import * as eth2 from '../src/eth2/index.js';
import { Amount } from '../src/eth2/amount.js';

async function createPouch(userId, ticker, value) {
  await connect();
  await eth2.init();
  const token = await getTokenByTicker(ticker);
  const amount = Amount.fromStringValue(token, value);

  const pouch = await (new Pouch({
    userId,
    tokenId: token.id,
    balance: amount.getValue().toString()
  })).save();

  console.dir({
    id: pouch.id,
    userId: pouch.userId,
    tokenId: pouch.tokenId,
    balance: pouch.balance,
  });
}

const userId = process.argv[2];
const ticker = process.argv[3];
const amount = process.argv[4];
if (userId && ticker && amount) {
  createPouch(userId, ticker, amount).then(() => {
    process.exit(0);
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
} else {
  console.error('Must provide arguments: userId ticker amount');
  process.exit(1);
}
