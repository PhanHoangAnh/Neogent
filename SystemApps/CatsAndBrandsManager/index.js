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

//  Global variables for Business functions

var objResult = {};
objResult.status = 0
objResult.err = null;
objResult.return_id = null;

router.get('/', function(req, res, next) {
    var Shops = mongoose.model('Shops');
    Shops.findOne({ shopname: req.shopname }, function(err, shop) {
        if (err || !shop) {
            res.sendStatus(404);
            return;
        } else {
            var shopInfo = {
                avatars: shop.avatars,
                longitude: shop.longitude,
                latitude: shop.latitude,
                shopname: shop.shopname,
                showName: shop.showName,
                slogan: shop.slogan,
                companyName: shop.companyName,
                contact_phone: shop.contact_phone,
                contact_email: shop.contact_email,
                address: shop.address,
                categories: shop.categories.map(function(obj) {
                    return obj["name"];
                }),
                brandNames: shop.brandNames.map(function(obj) {
                    return obj["name"];
                }),
                catGroups: shop.catGroups

            };
            res.render('index', {
                title: 'Hello, this is template Application of : ' + req.shopname,
                data: setting,
                RSApublicKey: keyPair.public,
                shopInfo: shopInfo
            });
        }
    });
});

router.post("/update", checkToken, checkAuth, function(req, res, next) {
    // console.log(req.body.exPayload);
    var Shops = mongoose.model('Shops');
    // find Shops via Shops Name
    Shops.findOne({ shopname: req.shopname }, function(err, shop) {
        if (err) {

        } else {
            var savedData = req.body.exPayload;
            var catGroups = [];

            if (savedData && savedData instanceof Array) {

                for (var i = 0; i < savedData.length; i++) {
                    with({ n: i }) {
                        if (savedData[n]["img"] && savedData[n]["img"].indexOf("data:image/png;base64") !== -1) {
                            var alias = mongoose.Types.ObjectId().toString();
                            var filePath = "./Shops/" + req.shopname + "/public/imgs/catGroup_" + alias + ".png";
                            var result = writeBase64ImageSync(filePath, savedData[n]["img"]);
                            if (result) {
                                savedData[n]["img"] = req.shopname + "/imgs/catGroup_" + alias + ".png";
                            }
                        }
                        if (savedData[n]["type"] == "catGroup") {
                            delete savedData[n]["type"];
                            catGroups.push(savedData[n]);
                        } else if (savedData[n]["type"] == "branchGroup") {
                            //delete obj["type"];
                            shop.brandNames.filter(function(br) {
                                if (br["name"] == savedData[n]["name"]) {
                                    br["img"] = savedData[n]["img"];
                                }
                            })
                        }
                    }(i);
                }
                shop.catGroups = catGroups;
            }
            shop.save(function(error) {
                if (error) {
                    var objResult = {};
                    objResult.status = -1
                    objResult.err = error;
                    objResult.return_id = null;
                } else {
                    var objResult = {};
                    objResult.status = 0
                    objResult.err = null;
                    objResult.return_id = null;
                    shop.markModified('mixed.type');
                    shop.markModified('catGroups');
                }
                res.send(objResult);
            })
        }
    })

})

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
