// Template of Subsystem.
require("express");
var express = require('express');
var app = express();
var router = express.Router();
var path = require("path");
var mongoose = require("mongoose");

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

var setting = requireUncached("./setting");
var resendObj = {};
resendObj.status = 0;
resendObj.message = "Okie";

router.use(function(req, res, next) {
    setting = requireUncached("./setting");
    next();
});

function requireUncached(module) {
    delete require.cache[require.resolve(module)]
    return require(module)
};

//  Global variables for Business functions

var objResult = {};
objResult.status = 0
objResult.err = null;
objResult.return_id = null;

router.get('/', function(req, res, next) {

    // var shop = getFlatShopProducts('convit');
    // console.log('shop', shop);

    getFlatShopProducts(req.shopname, getFlatProduct);
    function getFlatProduct(err, shopInfo) {
        console.log(err);
        console.log(shopInfo);
        res.render('index', {
            title: 'Hello, this is template Application of : ' + req.shopname,
            data: setting,
            RSApublicKey: keyPair.public,
            shopInfo: shopInfo
        });
    }

});

router.post("/update", function(req, res, next) {

})


app.use(router);
module.exports = app;
