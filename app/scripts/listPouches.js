import { connect } from '../src/db/index.js';
import { Pouch } from '../src/pouch/index.js';

async function listPouches() {
  await connect();
  const pouches = await Pouch.find({}).exec();
  console.dir(pouches.map(pouch => ({
    id: pouch.id,
    userId: pouch.userId,
    tokenId: pouch.tokenId,
    balance: pouch.balance,
  })));
}

listPouches().then(() => {
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
