import { connect } from '../src/db/index.js';
import { User } from '../src/user/index.js';

async function listUsers() {
  await connect();
  const users = await User.find({}).exec();
  console.dir(users.map(user => ({
    userId: user.userId,
    privateKey: user.privateKey,
  })));
}

listUsers().then(() => {
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
