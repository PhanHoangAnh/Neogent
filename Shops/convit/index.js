// Template of Subsystem.
require("express");
var express = require('express');
var app = express();
var router = express.Router();
var path = require("path");

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

router.get('/', function(req, res, next) {
    // res.send("hello, this is template Application");
    // console.log("-----Hahaha from template");
    // res.render('index', { title: 'Hello, this is template Application of : ' + req.shopname });

    getFlatShopProducts(req.shopname, getFlatProduct);

    function getFlatProduct(err, shopInfo) {
        var collections = shopInfo.collections.filter(function(item) {
            if (item.enabledCollection) {
                return item;
            };
        });
        console.log("collections: ", collections);
        shopInfo.collections = collections;
        res.render('index', {
            title: 'Hello, this is template Application of : ' + req.shopname,
            RSApublicKey: keyPair.public,
            shopInfo: shopInfo
        });
    }
});
//

app.use(router);
module.exports = app;
