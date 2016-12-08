// Template of Subsystem.
require("express");
var express = require('express');
var app = express();
var router = express.Router();
var path = require("path");
var mongoose = require("mongoose");
var fs = require('fs');

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


router.get('/', function(req, res, next) {
    // res.send("hello, this is template Application");
    // console.log(req.shopname)
    res.render('index', {
        title: 'Hello, this is template Application of : ' + req.shopname,
        data: setting,
        RSApublicKey: keyPair.public
    });
});
//  Global variables for Business functions

var objResult = {};
objResult.status = 0
objResult.err = null;
objResult.return_id = null;
//
router.post("/updateShop", checkToken, checkAuth, function(req, res, next) {
    var mainData = req.body.payload.data
    console.log("Attribute of Shop: ", req.shopname, "updateOptionSets incomming data: ", mainData);
    console.log("Wall Image: ", req.body.exPayload.walls.length);
    console.log("address: ", mainData.address);
    //var optionSets = dbEngine.OptionSets();
    var Shops = mongoose.model('Shops');
    Shops.findOne({ shopname: req.shopname }, function(err, shop) {
        if (err) {
            objResult.status = -1
            objResult.err = err;
            objResult.return_id = null;
            res.send(objResult);
            return;
        }
        shop.longitude = mainData.longitude;
        shop.latitude = mainData.latitude;
        shop.slogan = mainData.slogan;
        shop.showName = mainData.showName;
        shop.companyName = mainData.companyName;
        shop.contact_email = mainData.contact_email;
        shop.contact_phone = mainData.contact_phone;

        var walls = req.body.exPayload.walls;
        if (walls instanceof Array) {
            for (var i = 0; i < walls.length; i++) {
                if (walls[i].indexOf("data:image/png;base64") !== -1) {
                    var filePath = "./Shops/" + req.shopname + "/public/imgs/wall_" + i + ".png";
                    var result = writeBase64ImageSync(filePath, walls[i]);
                    if (result) {
                        walls[i] = req.shopname + "/imgs/wall_" + i + ".png"
                    }
                }
            }
        }
        shop.walls = walls;
        shop.markModified('walls');
        avatar = req.body.exPayload.avatars;
        if (avatar.indexOf("data:image/png;base64") !== -1) {
            var filePath = "./Shops/" + req.shopname + "/public/imgs/avatar.png";
            var result = writeBase64ImageSync(filePath, avatar);
            if (result) {
                avatar = req.shopname + "/imgs/avatar.png"
            }
        }
        shop.avatars = avatar;
        shop.markModified('avatars');
        shop.static_content = req.body.exPayload.staticContent;
        shop.save(function(err, doc) {
            if (err) {
                objResult.status = 2
                objResult.err = err;
                objResult.return_id = shop._id;
                res.send(objResult);
                return;
            } else {
                objResult.status = 1
                objResult.err = null;
                objResult.return_id = shop._id;
                res.send(objResult);
                return;
            }
        });
    })
});

router.get("/getShop", function(req, res, next) {
    // console.log("from /getOptionSets");
    var Shop = mongoose.model('Shops');
    var query = { shopname: req.shopname };
    Shop.find(query, function(err, doc) {
        if (err) {
            objResult.status = 4;
            objResult.err = err;
            res.send(objResult);
            return;
        }
        objResult.status = 0
        objResult.err = null;
        objResult.doc = doc;
        res.send(objResult);
        objResult.doc = null;
        // res.end(JSON.stringify(doc));
    });
});

function writeBase64ImageSync(fileName, imgData) {
    //console.log(fileName);
    try {
        var data = imgData.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(fileName, data, 'base64');
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }

}

app.use(router);
module.exports = app;
