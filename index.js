const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const env = require("./config/env");
const twitterRouter = require("./app/routes/twitterRoutes");

const app = express();

app.disable("x-powered-by");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/twitter", twitterRouter);

app.listen(env.port, () => {
  console.log(`Servidor de aplicación corriendo en el puerto ${env.port}`);
});
