import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { UPLOAD_DIR } from './constants/index.js';

const PORT = Number(getEnvVar('PORT'));

export const setupServer = () => {
  const app = express();

  app.use(pino());

  app.use(cors());
  app.use(cookieParser());

  app.use(express.json());

  app.use(router);
  app.use('/', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  app.use('/uploads', express.static(UPLOAD_DIR));
};
