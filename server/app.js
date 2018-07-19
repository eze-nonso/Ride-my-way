import express from 'express';
import path from 'path';
import routesFunction from '../dbServer/routes/v1';

const urlParser = express.urlencoded({
  extended: true,
});

const jsonParser = express.json();

const app = express();

app.use(urlParser);
app.use(jsonParser);
app.use(express.static(path.resolve(__dirname, '../client')));

routesFunction(app);

app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    data: {
      message: 'Page not found',
    },
  });
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(500).send({
    status: error,
    data: {
      message: `Don't be alarmed...
      The server just crashed. I will fix it ASAP`,
    },
  });
});

export default app;
