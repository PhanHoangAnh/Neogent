// Template of Subsystem.
require("express");
var express = require('express');
var app = express();
var router = express.Router();
var path = require("path");

// console.log("app.settings ", app.get('views'), app.get('view engine'));
// Do not remove this command during develoment mode
// app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));

router.get("/collections", function(req, res, next) {
    // req.collectionId = req.params.id;
    // getCollections(req, res, next);
    res.sendStatus(200);
})

router.get("/collections/:id", function(req, res, next) {
    req.collectionId = req.params.id;
    getCollections(req, res, next);
})

router.get("/", getBasicShopInfo);

app.getCoreApp = function() {
    return this;
}
app.getCoreRouter = function() {
    return router
}

app.use(router);
module.exports = app;
