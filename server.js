const express = require('express');
const app = express();
const port = 8000;
var models = require("./models")
var routes = require("./app/routes.js")
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.use(express.static('app/static'));

routes(app,models);

models.sequelize.sync().then(function(){
  app.listen(port, ()=>{
    console.log("App running on port: " + port)
  });
});
