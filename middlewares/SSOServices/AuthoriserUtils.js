var mongoose = require("mongoose");

function checkAuthorization(req, res, next) {
    //1. check req.shopname
    var shopname = req.shopname;
    //2. check req.body.uid
    var fb_uid = req.body.uid;
    //3. check whether uid is member of shop    
    var query = { shopname: shopname }
        // var Shop = mongoose.model("Shops");
    req.auth = false;

    mongoose.model("Shops").findOne(query, function(err, obj) {
        if (err || !obj) {
            res.status(401).send();
            return;
        } else {
            var memberLists = obj.members;
            for (var i = 0; i < memberLists.length; i++) {
                if (memberLists[i].uid == fb_uid) {
                    req.auth = memberLists[i].role
                    break;
                }
            }
            next();
        }
    });
    //     console.log(shopname, fb_uid, memberLists);
        // console.log("via checkAuthorization...........");
    //     next();
}

module.exports = {
    checkAuth: checkAuthorization
}
