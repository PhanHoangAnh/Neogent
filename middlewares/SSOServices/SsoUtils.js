var utils = require('../../utils/CryptoUtils.js');

var getToken = [utils.decryptRequest, utils.getToken];
var checkToken = [utils.decryptRequest, utils.checkToken];

module.exports = {
    getToken: getToken,
    checkToken: checkToken
}
