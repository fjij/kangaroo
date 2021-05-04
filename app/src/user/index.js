import mongoose from 'mongoose';
import { Wallet } from '../eth2/wallet.js';
const { Schema } = mongoose;

const userSchema = new Schema({
  userId: {type: String, required: true},
  privateKey: {type: String, required: true},
});

userSchema.index({ userId: 1 }, { unique: true });

export const User = mongoose.model('user', userSchema);

export async function getOrCreateWallet(userId) {
  const user = await User.findOne({ userId }).exec();
  if (user) {
    return await Wallet.create(user.privateKey);
  } else {
    const wallet = await Wallet.create();
    await new User({ userId, privateKey: wallet.getPrivateKey()}).save();
    return wallet;
    // TODO: DM user to tell them when a wallet has been created for them
  }
}
