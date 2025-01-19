// start.js setup from learnnode.com by Wes Bos
import express from 'express';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken'; // Replace require with import
import indexRouter from './routes/index.js';
import { authenticateToken } from './middleware/exampleMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';

dotenv.config({ path: 'variables.env' });

const app = express();

// support json encoded and url-encoded bodies, mainly used for post and update
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors());
app.use('/', indexRouter);

app.set('port', process.env.PORT || 3010);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});

app.use('/auth', authRoutes);
