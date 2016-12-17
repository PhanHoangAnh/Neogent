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
        if (err) {
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
                    exPayload[i]["InputValue"] = req.shopname + "/imgs/" + systemSKU + "_" + exPayload[i]["sysId"].toString() + ".png";
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
        if (err) {
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
                    updateCategoryAndBranchName(req.shopname, payload);
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
                    updateCategoryAndBranchName(req.shopname, payload);
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
}, homeEndPoint)

router.delete("/:systemSKU", checkToken, checkAuth, function(req, res, next) {
    //console.log(req.body.payload.data);
    var systemSKU = req.body.payload.data.systemSKU || req.params.systemSKU;
    if (!systemSKU) {
        return
    }
    var item = {};
    item.systemSKU = systemSKU;
    // updateCategory(req.shopname, item);
    // updateBranchName(req.shopname, item);
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
            var nullProduct = {};
            // update data
            nullProduct.systemSKU = systemSKU;
            nullProduct.productAtttributes = [];
            var sysCategories = {};
            sysCategories["attributes"] = {};
            sysCategories["attributes"]["sysId"] = 'sysCategories';
            sysCategories['InputValue'] = [];
            nullProduct.productAtttributes.push(sysCategories);
            var sysBranchName = {};
            sysBranchName["attributes"] = {};
            sysBranchName["attributes"]["sysId"] = 'sysBranchName';
            sysBranchName['InputValue'] = [];
            nullProduct.productAtttributes.push(sysBranchName);
            updateCategoryAndBranchName(req.shopname, nullProduct);
            return;
        } else {
            objResult.status = -3
            objResult.err = err;
            objResult.return_id = systemSKU;
            res.send(objResult);
            return;
        }
    });

});



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

function updateCategoryAndBranchName(shop, product) {
    // CATEGORIES UPDATE REGION
    // template of singgle category
    // {
    //     name: "abcd",
    //     products: {
    //         ["--productItem", "--productItem"]
    //     },
    //     branchNameList: ["--branchName", "--branchName"]
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
        if (err) {
            return;
        }
        var categories = shop.categories
        var pCats = product["productAtttributes"];
        var pCatValues;
        var pCatBranchName;
        for (var i = 0; i < pCats.length; i++) {
            if (pCats[i]['attributes']['sysId'] == 'sysCategories') {
                pCatValues = pCats[i]["InputValue"];
            }
            if (pCats[i]['attributes']['sysId'] == 'sysBranchName') {
                pCatBranchName = pCats[i]["InputValue"];
            }
        }
        if (!pCatValues instanceof Array) {
            return;
        }
        // A. Find objects in category which contains product SKU;
        var oldCatContainSKU = categories.filter(function(obj) {
            return obj.products.indexOf(product.systemSKU) !== -1;
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
                tempCat.branchNames = [];
                tempCat.branchNames = pCatBranchName;
                categories.push(tempCat);
            })(i);
        }
        // modify old cat objects in categories
        // in oldCatContainSKU only
        var len = len = neededModifyCats.length
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
        // template of singgle branchName
        // {
        //     name: "abcd",
        //     products: {
        //         ["--productItem", "--productItem"]
        //     },
        //     categories: ["--category", "--category"]
        // }
        // console.log("from updateBranchName: ", product);
        var branchNames = shop.branchNames;
        var pBranchName = product["productAtttributes"];
        var pBranchValues;
        var pCatCategories;
        for (var i = 0; i < pBranchName.length; i++) {
            if (pBranchName[i]['attributes']['sysId'] == 'sysBranchName') {
                pBranchValues = pBranchName[i]["InputValue"];
            }
            if (pBranchName[i]['attributes']['sysId'] == 'sysCategories') {
                pCatCategories = pBranchName[i]["InputValue"];
            }
        }
        if (!pBranchValues) {
            return;
        }

        var oldBranchNameContainSKU = branchNames.filter(function(obj) {
            return obj.products.indexOf(product.systemSKU) !== -1;
        });
        // List of objects which contain sysSKU in oldBranchNameContainSKU only, not in pBranchValues
        var neededModifyBns = oldBranchNameContainSKU.filter(function(obj) {
            return pBranchValues.indexOf(obj.name) == -1;
        });
        // Only in pBranchValues;
        var newBns = pBranchValues.filter(function(obj) {
            return branchNames.map(function(item) {
                return item.name;
            }).indexOf(obj) == -1;
        });
        // same in both
        var sameBns = branchNames.filter(function(obj) {
            return pBranchValues.indexOf(obj.name) !== -1;
        });
        // update new Objects
        for (var i = 0; i < newBns.length; i++) {
            (function(n) {
                var tempBn = {};
                tempBn.name = newBns[n];
                tempBn.products = [];
                tempBn.products.push(product.systemSKU);
                tempBn.categories = pCatCategories;
                branchNames.push(tempBn);
            })(i);
        };
        // modify old branchName objects in branchNames
        // in neededModifyBns only
        var len = neededModifyBns.length
        for (var i = 0; i < len; i++) {
            neededModifyBns[i].products.splice(neededModifyBns[i].products.indexOf(product.systemSKU), 1);
            if (neededModifyBns[i].products.length == 0) {
                branchNames.pull(neededModifyBns[i]);
                // update Categories                    
            }
        };

        for (var i = 0; i < sameBns.length; i++) {
            if (sameBns[i].products.indexOf(product.systemSKU) == -1) {
                //sameBns[n].products.push(product.systemSKU);
                branchNames[branchNames.indexOf(sameBns[i])].products.push(product.systemSKU);
            }
        };
        // Synchronize BranchName and Categories Region

        var realFlatCats = categories.filter(function(obj) {
            // obj is array of branchNames in Categories and it must bear at least one of item in pBranchValues
            return obj.branchNames.filter(function(item) {
                //item is single branchName in array
                return pBranchValues.indexOf(item) !== -1;
            });
        }).map(function(obj) {
            return obj.name;
        });

        var realFlatBns = branchNames.filter(function(obj) {
            // obj is array of categories in branchNames and it must bear at least on of item in pCatValues
            return obj.categories.filter(function(item) {
                // item is single category in arrya
                return pCatValues.indexOf(item) !== -1
            })
        }).map(function(obj) {
            return obj.name;
        });


        for (var i = 0; i < sameCats.length; i++) {
            (function(n) {
                sameCats[n]['branchNames'] = null;
                sameCats[n]['branchNames'] = realFlatBns
            })(i);
        };
        for (var i = 0; i < sameBns.length; i++) {
            (function(n) {
                sameBns[n]['categories'] = null;
                sameBns[n]['categories'] = realFlatCats;
            })(i);
        };
        console.log('realFlatCats: ', realFlatCats);
        shop.markModified('mixed.type');

        shop.markModified('categories');
        shop.markModified('categories.$.products');
        shop.markModified('categories.$.branchNames');
        shop.markModified('branchNames');
        shop.markModified('branchNames.$.products');
        shop.markModified('branchNames.$.categories');

        shop.save(function(err) {
            console.log("check err: ", err);
        })
    })

}


app.use(router);
module.exports = app;
