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
    Shops.findOne({
        shopname: shopname
    }, function (err, shop) {
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
            items.forEach(function (obj) {
                var tempObj = {};
                tempObj.atts = [];
                tempObj.systemSKU = obj.systemSKU;
                var atts = obj.productAtttributes;
                for (var i = 0; i < atts.length; i++) {
                    with({
                        n: i
                    }) {
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

// function getBasicShopInfo(req, res, next, template='index') {
function getBasicShopInfo(req, res, next) {
    //
    getFlatShopProducts(req.shopname, fnCb);

    function fnCb(err, shopInfo) {
        if (shopInfo && shopInfo.collections) {
            var collections = shopInfo.collections.filter(function (item) {
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


// function getCollections(req, res, next, template = "collection", pageType = "collection") {
    function getCollections(req, res, next) {
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
    Shops.findOne({
        shopname: shopname
    }, function (err, shop) {
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
            var category = shop.categories.filter(function (cat) {
                return cat.id == catID;
            })[0];
            if (!category) {
                return;
            }
            category.products = getFlatItem(shop, category.products);
            return category;
        }
    });
}

function getShopInforWithBrandsId(shopname, brandId, fn_cb) {
    var Shops = mongoose.model('Shops');
    Shops.findOne({
        shopname: shopname
    }, function (err, shop) {
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
                staticContents: shop.static_content,
                items: getBrandFromShop(brandId),
            };

            // shopInfo.items = flatItems;
            fn_cb(err, shopInfo);
        }

        function getBrandFromShop(brandId) {
            var brand = shop.brandNames.filter(function (br) {
                return br.id == brandId;
            })[0];
            if (!brand) {
                return null;
            }
            brand.products = getFlatItem(shop, brand.products);
            return brand;
        }
    });
}



// function getCategory(req, res, next, template = "category", pageType = "category") {
    function getCategory(req, res, next) {
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


// function getBrandName(req, res, next, template = "brand", pageType = "brand") {
    function getBrandName(req, res, next) {

    var brandId = req.brandId;
    console.log('brandId: ', brandId);

    getShopInforWithBrandsId(req.shopname, brandId, fnCb)

    function fnCb(err, shopInfo) {
        //console.log("shopInfo: ", shopInfo.categories);
        if (!err) {
            if (brandId) {
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
// 
// Utilities
// 
function getFlatItem(shop, productArray) {

    var items = shop.items.filter(function (item) {
        return productArray.map(function (product) {
            return item.systemSKU == product;
        })
    })
    var flatItems = []
    items.forEach(function (obj) {
        var tempObj = {};
        tempObj.systemSKU = obj.systemSKU;
        var atts = obj.productAtttributes;
        for (var i = 0; i < atts.length; i++) {
            with({
                n: i
            }) {
                tempObj[atts[n]["attributes"]["sysId"]] = atts[n]["InputValue"]
                if (atts[n]["data-controlType"] == 'image') {
                    tempObj['img'] = atts[n]["InputValue"];
                }
            }
        }
        flatItems.push(tempObj);
    });
    // console.log('from getFlatItem: ', flatItems);
    return flatItems;
}

function listingAllProductAttributes(shopname, cb_fn) {
    var Shops = mongoose.model('Shops');
    Shops.findOne({
        shopname: shopname
    }, function (err, shop) {
        if (err) {
            cb_fn(err, null);
        } else {
            // listing all items attributes and their values:
            var items = shop.items;
            var flatItems = []
            items.forEach(function (obj) {
                var tempObj = {};
                // tempObj.atts = [];
                tempObj.systemSKU = obj.systemSKU;
                var atts = obj.productAtttributes;
                for (var i = 0; i < atts.length; i++) {
                    with({
                        n: i
                    }) {
                        var subAtt = {};
                        subAtt["data-controlType"] = atts[n]["data-controlType"]
                        subAtt["sysId"] = atts[n]["attributes"]["sysId"];
                        subAtt["InputValue"] = atts[n]["InputValue"];
                        subAtt["describe"] = atts[n]["attributes"]["describe"];
                        // console.log(atts[n]["attributes"]["describe"]);
                        tempObj[atts[n]["attributes"]["sysId"]] = atts[n]["InputValue"];
                        tempObj["describe"] = atts[n]["attributes"]["describe"];
                    }

                }

                flatItems.push(tempObj);
            });
            cb_fn(null, flatItems);
        }
    })
}

function savingGlobalAttribute(shopname, cb_fn) {
    var Shops = mongoose.model('Shops');
    Shops.findOne({
        shopname: shopname
    }, function (err, shop) {
        if (err) {
            cb_fn(err, null);
        } else {
            var items = shop.items;
            var aggregateObj = {};
            items.forEach(function (elem) {
                var atts = elem.productAtttributes;
                var tempObj = {};
                for (var i = 0; i < atts.length; i++) {
                    with({
                        n: i
                    }) {
                        if (!atts[n]["attributes"]["sysId"]) {
                            atts[n]["attributes"]["sysId"] = atts[n]["attributes"]["label"] + "_" + atts[n]["sysId"];
                        }

                        tempObj[atts[n]["attributes"]["sysId"]] = atts[n]["InputValue"];
                        //   tempObj[atts[n]["attributes"]] = atts[n]["attributes"]["label"];
                        console.log('tempObj -----------: \n ', tempObj);
                        if (!aggregateObj.hasOwnProperty(atts[n]["attributes"]["sysId"])) {
                            aggregateObj[atts[n]["attributes"]["sysId"]] = [];
                        };
                        var InputValue = atts[n]["InputValue"];
                        var property = atts[n]["attributes"]["sysId"];
                        if (InputValue instanceof Array) {
                            // 1. Flattening InputValue
                            InputValue = [].concat.apply([], atts[n]["InputValue"])
                            aggregateObj[property] = aggregateObj[property].concat(InputValue.filter(function (item) {
                                return aggregateObj[property].indexOf(item) < 0;
                            }));
                            // console.log('\x1b[33m%s\x1b[0m: ', "Property: ", property, " InstanceOf Array", InputValue, aggregateObj[property]);
                            // if (aggregateObj[property].indexOf(InputValue) < 0) 
                        } else {
                            // console.log('\x1b[33m%s\x1b[0m: ', aggregateObj[property], " IndexOf: ", aggregateObj[property].indexOf(InputValue), InputValue);
                            aggregateObj[property].push(InputValue)
                        }
                        aggregateObj[property] = aggregateObj[property].filter((thing, index, self) => self.findIndex((t) => {
                            return isRawObjectsEquivalent(t, thing);
                        }) === index)

                    }
                }


            });


            function isRawObjectsEquivalent(a, b) {
                // Create arrays of property names
                var aProps = Object.getOwnPropertyNames(a);
                var bProps = Object.getOwnPropertyNames(b);

                // If number of properties is different,
                // objects are not equivalent
                if (aProps.length != bProps.length) {
                    return false;
                }

                for (var i = 0; i < aProps.length; i++) {
                    var propName = aProps[i];

                    // If values of same property are not equal,
                    // objects are not equivalent
                    if (a[propName] !== b[propName]) {
                        return false;
                    }
                }

                // If we made it this far, objects
                // are considered equivalent
                return true;
            }
            console.log("===============================");
            console.log(aggregateObj);
            cb_fn(null, aggregateObj);
        }
    })
}


module.exports = {
    getFlatShopProducts: getFlatShopProducts,
    getBasicShopInfo: getBasicShopInfo,
    getCollections: getCollections,
    getCategory: getCategory,
    getBrandName: getBrandName,
    listingAllProductAttributes: listingAllProductAttributes,
    savingGlobalAttribute: savingGlobalAttribute
}