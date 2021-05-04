import { connect } from '../src/db/index.js';
import { User } from '../src/user/index.js';

async function deleteUser(userId) {
  await connect();
  await User.deleteMany({ userId });
}

const userId = process.argv[2];
if (userId) {
  deleteUser(userId).then(() => {
    process.exit(0);
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
} else {
  console.error('Must provide arguments: userId');
  process.exit(1);
}
