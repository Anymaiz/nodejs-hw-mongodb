import mongoose from 'mongoose';
import { envVal } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
  try {
    const user = envVal('MONGODB_USER');
    const pwd = envVal('MONGODB_PASSWORD');
    const url = envVal('MONGODB_URL');
    const db = envVal('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );

    console.log('Mongo connection successfully established');
  } catch (error) {
    console.error('Error while setting up mongo connection:', error);
    throw error;
  }
};
