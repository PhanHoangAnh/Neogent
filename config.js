var fs = require('fs');
var keyPair = JSON.parse(fs.readFileSync('temp', 'utf8'));
var SSOServices = require("./middlewares/SSOServices/SsoUtils");


// variables
global["keyPair"] = JSON.parse(fs.readFileSync('temp', 'utf8'));
global['jwtsecret'] = 'convitbuocloai1';

//public function
global['getToken'] = SSOServices.getToken;
global['checkToken'] = SSOServices.checkToken;
global['checkAuth'] = require("./middlewares/SSOServices/AuthoriserUtils").checkAuth;

// Mapping independent Applications
global["appTemplate"] = require('./SystemApps/AppTemplate/index');
global["appManager"] = require("./SystemApps/AppManager/index");
global["shopRegister"] = require("./SystemApps/ShopRegistration/index");

// Database section
global["database"] = 'mongodb://localhost/Neogento';
global["dbEngine"] = require("./middlewares/databases/dbEngine");
// global["dbManager"] = require("./middlewares/databases/dbManager");
// End of Database

// shop utils
var shopbase = require("./middlewares/ShopUtils/shopbase")
global['getFlatShopProducts'] = shopbase.getFlatShopProducts;
global['getBasicShopInfo'] = shopbase.getBasicShopInfo;
global['getCollections'] = shopbase.getCollections;
global['getCategory'] = shopbase.getCategory;
global['getBrandName'] = shopbase.getBrandName;
global['listingAllProductAttributes'] = shopbase.listingAllProductAttributes;

global['coreApp'] = require("./middlewares/ShopUtils/coreApp");

module.exports = {
    'database': 'mongodb://localhost/Neogento'
};
