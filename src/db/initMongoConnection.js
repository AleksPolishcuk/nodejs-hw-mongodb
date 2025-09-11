import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
    try {
        const user =getEnvVar('MONGO_USER');
        const pwd = getEnvVar('MONGO_PASSWORD');
        const url = getEnvVar('MONGO_URL');
        const db = getEnvVar('MONGO_DB');

        await mongoose.connect( `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`);

      console.log('Mongo connection successfully established!');
    } catch (e) {
      console.log('Error while setting up mongo connection', e);
      throw e;
    }
  };