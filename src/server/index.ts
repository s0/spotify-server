import express from 'express';

import { getConfig } from './config';

const app = express();
const port = 3000;

async function start() {
  const config = await getConfig();

  console.log(config);

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

start();