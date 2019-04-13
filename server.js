const express = require("express");
const bodyParser = require('body-parser');
const routes = require('./server/routes.js'); 
const path = require('path');
require("dotenv").config();
const port = process.env.PORT || 1234;
const app = express();

app.use(bodyParser.json());
// app.use(express.static(__dirname + './server'));
// app.use(express.static( __dirname + '/client/public' ));

if(process.env.NODE_ENV === "production"){
  app.use(express.static("client/build"));
  // app.use(express.static( __dirname + 'client/build' ));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(_dirname, 'client', 'build', 'index.html'));
  });
};

routes(app);

app.listen(port, () => console.log("listening on port", port));