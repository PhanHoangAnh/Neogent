var express = require('express');
var path = require("path");
var app = express();
var router = express.Router();

router.use(function(req, res, next) {
    // var shopPath = path.join(path.resolve("../public"), req.shopname);
    // res.send(shopPath);    
    // res.render('index', { title: 'Express' });
    var nextPath = path.join("../Shops", req.shopname);
    var shopHandler = require(path.join(nextPath, "index"));
    shopHandler(req, res, next);

});

router.use("/checkToken", checkToken, function(req, res, next) {
    var sendObj = {};
    sendObj.errNum = 0;
    sendObj.errMessage = "Valid Token";
    // console.log("payload data", req.body.payload, req.body.uid);
    res.send(sendObj);
    res.end();
});

router.use("/checkAuth", checkToken, checkAuth, function(req, res, next) {
    var sendObj = {};
    sendObj.errNum = 0;
    sendObj.errMessage = "Valid Token";
    sendObj.auth = req.auth;
    // console.log("payload data", req.body.payload, req.body.uid);
    res.send(sendObj);
    res.end();
})

// var url = "template";
router.post("/getToken", getToken);

app.use(router)
module.exports = app;
