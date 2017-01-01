// Template of Subsystem.
require("express");
var express = require('express');
var app = express();
var router = express.Router();
var path = require("path");
var mongoose = require("mongoose");
var systemAttribute = require("./systemAttribute.js");
var fs = require('fs');

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

var currency = [];
for (var i in systemAttribute.currency) {
    var obj = {};
    obj.i = i;
    obj.name = systemAttribute.currency[i].name;
    currency.push(obj);
}

router.use(function(req, res, next) {
    setting = requireUncached("./setting");
    next();
});

function requireUncached(module) {
    delete require.cache[require.resolve(module)]
    return require(module)
};


router.get('/', homeEndPoint);

function homeEndPoint(req, res, next) {
    var item = null;
    var systemSKU = null;
    if (req.productItem) {
        item = req.productItem
        systemSKU = req.systemSKU;
    }
    // update cats and brands

    var Shops = mongoose.model('Shops');
    // find Shops via Shops Name
    Shops.findOne({ shopname: req.shopname }, function(err, shop) {
        if (err || !shop) {
            // console.log("Error from Mongoose:")
        } else {
            var customElem = systemAttribute.system;
            customElem.forEach(function(obj) {
                if (obj["attributes"]["sysId"] == "sysCategories") {
                    obj["attributes"]["options"] = shop["categories"].map(function(item) {
                        return item["name"];
                    })
                }
                if (obj["attributes"]["sysId"] == "sysBrandName") {
                    obj["attributes"]["options"] = shop["brandNames"].map(function(item) {
                        return item["name"];
                    })
                }
            })

            res.render('index', {
                title: 'Hello, this is template Application of : ' + req.shopname,
                data: setting,
                system: systemAttribute.system,
                currency: currency,
                RSApublicKey: keyPair.public,
                systemSKU: systemSKU,
                item: item
            });
        }
    })


}
//  Global variables for Business functions

var objResult = {};
objResult.status = 0
objResult.err = null;
objResult.return_id = null;
//

router.get("/getOptionSets", function(req, res, next) {
    // console.log("from /getOptionSets");
    var optionSets = mongoose.model('OptionSets');
    var query = { shopName: req.shopname };
    optionSets.find(query, function(err, doc) {
        if (err || !doc) {
            objResult.status = 4;
            objResult.err = err;
            res.send(objResult);
            return;
        }
        objResult.status = 0
        objResult.err = null;
        objResult.doc = doc;
        res.send(objResult);
        objResult.doc = null;
        // res.end(JSON.stringify(doc));
    })
});

