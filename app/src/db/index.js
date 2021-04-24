import mongoose from 'mongoose';
import config from '../config/index.js';

export async function connect() {
  await mongoose.connect(config.mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
}