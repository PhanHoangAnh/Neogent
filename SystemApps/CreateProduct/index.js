// Template of Subsystem.
require("express");
var express = require('express');
var app = express();
var router = express.Router();
var path = require("path");
var mongoose = require("mongoose");
var systemAttribute = require("./systemAttribute.js");
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

var currency = [];
for (var i in systemAttribute.currency) {
    var obj = {};
    obj.i = i;
    obj.name = systemAttribute.currency[i].name;
    currency.push(obj);
}

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
        data: setting,
        system: systemAttribute.system,
        currency: currency,
        RSApublicKey: keyPair.public
    });
});
//  Global variables for Business functions

var objResult = {};
objResult.status = 0
objResult.err = null;
objResult.return_id = null;
//

router.get("/getOptionSets", function(req, res, next) {
    // console.log("from /getOptionSets");
    var optionSets = mongoose.model('OptionSets');
    var query = { shopName: req.shopname };
    optionSets.find(query, function(err, doc) {
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
    })

});

router.post("/updateProduct", checkToken, checkAuth, function(req, res, next) {
    var exPayload = req.body.exPayload;
    // write images of Product to file
    if (exPayload instanceof Array) {
        for (var i in exPayload) {
            if (!exPayload[i]["sysId"]) {
                exPayload[i]["sysId"] = mongoose.Types.ObjectId();
            }
            var filePath = "./Shops/" + req.shopname + "/public/imgs/Products/" + exPayload[i]["sysId"].toString() + ".png";
            console.log(exPayload[i]["InputValue"].indexOf("data:image/png;base64"));
            if (exPayload[i]["InputValue"].indexOf("data:image/png;base64") !== -1) {
                var result = writeBase64ImageSync(filePath, exPayload[i]["InputValue"]);
                if (result) {
                    exPayload[i]["InputValue"] = req.shopname + "/public/imgs/Products/" + exPayload[i]["sysId"].toString() + ".png";
                }
            }
        }
    }
    // merge exPayload and Payload to save in MongoDb
    var payload = req.body.payload.data;
    payload.push.apply(payload, exPayload);
    // console.log("payload: ", payload);
    var Shops = mongoose.model('Shops');
    // find Shops via Shops Name
    Shops.findOne({ shopname: req.shopname }, function(err, shop) {
        if (err) {
            console.log("Error from Mongoose:")
        } else {
            console.log("shop: ", shop);
        }
    });



    res.send(objResult);
});

function writeBase64ImageSync(fileName, imgData) {
    console.log(fileName);
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
