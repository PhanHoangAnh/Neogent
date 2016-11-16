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
router.post("/updateOptionSets", checkToken, checkAuth, function(req, res, next) {
    console.log("Attribute of Shop: ", req.shopname, "updateOptionSets incomming data: ");

    if (!req.auth) {
        objResult.status = 4;
        objResult.err = "Unauthorized";
        objResult.return_id = null;
        res.status(401).send(objResult);
        return;
    }
    var postData = req.body.payload.data;
    var exPayload = req.body.exPayload
    if (exPayload && exPayload instanceof Array) {
        //
        var components = req.body.exPayload;
        for (var com in components) {
            //&& components[com]["attributes"]["ImageOptions"]["img"]
            if (components[com]["data-controlType"] == "ImageOptions") {
                if (!components[com]["sysId"]) {
                    components[com]["sysId"] = mongoose.Types.ObjectId();
                }
                var shopPath = "./Shops/" + req.shopname + "/public/imgs/" + components[com]["sysId"].toString();
                // console.log("here: ", components[com]["attributes"]["ImageOptions"][0]["optName"]);
                var ImageOptions = components[com]["attributes"]["ImageOptions"];
                if (ImageOptions instanceof Array) {
                    for (var i in ImageOptions) {
                        //console.log("indexOf base64: ", ImageOptions[i]["img"].indexOf("data:image/png;base64"), components[com]["attributes"]["ImageOptions"][i]["optName"])
                        if (ImageOptions[i]["img"].indexOf("data:image/png;base64") !== -1) {
                            var imageFileName = shopPath + "_" + ImageOptions[i]["value"] + ".png";
                            var result = writeBase64ImageSync(imageFileName, ImageOptions[i]["img"]);
                            if (result) {
                                // ImageOptions[i]["img"] = req.protocol + '://' + req.headers.host + "/" + req.shopname + "/imgs/" + components[com]["sysId"].toString() + "_" + ImageOptions[i]["value"] + ".png";
                                ImageOptions[i]["img"] = req.shopname + "/imgs/" + components[com]["sysId"].toString() + "_" + ImageOptions[i]["value"] + ".png";
                                console.log(ImageOptions[i]["img"]);
                            }
                        }
                    }
                }
            }
        }
        postData['components'].push.apply(postData['components'], req.body.exPayload)
    }
    var optionSets = mongoose.model('OptionSets');
    var _id = postData.objId;

    //console.log("Not id ?", !_id);
    if (!_id) {
        var doc = new optionSets();
        doc._id = _id = mongoose.Types.ObjectId();
        doc.setName = postData.setName;
        doc.scope = "Global";
        doc.components = postData.components;
        doc.shopName = req.shopname;
        doc.save(function(err) {
            objResult.status = 1;
            objResult.err = err;
            objResult.return_id = _id;
            res.send(objResult);
        });
    } else {
        optionSets.findById(_id, function(err, doc) {
            if (err) {
                objResult.status = 2;
                objResult.err = err;
                res.send(objResult);
            } else {
                doc.setName = postData.setName;
                doc.scope = "Global";
                doc.components = postData.components;
                doc.shopName = req.shopname;
                doc.save(function(error) {
                    objResult.status = 3;
                    objResult.err = error;
                    objResult.return_id = _id;
                    res.send(objResult);
                })
            }
        });
    }
});

router.get("/getOptionSets", checkToken, checkAuth, function(req, res, next) {
    // console.log("from /getOptionSets");
    if (!req.auth) {
        objResult.status = 4;
        objResult.err = "Unauthorized";
        objResult.return_id = null;
        res.status(401).send(objResult);
        return;
    }
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

router.get("/deleteOptionSets/:id", checkToken, checkAuth, function(req, res, next) {
    if (!req.auth) {
        objResult.status = 4;
        objResult.err = "Unauthorized";
        objResult.return_id = null;
        res.status(401).send(objResult);
        return;
    }
    var _id = req.params.id;
    // console.log("remove id: ", _id);
    var optionSets = mongoose.model('OptionSets');
    optionSets.findByIdAndRemove(_id, function(err) {
        objResult.status = 0
        objResult.err = null;
        if (err) {
            objResult.status = 5;
            objResult.err = err;
        }
        res.send(objResult);
    })
});


function writeBase64ImageSync(fileName, imgData) {
    console.log(fileName);
    try {
        var data = imgData.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(fileName, data, 'base64');
        return true;
    } catch (err) {
        //console.log(err);
        return false;
    }

}

app.use(router);
module.exports = app;
