var express = require('express');
var path = require("path");
var app = express();
var router = express.Router();

router.get('/', function(req, res, next) {
    var shopPath = path.join(path.resolve("../public"), req.shopname);
    // res.send(shopPath);
    // console.log("current path: ", shopPath);
    // res.render('index', { title: 'Express' });
    var nextPath = path.join("../Shops", req.shopname);
    console.log("next require", nextPath);
    var shopHandler = require(nextPath);
    shopHandler(req, res, next);

});

router.post("/checkToken", checkToken, function(req, res, next) {
    var sendObj = {};
    sendObj.errNum = 0;
    sendObj.errMessage = "Valid Token";
    console.log("payload data", req.body.payload, req.body.uid);
    res.send(sendObj);
    res.end();
});

// var url = "template";
router.post("/getToken", getToken);

app.use(router)
module.exports = app;
