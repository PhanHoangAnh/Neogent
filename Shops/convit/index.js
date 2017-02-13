// Template of Subsystem.
require("express");
var express = require('express');
var app = express();
var router = express.Router();
var path = require("path");

console.log("app.settings ", app.get('views'), app.get('view engine'));
// Do not remove this command during develoment mode
// app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

router.get('/', getBasicShopInfo);
//


app.use(router);
module.exports = app;