router.post("/updateProduct", checkToken, checkAuth, function(req, res, next) {
    var exPayload = req.body.exPayload;
    var systemSKU = req.body.payload.data.systemSKU;
    var isAddNewItem = false;
    var payload = req.body.payload.data;
    // console.log("from line 97: ", payload.productAtttributes[4]);
    if (!systemSKU) {
        payload.systemSKU = systemSKU = mongoose.Types.ObjectId().toString();
        isAddNewItem = true;

    }
    // write images of Product to file
    if (exPayload instanceof Array) {
        for (var i in exPayload) {
            if (!exPayload[i]["sysId"]) {
                exPayload[i]["sysId"] = mongoose.Types.ObjectId();
            }
            var filePath = "./Shops/" + req.shopname + "/public/imgs/" + systemSKU + "_" + exPayload[i]["sysId"].toString() + ".png";
            if (exPayload[i]["InputValue"] && exPayload[i]["InputValue"].indexOf("data:image/png;base64") !== -1) {
                var result = writeBase64ImageSync(filePath, exPayload[i]["InputValue"]);
                if (result) {
                    exPayload[i]["InputValue"] = '/' + req.shopname + "/imgs/" + systemSKU + "_" + exPayload[i]["sysId"].toString() + ".png";
                }
            }
        }
    }
    // merge exPayload and Payload to save in MongoDb    
    payload.productAtttributes.push.apply(payload.productAtttributes, exPayload);
    // console.log("payload: ", payload.systemSKU, payload.productAtttributes[4]);
    var Shops = mongoose.model('Shops');
    // find Shops via Shops Name
    Shops.findOne({ shopname: req.shopname }, function(err, shop) {
        if (err || !shop) {
            // console.log("Error from Mongoose:")
        } else {
            if (isAddNewItem) {
                addPayloadToItemArr();
            } else {
                var items = shop.items;
                var updateItem = items.filter(function(item) {
                    return item.systemSKU = systemSKU;
                });
                // console.log("updateItem: ", updateItem);
                if (!updateItem) {
                    // prevent faked mongooseId from client
                    payload.systemSKU == null;
                    addPayloadToItemArr();
                } else {
                    //http://stackoverflow.com/questions/26156687/mongoose-find-update-subdocument
                    updatePayloadToItemArr();
                }
            }
        }
        //

        //
        function addPayloadToItemArr() {
            // console.log("check System SKU", !!payload.systemSKU, payload.systemSKU);
            if (!mongoose.Types.ObjectId.isValid(payload.systemSKU) || !payload.systemSKU) {
                payload.systemSKU = mongoose.Types.ObjectId().toString();
            }
            shop.items.push(payload);

            shop.save(function(err) {
                // save err to log later
                if (!err) {
                    shop.markModified('items');
                    objResult.status = 1
                    objResult.err = null;
                    objResult.return_id = payload.systemSKU;
                    res.send(objResult);
                    updateCategoryAndBrandName(req.shopname, payload);
                } else {
                    objResult.status = -1
                    objResult.err = err;
                    objResult.return_id = payload.systemSKU;
                    res.send(objResult);
                }
            });
        }

        function updatePayloadToItemArr() {
            Shops.findOneAndUpdate({
                shopname: req.shopname,
                'items.systemSKU': systemSKU
            }, {
                "$set": {
                    "items.$": payload
                }
            }, function(err, doc) {
                if (!err) {
                    shop.markModified('items');
                    objResult.status = 2
                    objResult.err = null;
                    objResult.return_id = payload.systemSKU;
                    res.send(objResult);
                    updateCategoryAndBrandName(req.shopname, payload);
                } else {
                    objResult.status = -2
                    objResult.err = err;
                    objResult.return_id = payload.systemSKU;
                    res.send(objResult);
                }
            });
        }
    });

});

router.get("/:systemSKU", function(req, res, next) {

    var systemSKU = req.params.systemSKU;
    var Shops = mongoose.model('Shops');
    Shops.findOne({
        'shopname': req.shopname,
        'items.systemSKU': systemSKU
    }, {
        'items.$.systemSKU': systemSKU
    }, function(err, doc) {
        if (err || !doc) {
            var error = {};
            res.render('error', {
                message: "cannot find product",
                error: error
            })
        } else {
            req.productItem = doc;
            req.systemSKU = systemSKU;
            next();
        }
    });
}, homeEndPoint);

router.delete("/", checkToken, checkAuth, deleteProduct);

router.delete("/:systemSKU", checkToken, checkAuth, deleteProduct);

function deleteProduct(req, res, next) {
    //console.log(req.body.payload.data);
    var systemSKU = req.body.payload.data.systemSKU || req.params.systemSKU;
    if (!systemSKU) {
        return
    }

    var Shops = mongoose.model('Shops');
    Shops.update({
        shopname: req.shopname
    }, {
        $pull: { "items": { systemSKU: systemSKU } }
    }, false, function(err, numAffected) {
        if (!err) {
            objResult.status = 2
            objResult.err = null;
            objResult.return_id = systemSKU;
            res.send(objResult);
            //            
            var nullProduct = {};
            // update data
            nullProduct.systemSKU = systemSKU;
            nullProduct.productAtttributes = [];
            var sysCategories = {};
            sysCategories["attributes"] = {};
            sysCategories["attributes"]["sysId"] = 'sysCategories';
            sysCategories['InputValue'] = [];
            nullProduct.productAtttributes.push(sysCategories);
            var sysBrandName = {};
            sysBrandName["attributes"] = {};
            sysBrandName["attributes"]["sysId"] = 'sysBrandName';
            sysBrandName['InputValue'] = [];
            nullProduct.productAtttributes.push(sysBrandName);
            updateCategoryAndBrandName(req.shopname, nullProduct, true);
            return;
        } else {
            objResult.status = -3
            objResult.err = err;
            objResult.return_id = systemSKU;
            res.send(objResult);
            return;
        }
    });
}

// Business Region
function writeBase64ImageSync(fileName, imgData) {
    //console.log(fileName);
    try {
        var data = imgData.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(fileName, data, 'base64');
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }

}

