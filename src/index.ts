import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import 'express-async-errors';
import { NotFoundError } from './errors/not-found-error';
import { errorMiddleware } from './middlewares/error-middleware';
import { authRoutes } from './routes/routes';
dotenv.config();

const app = express();
app.use(express.json());

app.use('/ws-api', authRoutes);
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorMiddleware);

mongoose.connect(process.env.MONGO_URI!, () => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT, () =>
    console.log(`Server started on port ${process.env.PORT}`)
  );
});
