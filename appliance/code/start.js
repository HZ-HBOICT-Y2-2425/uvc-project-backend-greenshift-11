// start.js setup from learnnode.com by Wes Bos
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });
import indexRouter from './routes/index.js';

const app = express();

// support json encoded and url-encoded bodies, mainly used for post and update
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.set('port', process.env.PORT || 3012);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});
let count = 0;

app.get('/api', (req, res) => {
res.json({count})
})

app.post('/api', (req, res) => {
++count;
res.json({count});
});

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})