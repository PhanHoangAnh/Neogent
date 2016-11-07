var cryptico = require('cryptico');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var qs = require('qs');
var hashmap = require("hashmap");
var request = require('request');
var map = new hashmap();

var callbackURL = 'http://' + process.env.OPENSHIFT_APP_DNS + '/callback';
var APP_ID = '203172309854130';
var APP_SECRET = 'd3fd1a8f36378cd23637970796855301';

var errObj = {
    errNum: 0,
    errMessage: "undefined"
}

function decryptRequest(req, res, next) {

    var RSAKey = cryptico.RSAKey.parse(JSON.stringify(keyPair.private));
    // https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
    var encrypt_Request = req.body.data || req.query.token || req.headers['x-access-token'];
    if (!encrypt_Request) {
        errObj.errNum = 1;
        errObj.errMessage = "Missing Encrypted Object"
        res.send(errObj);
        res.end()
        return;
    }
    try {
        var DecryptionResult = cryptico.decrypt(encrypt_Request, RSAKey);
        //console.log("DecryptionResult: at /media/chipl/Storage/NodeJSRepository/Neogent/utils/CryptoUtils.js: line 40", DecryptionResult);
        var DecryptRSA = JSON.parse(DecryptionResult.plaintext);
        var aes_key = DecryptRSA.key;
        delete DecryptRSA.key;
        var aes_userName = DecryptRSA.userName;
        delete DecryptRSA.userName;
        var aes_password = DecryptRSA.password;
        delete DecryptRSA.password;
        var userName = cryptico.decryptAESCBC(aes_userName, aes_key);
        var password = cryptico.decryptAESCBC(aes_password, aes_key);
        req.body.uid = userName;
        req.body.token = password;
        req.body.key = aes_key;

        req.body.payload = DecryptRSA;
        //req.body.exPayload = req.body.exPayload
        next();
    } catch (err) {
        console.log('here', err);
        errObj.errNum = 2;
        errObj.errMessage = "Invalid Encrypted Object";
        res.send(errObj);
        res.end();
    }
}
//  request bear fb_uid and app_token;
function checkToken(req, res, next) {
    var fb_uid = req.body.uid;
    var app_token = req.body.token;
    if (map.has(fb_uid)) {
        var checkObject = map.get(fb_uid);
        if (checkObject.app_token == app_token) {
            next();
        }
    } else {
        // check validity of app_token
        jwt.verify(app_token, jwtsecret, decodeJwt);
    }

    function decodeJwt(err, decoded) {
        if (!err) {
            next();
        } else {
            errObj.errNum = 3;
            errObj.errMessage = "Invalid Token";
            res.send(errObj);
            res.end();
        }

    }
}

//  request bear fb_uid and fb_shortToken
function getToken(req, res, next) {
    var fb_uid = req.body.uid;
    var fb_token = req.body.token;
    // make a request to Facebook to check the validity of fb_uid and fb_token
    var params = {
        access_token: fb_token,
        fields: "id"
    };
    request.get({
        url: ' https://graph.facebook.com/me',
        qs: params
    }, function(err, resp, body) {
        req.body.isValid = false;
        var results = qs.parse(body);

        for (var item in results) {
            var finalObject = JSON.parse(item);
            if (finalObject.id) {
                if (finalObject.id == fb_uid) {
                    req.body.isValid = true;
                }
            }
        }
        // console.log("from callback function: getToken: isValid:  ", req.body.isValid);
        if (req.body.isValid) {
            extendFbAccessToken(req, res, next);
        } else {
            errObj.errNum = 4;
            errObj.errMessage = "fb_shortToken is invalid or expired";
            res.send(errObj);
            res.end();
        }

    });
}

function extendFbAccessToken(req, res, next) {
    var fb_uid = req.body.uid;
    var fb_token = req.body.token;
    var params = {
        client_id: APP_ID,
        client_secret: APP_SECRET,
        fb_exchange_token: fb_token
    };
    request.get({
        url: 'https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token',
        qs: params
    }, function(err, resp, body) {
        var results = qs.parse(body);
        if (results.access_token == undefined) {
            errObj.errNum = 5;
            errObj.errMessage = "Invalid fb_shortToken";
            res.send(JSON.stringify(errObj));
            res.end();
            return;
        }
        var obj = new MemberHandler();
        obj.fb_uid = fb_uid;
        obj.longFb_token = results.access_token;
        obj.shortFb_token = fb_token;
        var app_token = jwt.sign(obj, jwtsecret, {
            expiresIn: 2880 * 60 // expires in 48 hours
        });
        obj.app_token = app_token;
        map.set(fb_uid, obj);

        // encrypt token then sendback to client
        var obj_token = {};
        obj_token.app_token = app_token;
        var key = req.body.key;
        encryptObject = cryptico.encryptAESCBC(JSON.stringify(obj_token), key);
        var send_obj = {};
        send_obj.status = "ok";
        send_obj.encrypted_app_token = encryptObject;
        res.send(send_obj);
        res.end();

    });
}

function MemberHandler() {
    var self = this;
    setTimeout(function() {
        if (map.has(self.fb_uid)) {
            map.remove(self.fb_uid);
        }
        self = undefined;
    }, 1000 * 3600 * 24 * 2)
}

module.exports = {
    decryptRequest: decryptRequest,
    getToken: getToken,
    checkToken: checkToken
        // extendFbAccessToken: extendFbAccessToken
}
