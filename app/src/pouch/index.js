import mongoose from 'mongoose';
import { Amount } from '../eth2/amount.js';
import { BigNumber } from 'ethers';
const { Schema } = mongoose;

const pouchSchema = new Schema({
  userId: {type: String, required: true},
  tokenId: {type: String, required: true},
  balance: {type: String, required: true}
});

pouchSchema.index({ userId: 1, tokenId: 1 }, { unique: true });

export const Pouch = mongoose.model('pouch', pouchSchema);

export async function getBalance(userId, token) {
  const pouch = await Pouch.findOne({ userId, tokenId: token.id }).exec();
  if (pouch) {
    return new Amount(token, BigNumber.from(pouch.balance));
  } else {
    return new Amount(token, BigNumber.from('0'));
  }
}
