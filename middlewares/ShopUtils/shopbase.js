var mongoose = require("mongoose");

function getFlatShopProducts(shopname, fn_cb) {
    console.log('shopname', shopname);
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
                walls: shop.walls
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
                    }
                }
                flatItems.push(tempObj);
            });
            shopInfo.items = flatItems;
            fn_cb(err, shopInfo);
        }
    });
};

module.exports = {
    getFlatShopProducts: getFlatShopProducts
}