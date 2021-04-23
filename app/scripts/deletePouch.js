import { connect } from '../src/db/index.js';
import { Pouch } from '../src/pouch/index.js';

async function deletePouch(userId, tokenId) {
  await connect();
  await Pouch.deleteMany({ userId, tokenId });
}

const userId = process.argv[2];
const tokenId = process.argv[3];
if (userId && tokenId) {
  deletePouch(userId, tokenId).then(() => {
    process.exit(0);
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
} else {
  console.error('Must provide arguments: userId tokenId');
  process.exit(1);
}
