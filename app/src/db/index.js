import mongoose from 'mongoose';
import config from '../config/index.js';

export async function connect() {
  await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
}