const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./server/routes.js');
require('dotenv').config();

const port = process.env.PORT || 1234;
const app = express();

app.use(bodyParser.json());


routes(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log('listening on port', port));