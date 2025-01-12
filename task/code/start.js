// start.js setup from learnnode.com by Wes Bos
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors'; // Import CORS middleware

dotenv.config({ path: 'variables.env' });

import tasksRouter from '../../task/code/routes/tasks.js';


const app = express();

// Enable CORS for all routes
app.use(cors());

// Support JSON encoded and URL-encoded bodies, mainly used for POST and update
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api', tasksRouter);

app.set('port', process.env.PORT || 3013);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});
