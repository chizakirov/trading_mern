const express = require("express");
const bodyParser = require('body-parser');
const routes = require('./server/routes.js'); 
require("dotenv").config();
const port = process.env.PORT || 1234;
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + './server'));
app.use(express.static( __dirname + '/client/public' ));


routes(app);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(port, () => console.log("listening on port", port));