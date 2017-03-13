// Template of Subsystem.
require("express");
var express = require('express');
var app = express();
var router = express.Router();
var path = require("path");

// console.log("app.settings ", app.get('views'), app.get('view engine'));
// Do not remove this command during develoment mode
// coreApp.set('views', path.join(__dirname, 'views'))

// coreApp.set('view engine', 'ejs');
coreApp.use(express.static(path.join(__dirname, 'public')));


router.get('/test', function(req, res, next) {
    res.send("test");
});
var testObj = {
    id: 5,
    text: 'convitcon'
}
// coreApp.setTemplateMapper(testObj);
router.use(coreApp);

//

app.use(router);
module.exports = app;
