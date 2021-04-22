import mongoose from 'mongoose';
const { Schema } = mongoose;

const pouchSchema = new Schema({
  userId: {type: String, required: true},
  ticker: {type: String, required: true},
  balance: {type: Number, required: true}
});

export const Pouch = mongoose.model('pouch', pouchSchema);

export async function getBalance(userId, ticker) {
  const pouch = await Pouch.findOne({ userId, ticker }).exec();
  if (pouch) {
    return pouch.balance;
  } else {
    return 0;
  }
}

export async function getTickers() {
  return [ 'ETH', 'DAI', 'DNT' ];
}
