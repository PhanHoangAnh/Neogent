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

function getShopInforWithCategoryId(shopname, catID, fn_cb) {
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
            //shopInfo.items = flatItems;
            fn_cb(err, shopInfo);
        }
    });

}

function getCollections(req, res, next, template = "collection", pageType = "collection") {

    getFlatShopProducts(req.shopname, fnCb);
    var collectionId = req.collectionId;

    function fnCb(err, shopInfo) {
        if (!err) {
            if (collectionId) {
                template = template;
                res.render(template, {
                    shopInfo: shopInfo,
                    collectionId: collectionId,
                    pageType: pageType
                })
            } else {
                res.send("Not yet available Template");
            }
        } else {
            res.sendStatus(404);
        }
    }
};

function getShopInforWithCategoryId(shopname, catID, fn_cb) {
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
                categories: getCategoryFromShop(catID),
                brandNames: shop.brandNames,
                collections: shop.collections,
                catGroups: shop.catGroups,
                walls: shop.walls,
                staticContents: shop.static_content
            };

            // shopInfo.items = flatItems;
            fn_cb(err, shopInfo);
        }

        function getCategoryFromShop(catId) {
            var category = shop.categories.filter(function(cat) {
                return cat.id = catID;
            })[0];
            // console.log("category: ", category);
            category.products = getFlatItem(shop, category.products);
            return category;
        }
    });
}

function getFlatItem(shop, productArray) {

    var items = shop.items.filter(function(item) {
        return productArray.map(function(product) {
            return item.systemSKU == product;
        })
    })

    // console.log("flatItems: ", items);
    // var items = shop.items;
    var flatItems = []
    items.forEach(function(obj) {
        var tempObj = {};
        tempObj.systemSKU = obj.systemSKU;
        var atts = obj.productAtttributes;
        for (var i = 0; i < atts.length; i++) {
            with({ n: i }) {
                tempObj[atts[n]["attributes"]["sysId"]] = atts[n]["InputValue"]
                if (atts[n]["data-controlType"] == 'image') {
                    tempObj['img'] = atts[n]["InputValue"];
                }
            }
        }
        flatItems.push(tempObj);
    });
    console.log('from getFlatItem: ', flatItems);
    return flatItems;
}


function getCategory(req, res, next, template = "category", pageType = "category") {

    var categoryId = req.categoryId;

    getShopInforWithCategoryId(req.shopname, categoryId, fnCb)

    function fnCb(err, shopInfo) {
        //console.log("shopInfo: ", shopInfo.categories);
        if (!err) {
            if (categoryId) {
                template = template;
                res.render(template, {
                    shopInfo: shopInfo,
                    // categoryId: categoryId,
                    pageType: pageType
                })
            } else {
                res.send("Not yet available Template");
            }
        } else {
            res.sendStatus(404);
        }
    };
}


function getBrandName(req, res, next, template = "brand", pageType = "brand") {

    var categoryId = req.categoryId;

    getShopInforWithCategoryId(req.shopname, categoryId, fnCb)

    function fnCb(err, shopInfo) {
        //console.log("shopInfo: ", shopInfo.categories);
        if (!err) {
            if (categoryId) {
                template = template;
                res.render(template, {
                    shopInfo: shopInfo,
                    // categoryId: categoryId,
                    pageType: pageType
                })
            } else {
                res.send("Not yet available Template");
            }
        } else {
            res.sendStatus(404);
        }
    };
}

module.exports = {
    getFlatShopProducts: getFlatShopProducts,
    getBasicShopInfo: getBasicShopInfo,
    getCollections: getCollections,
    getCategory: getCategory
}
