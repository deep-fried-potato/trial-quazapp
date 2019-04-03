const express = require('express');
const app = express();
const port = 8000;
let models = require("./models")
let bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(express.static('api/static'));


var quizRoutes = require("./api/quizRoutes")

app.use('/quiz', quizRoutes(models))
var AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController(models));

models.sequelize.sync().then(function () {
  app.listen(port, () => {
    console.log("App running on port: " + port)
  });
});
