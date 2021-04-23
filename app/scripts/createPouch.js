import { connect } from '../src/db/index.js';
import { Pouch } from '../src/pouch/index.js';

async function createPouch(userId, tokenId, balance) {
  await connect();
  const pouch = await (new Pouch({ userId, tokenId, balance })).save();
  console.dir({
    id: pouch.id,
    userId: pouch.userId,
    tokenId: pouch.tokenId,
    balance: pouch.balance,
  });
}

const userId = process.argv[2];
const tokenId = process.argv[3];
const balance = process.argv[4];
if (userId && tokenId && balance) {
  createPouch(userId, tokenId, balance).then(() => {
    process.exit(0);
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
} else {
  console.error('Must provide arguments: userId tokenId balance');
  process.exit(1);
}
