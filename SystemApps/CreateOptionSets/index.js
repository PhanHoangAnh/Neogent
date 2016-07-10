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


router.get('/', function(req, res, next) {
    // res.send("hello, this is template Application");
    res.render('index', {
        title: 'Hello, this is template Application of : ' + req.shopname,
        data: setting
    });
});
//
router.post("/updateOptionSets", function(req, res, next) {
    console.log("Attribute of Shop: ", req.shopname, "updateOptionSets incomming data: ", req.body);
    //var optionSets = dbEngine.OptionSets();
    var optionSets = mongoose.model('OptionSets');
    var objResult = {};
    objResult.status = 0
    objResult.err = null;
    objResult.return_id = null;
    var _id = req.body.objId;
    if (!_id) {
        var doc = new optionSets();
        doc._id = _id = mongoose.Types.ObjectId();
        doc.setName = req.body.optionSetsName;
        doc.scope = "Global";
        doc.components = req.body.components;
        doc.shopName = req.shopname;
        doc.save(function(err) {
            objResult.status = 1;
            objResult.err = err;
            objResult.return_id = _id;
            res.send(objResult);
        });
    } else {
        optionSets.findById(_id, function(err, doc) {
            doc.setName = req.body.optionSetsName;
            doc.scope = "Global";
            doc.components = req.body.components;
            doc.shopName = req.shopname;
            if (err) {
                objResult.status = 2;
                objResult.err = err;
                objResult.return_id = _id;
                res.send(objResult);
                
            } else {
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

router.get("/getOptionSets", function(req, res, next) {

})

app.use(router);
module.exports = app;
