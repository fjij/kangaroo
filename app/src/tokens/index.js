import mongoose from 'mongoose';
const { Schema } = mongoose;

const tokenSchema = new Schema({
  ticker: {type: String, required: true}
});

tokenSchema.index({ ticker: 1 }, { unique: true });

export const Token = mongoose.model('token', tokenSchema);

export async function getAllTokens() {
  return await Token.find({}).exec();
}

export async function getTokenByTicker(ticker) {
  return await Token.findOne({ ticker }).exec();
}
