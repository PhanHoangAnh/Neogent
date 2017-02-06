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
global['getFlatShopProducts'] = require("./middlewares/ShopUtils/shopbase").getFlatShopProducts;
global['getBasicShopInfo'] = require("./middlewares/ShopUtils/shopbase").getBasicShopInfo;

module.exports = {
    'database': 'mongodb://localhost/Neogento'
};
