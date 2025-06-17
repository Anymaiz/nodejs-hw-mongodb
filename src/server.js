import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { envVal } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import contactsRouter from './routers/contacts.js';

const PORT = Number(envVal('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Your API is connected',
    });
  });

  app.use(contactsRouter);
  app.use(errorHandler);
  app.use(notFoundHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on  port  ${PORT}`);
  });
};

export default setupServer;
