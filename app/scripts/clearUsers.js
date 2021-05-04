import { connect } from '../src/db/index.js';
import { User } from '../src/user/index.js';

async function clearUsers() {
  await connect();
  await User.deleteMany({});
}

clearUsers().then(() => {
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
