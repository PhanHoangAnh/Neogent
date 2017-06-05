// Template of Subsystem.
require("express");
var express = require('express');
var app = express();
var router = express.Router();
var path = require("path");

// Do not remove this command during develoment mode
// app.set('views', path.join(__dirname, 'views'))

// console.log("check views directory: ", app.locals.setting.views)

app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));

router.get("/collections", function (req, res, next) {
    // req.collectionId = req.params.id;
    // getCollections(req, res, next);
    // res.sendStatus(200);
    res.send("Under construction");
    res.end();
});

router.get("/collections/:id", function (req, res, next) {
    req.collectionId = req.params.id;
    getCollections(req, res, next, 'collection');
});

router.get("/categories/:id", function (req, res, next) {
    req.categoryId = req.params.id;
    getCategory(req, res, next, 'category');
});

router.get("/brands/:id", function (req, res, next) {
    req.brandId = req.params.id;
    getBrandName(req, res, next, 'brand');
});

router.get('/listAtts', function (req, res, next) {
    console.log('ShopName: ', req.shopname);
    // listingAllProductAttributes(req.shopname, printOut);
    // function printOut(err, result){
    console.log("here: ............... ");
    var sendObj = {};
    sendObj.info = "listAtts"
    res.send(sendObj);
    res.end();
    // }
})


router.get("/", function (req, res, next) {
    getBasicShopInfo(req, res, next, 'index')
});



// app.setTemplateMapper = function(mapArrays) {
//     console.log("mapArrays: ", mapArrays);
// }

app.use(router);
module.exports = app;