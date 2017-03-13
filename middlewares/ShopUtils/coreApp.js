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
});

router.get("/collections/:id", function(req, res, next) {
    req.collectionId = req.params.id;
    getCollections(req, res, next, 'collection');
});

router.get("/categories/:id", function (req,res,next){
	req.categoryId = req.params.id;
    getCategory(req, res, next, 'category');
});

router.get("/brands/:id", function (req,res,next){
    req.categoryId = req.params.id;
    getCategory(req, res, next, 'brand');
});
    	

router.get("/", function(req, res, next) {
    getBasicShopInfo(req, res, next, 'index')
});

app.setTemplateMapper = function(mapArrays) {
    console.log("mapArrays: ", mapArrays);
}

app.use(router);
module.exports = app;
