import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

let connected = false;

/**
 * Connect to MongoDB. Safe to call more than once (no-op if already connected).
 */
export async function connectDB(uri = env.mongoUri) {
  if (connected) return mongoose.connection;

  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('[db] connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    connected = false;
    // eslint-disable-next-line no-console
    console.warn('[db] disconnected');
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    autoIndex: true, // build indexes; fine for this app's data volume
  });

  connected = true;
  const { host, name } = mongoose.connection;
  // eslint-disable-next-line no-console
  console.log(`[db] connected to MongoDB "${name}" @ ${host}`);
  return mongoose.connection;
}

export async function disconnectDB() {
  if (!connected) return;
  await mongoose.disconnect();
  connected = false;
}

export default connectDB;
