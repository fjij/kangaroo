import { connect } from '../src/db/index.js';
import { Pouch } from '../src/pouch/index.js';

async function clearPouches() {
  await connect();
  await Pouch.deleteMany({});
}

clearPouches().then(() => {
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
