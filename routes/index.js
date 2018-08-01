var express = require('express');
var path = require("path");
var app = express();
var router = express.Router();

// app.set('views', path.join(__dirname, 'views'))
// app.set('views', './views')
// app.set('view engine', 'ejs');
// css and js return first here
app.use('/', express.static('public'));

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


router.use(function(req, res, next) {
    var nextPath = path.join("../Shops", req.shopname);    
    console.log("main index: ", nextPath);
    var shopHandler = require(path.join(nextPath, "index"));
    shopHandler(req, res, next);
});

app.use(router)
module.exports = app;
