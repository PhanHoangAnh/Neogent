require("express");

var express = require('express');
// var app = express();
var router = express.Router();
var path = require("path");
var app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// // From : http://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate
var setting = requireUncached("./setting");
router.use(function(req, res, next) {
	setting = requireUncached("./setting");
    next();
});

function requireUncached(module) {
    delete require.cache[require.resolve(module)]
    return require(module)
};

router.get('/', function(req, res, next) {
    res.render('index', { data: setting });
});

// dynamic mapping here for appropriated applications
var url = "/abc";
router.use(url, appTemplate);
// router.use("/manager", app);
router.use("/opt", require('../CreateOptionSets/index'));

for (var i in setting) {
    if (setting[i].url == 'appManager') {
        router.use(path.join('/', setting[i].url), app);
    } else {
       router.use('/'+ setting[i].url, require(path.join(setting[i].path, "index")));
    }
}
app.use(router);
module.exports = app;
