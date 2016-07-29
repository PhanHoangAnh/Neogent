// Template of Subsystem.
require("express");
var express = require('express');
var app = express();
var router = express.Router();
var path = require("path");
// var mongoose = require("mongoose");
var jsonfile = require('jsonfile');
var hashmap = require('hashmap');

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

var shopOwnerManager = new hashmap();
var shopOwnerManagerInvert = new hashmap();
// Read data from file:
var file = "shopownerdata.json";

// jsonfile.writeFile(file, manager, function(err) {
//     console.error(err)
// })

jsonfile.readFile(file, function(err, obj) {
    // console.log("From Shop Registration:", obj)
    for (var i in obj) {
        shopOwnerManager.set(i, obj[i]);
        shopOwnerManagerInvert.set(obj[i], i);        
    }

})

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


router.get('/', function(req, res, next) {
    // res.send("hello, this is template Application");
    console.log("shopname: ", req.shopname);
    res.render('index', {
        title: 'Hello, this is template Application of : ' + req.shopname,
        RSApublicKey: keyPair.public
    });
});
//  Global variables for Business functions


//
router.post('/checkShopName', checkToken, function(req, res, next) {
    //1. CheckShopName from list (k,v) if shop is existed return invalid, else, create new shop and return valid
    var objResult = {};
    objResult.status = 0
    objResult.err = null;
    objResult.return = null;
    var shopName = req.body.payload.data;
    var fbId = req.body.uid;
    var saveObj = {};
    saveObj.shopName = shopName;
    saveObj.fbId = fbId;

    if (shopName.length < 5) {
        objResult.status = 1
        objResult.err = "Name to short";
        res.send(objResult);
        return;
    }
    if (shopOwnerManagerInvert.has(fbId)) {
        shopName = shopOwnerManagerInvert.get(fbId);
        objResult.status = 2
        objResult.err = "You are shop's owner already";
        objResult.return = shopName;
    } else if (shopOwnerManager.has(shopName)) {
        objResult.status = 3
        objResult.err = "Shop has been taken";
    } else {
        shopOwnerManager.set(shopName, fbId);
        shopOwnerManagerInvert.set(fbId, shopName);
        objResult.return = shopName;
        jsonfile.writeFile(file, shopOwnerManager._data, function(err) {
            console.error(err)
        })
    }
    //2. Return objResult to browser
    res.send(objResult);

});



app.use(router);
module.exports = app;
