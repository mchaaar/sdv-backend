import express from 'express';
import { userRouter } from './controllers/userController.js';
import { articleRouter } from './controllers/articleController.js';
import { requestLogger, devLogger } from './services/loggerService.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const app = express();
const port = 3000;

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const mongoUrl =
  process.env.MONGO_URL_LEFT! +
  process.env.MONGO_USERNAME! +
  ':' +
  process.env.MONGO_PASSWORD! +
  process.env.MONGO_URL_RIGHT!
;

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(() => {
    console.log('MongoDB connection failed!');
  })
;

app.use(express.json());
app.use(devLogger);
app.use(requestLogger);

app.use('/users', userRouter);
app.use('/articles', articleRouter);