function updateCategoryAndBrandName(shop, product, isDel) {
    // CATEGORIES UPDATE REGION
    // template of singgle category
    // {
    //     name: "abcd",
    //     products: {
    //         ["--productItem", "--productItem"]
    //     },
    //     brandNameList: ["--brandName", "--brandName"]
    // }    
    // <==========category==============================================>..............
    // .........................................<=================pValues=============>
    //                                          |                        |             |
    // .........................<==================oldContainSKU=========>
    //                                          |                        |             |
    // .........................<=neededModify=><====sameInBoth==========><===new======> 
    //
    // needModify = compare by name with oldContainSKU - not includes in pValues  pValues.indexOf          ===-1
    // sameInBoth = compare by name with category      - includes in both         pValues.indexOf          !==-1           
    // new = compare by name with category             - includes in pValue only  categories.map.indexOf   ===-1       

    var Shops = mongoose.model('Shops');
    // find Shops via Shops Name
    Shops.findOne({ shopname: shop }, function(err, shop) {
        if (err || !shop) {
            return;
        }
        var categories = shop.categories
        var pCats = product["productAtttributes"];
        var pCatValues;
        var pCatBrandName;
        for (var i = 0; i < pCats.length; i++) {
            if (pCats[i]['attributes']['sysId'] == 'sysCategories') {
                pCatValues = pCats[i]["InputValue"];
            }
            if (pCats[i]['attributes']['sysId'] == 'sysBrandName') {
                pCatBrandName = pCats[i]["InputValue"];
            }
        }
        if (!pCatValues instanceof Array) {
            return;
        }
        // A. Find objects in category which contains product SKU;
        var oldCatContainSKU = categories.filter(function(obj) {
            if (obj.products) {
                return obj.products.indexOf(product.systemSKU) !== -1;
            }

        });

        // B. Define new objects and modify needed object arrays
        // only in oldCatContainSKU
        var neededModifyCats = oldCatContainSKU.filter(function(obj) {
            return pCatValues.indexOf(obj.name) == -1;
        });
        // only in pCatValues
        var newCats = pCatValues.filter(function(obj) {
            return categories.map(function(item) {
                return item.name;
            }).indexOf(obj) == -1;
        });

        // modify old cat objects in categories
        // in both oldCatContainSKU and pCatValues
        var sameCats = categories.filter(function(obj) {
            return pCatValues.indexOf(obj.name) !== -1;
        });
        // create new cat objects
        for (var i = 0; i < newCats.length; i++) {
            (function(n) {
                var tempCat = {};
                tempCat.name = newCats[n];
                tempCat.products = [];
                tempCat.products.push(product.systemSKU);
                //tempCat.brandNames = [];
                tempCat.brandNames = pCatBrandName;
                categories.push(tempCat);
            })(i);
        }
        // modify old cat objects in categories
        // in oldCatContainSKU only
        var len = neededModifyCats.length
        for (var i = 0; i < len; i++) {
            if (neededModifyCats[i].products.indexOf(product.systemSKU) !== -1) {
                neededModifyCats[i].products.splice(neededModifyCats[i].products.indexOf(product.systemSKU), 1);
                if (neededModifyCats[i].products.length == 0) {
                    categories.pull(neededModifyCats[i]);
                    // update brahdName                        
                };
            };
        }

        for (var i = 0; i < sameCats.length; i++) {
            if (sameCats[i].products.indexOf(product.systemSKU) < 0) {
                //sameCats[i].products = sameCats[i].products.concat(product.systemSKU);
                categories[categories.indexOf(sameCats[i])].products.push(product.systemSKU);
            }
        }
        // BRANDNAME UPDATE REGION
        // template of singgle brandName
        // {
        //     name: "abcd",
        //     products: {
        //         ["--productItem", "--productItem"]
        //     },
        //     categories: ["--category", "--category"]
        // }
        // console.log("from updateBrandName: ", product);
        var brandNames = shop.brandNames;
        var pBrandName = product["productAtttributes"];
        var pBrandValues;
        var pCatCategories;
        for (var i = 0; i < pBrandName.length; i++) {
            if (pBrandName[i]['attributes']['sysId'] == 'sysBrandName') {
                pBrandValues = pBrandName[i]["InputValue"];
            }
            if (pBrandName[i]['attributes']['sysId'] == 'sysCategories') {
                pCatCategories = pBrandName[i]["InputValue"];
            }
        }
        if (!pBrandValues) {
            return;
        }
        var oldBrandNameContainSKU = brandNames.filter(function(obj) {
            if (obj.products) {
                return obj.products.indexOf(product.systemSKU) !== -1;
            }
        });
        // List of objects which contain sysSKU in oldBrandNameContainSKU only, not in pBrandValues
        var neededModifyBns = oldBrandNameContainSKU.filter(function(obj) {
            if (obj.name) {
                return pBrandValues.indexOf(obj.name) == -1;
            }
        });
        // Only in pBrandValues;
        var newBns = pBrandValues.filter(function(obj) {
            return brandNames.map(function(item) {
                return item.name;
            }).indexOf(obj) == -1;
        });
        // same in both
        var sameBns = brandNames.filter(function(obj) {
            return pBrandValues.indexOf(obj.name) !== -1;
        });
        // update new Objects
        for (var i = 0; i < newBns.length; i++) {
            (function(n) {
                var tempBn = {};
                tempBn.name = newBns[n];
                tempBn.products = [];
                tempBn.products.push(product.systemSKU);
                tempBn.categories = pCatCategories;
                brandNames.push(tempBn);
            })(i);
        };
        // modify old brandName objects in brandNames
        // in neededModifyBns only
        var len = neededModifyBns.length
        for (var i = 0; i < len; i++) {
            neededModifyBns[i].products.splice(neededModifyBns[i].products.indexOf(product.systemSKU), 1);
            if (neededModifyBns[i].products.length == 0) {
                brandNames.pull(neededModifyBns[i]);
                // update Categories                    
            }
        };

        for (var i = 0; i < sameBns.length; i++) {
            if (sameBns[i].products.indexOf(product.systemSKU) == -1) {
                //sameBns[n].products.push(product.systemSKU);
                brandNames[brandNames.indexOf(sameBns[i])].products.push(product.systemSKU);
            }
        };
        // Synchronize BrandName and Categories Region

        oldCatContainSKU.forEach(function(item) {
            // console.log(item["products"]);
            var realFlatBrands = getRealFlatBrands(shop, item["products"]);
            if (categories.indexOf(item) !== -1) {
                categories[categories.indexOf(item)]["brandNames"] = realFlatBrands;
            }
        });


        oldBrandNameContainSKU.forEach(function(item) {
            var realFlatCats = getRealFlatCats(shop, item["products"]);
            if (brandNames.indexOf(item) !== -1) {
                brandNames[brandNames.indexOf(item)]["categories"] = realFlatCats;
            }
        });
        // update collection in case of product is deleted
        if (isDel) {
            var collections = shop.collections;
            var colls = collections.filter(function(col) {
                return col.productLists.filter(function(pr) {
                    if (pr.id == product.systemSKU) {
                        col.productLists.splice(col.productLists.indexOf(pr.id), 1)
                    };
                    return;
                });
            });

            shop.collections = colls;
            //console.log(colls);
        };
        shop.markModified('mixed.type');
        shop.markModified('categories');
        shop.markModified('categories.$.products');
        shop.markModified('categories.$.brandNames');
        shop.markModified('brandNames');
        shop.markModified('brandNames.$.products');
        shop.markModified('brandNames.$.categories');
        shop.markModified('collections')
        shop.markModified('collections.$.productLists');

        shop.save(function(err) {
            console.log("check err: ", err);
        })
    })

}


function getRealFlatCats(shop, products) {
    var realFlatCats = [];
    shop.categories.forEach(function(obj) {
        products.forEach(function(item) {
            if (obj["products"].indexOf(item) !== -1) {
                realFlatCats.push(obj["name"]);
            }
        })
    })

    return realFlatCats.filter(function(item, pos) {
        return realFlatCats.indexOf(item) == pos;
    })
}

function getRealFlatBrands(shop, products) {
    var realFlatBrands = [];
    shop.brandNames.forEach(function(obj) {
        products.forEach(function(item) {
            if (obj["products"].indexOf(item) !== -1) {
                realFlatBrands.push(obj["name"]);
            }
        })
    })

    return realFlatBrands.filter(function(item, pos) {
        return realFlatBrands.indexOf(item) == pos;
    })
}


app.use(router);
module.exports = app;
