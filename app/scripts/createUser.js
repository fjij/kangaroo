import { connect } from '../src/db/index.js';
import { User } from '../src/user/index.js';
import * as eth2 from '../src/eth2/index.js';
import { Wallet } from '../src/eth2/wallet.js';

async function createUser(userId, privateKey) {
  await connect();
  await eth2.init();

  await Wallet.create(privateKey);

  const user = await (new User({
    userId,
    privateKey,
  })).save();

  console.dir({
    userId: user.userId,
    privateKey: user.privateKey,
  });
}

const userId = process.argv[2];
const privateKey = process.argv[3];
if (userId && privateKey) {
  createUser(userId, privateKey).then(() => {
    process.exit(0);
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
} else {
  console.error('Must provide arguments: userId privateKey');
  process.exit(1);
}
