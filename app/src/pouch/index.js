import mongoose from 'mongoose';
const { Schema } = mongoose;

const pouchSchema = new Schema({
  userId: {type: String, required: true},
  tokenId: {type: String, required: true},
  balance: {type: Number, required: true}
});

pouchSchema.index({ userId: 1, tokenId: 1 }, { unique: true });

export const Pouch = mongoose.model('pouch', pouchSchema);

export async function getBalance(userId, token) {
  const pouch = await Pouch.findOne({ userId, tokenId: token.id }).exec();
  if (pouch) {
    return pouch.balance;
  } else {
    return 0;
  }
}
