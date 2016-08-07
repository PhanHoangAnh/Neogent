// Template of Subsystem.
require("express");
var express = require('express');
var app = express();
var router = express.Router();
var path = require("path");
var mongoose = require("mongoose"),
    Mongoose;
var jsonfile = require('jsonfile');
var hashmap = require('hashmap');
var ncp = require('ncp').ncp;
var fs = require('fs');

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

jsonfile.readFile(file, function(err, obj) {
    if (err) {
        return
    }
    shopOwnerManager.copy(obj);
    shopOwnerManager.forEach(function(v, k) {
        shopOwnerManagerInvert.set(v, k);
    });
    // console.log(shopOwnerManager);
    // console.log(shopOwnerManagerInvert);

});
// Utility function to check whether folder is existed take from https://groups.google.com/forum/#!topic/nodejs/h2h7dIKtP9E
// function dirExists(d, cb) {
//     fs.stat(d, function(er, s) {
//         cb(!er && s.isDirectory())
//     })
// }
function dirExistsSync(d) {
    var result;
    try {
        result = fs.statSync(d).isDirectory();
    } catch (er) {
        result = false
    }
    return result;
}

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
    res.render('index', {
        title: 'Hello, this is template Application of : ' + req.shopname,
        RSApublicKey: keyPair.public
    });
});
//  Global variables for Business functions


//
router.post('/checkAndRegisterShopName', checkToken, function(req, res, next) {
    //1. CheckShopName from list (k,v) if shop is existed return invalid, else, create new shop and return valid
    var objResult = {};
    objResult.status = 0
    objResult.err = null;
    objResult.return = null;
    var shopName = req.body.payload.data;
    console.log(shopName);
    var fbId = req.body.uid;
    var Shop = mongoose.model('Shops');
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
        // console.log("from shopOwnerManager: ", shopOwnerManager.get(shopName));
        shopOwnerManagerInvert.set(fbId, shopName);
        objResult.return = shopName;
        jsonfile.writeFile(file, shopOwnerManager, function(err) {
            // console.error(err)
        });
        //1. Create shop folder        
        ncp.limit = 16;
        var srcPath = path.resolve("Shops/shopTemplate");
        var destPath = path.resolve("Shops", shopName);
        var folderIsExisted = dirExistsSync(destPath);
        if (!folderIsExisted) {
            ncp(srcPath, destPath, function(err) {
                if (err) {
                    return console.error(err);
                }
            });
            //2. Send shop's registration to database
            var shop = new Shop();
            shop.fb_uid = fbId;
            shop.shopname = shopName;
            var members = [];
            var ownerObj = {};
            ownerObj.role = "owner";
            ownerObj.uid = fbId;
            members.push(ownerObj);
            shop.members = members;
            shop.save(function(err) {
                // Log Errors for later
                console.log("from shop registration :", err);
            })

        } else {
            objResult.status = 4
            objResult.err = "Shop folder has been taken";
        }

    }
    //2. Return objResult to browser
    res.send(objResult);

});


app.use(router);
module.exports = app;
