var mongoose = require("mongoose");
var express = require('express');
var app = express();
var router = express.Router();

function getFlatShopProducts(shopname, fn_cb) {
    // console.log('shopname', shopname);
    if (!fn_cb || typeof fn_cb !== "function") {
        return null;
    }
    var Shops = mongoose.model('Shops');
    Shops.findOne({ shopname: shopname }, function(err, shop) {
        if (err || !shop) {
            fn_cb(err, shop);
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
                categories: shop.categories,
                brandNames: shop.brandNames,
                collections: shop.collections,
                catGroups: shop.catGroups,
                walls: shop.walls,
                staticContents: shop.static_content
            };
            var items = shop.items;
            var flatItems = []
            items.forEach(function(obj) {
                var tempObj = {};
                tempObj.atts = [];
                tempObj.systemSKU = obj.systemSKU;
                var atts = obj.productAtttributes;
                for (var i = 0; i < atts.length; i++) {
                    with({ n: i }) {
                        var subAtt = {};
                        subAtt["data-controlType"] = atts[n]["data-controlType"]
                        subAtt["sysId"] = atts[n]["attributes"]["sysId"];
                        subAtt["InputValue"] = atts[n]["InputValue"];
                        tempObj.atts.push(subAtt);
                        tempObj[atts[n]["attributes"]["sysId"]] = atts[n]["InputValue"]
                    }
                }
                flatItems.push(tempObj);
            });
            shopInfo.items = flatItems;
            fn_cb(err, shopInfo);
        }
    });
};

function getBasicShopInfo(req, res, next, template = 'index') {
    //
    getFlatShopProducts(req.shopname, fnCb);

    function fnCb(err, shopInfo) {
        if (shopInfo && shopInfo.collections) {
            var collections = shopInfo.collections.filter(function(item) {
                if (item.enabledCollection) {
                    return item;
                };
            });
            shopInfo.collections = collections;
        };
        if (err) {
            res.send(err);
        } else {
            res.render(template, {
                title: 'Hello, this is template Application of : ' + req.shopname,
                RSApublicKey: keyPair.public,
                shopInfo: shopInfo
            });
        }

    }
}

function getCollections(req, res, next, template = "productLists") {

    getFlatShopProducts(req.shopname, fnCb);
    var collectionId = req.collectionId;

    function fnCb(err, shopInfo) {
        if (!err) {
            if (collectionId) {
                template = template;
            } else {
                res.send("Not yet available Template");
            }
            res.render(template, {
                shopInfo: shopInfo, 
                collectionId: collectionId
            })
        } else {

        }

    }
}


module.exports = {
    getFlatShopProducts: getFlatShopProducts,
    getBasicShopInfo: getBasicShopInfo,
    getCollections: getCollections

}
