var fs = require('fs');
var request = require('request');
var qs = require('qs');
var querystring = require('querystring');
var http = require('http');
var requestify = require('requestify');

var cryptoUtil = require('./cryptoUtils.js');

var keyPair = JSON.parse(fs.readFileSync('../temp', 'utf8'));

var RSAPublicKey = keyPair.public;

var myFb_uid = '1835134196';
var fb_Token = 'EAAC4yL1bZA7IBACv9eR1gTJA7s0E3H21oVmzlSfh8hqGsA7Mc0qmemM6ra0qDiv0rSu4ZBsG79otwt6xlZBuluxugZC73Be0YoKeUXWdaLcjLqgkmsB05QGk2ZB37vtbtcNtz27dn8wS5ZBHjFKzejSFXeZCPhJiYZA1bhqiqheDJ1ZCibbGlHW52';

function ping() {
    // create mock object
    var _data = {
        userName: myFb_uid,
        password: fb_Token
    };
    aes_key = cryptoUtil.generateAESKey();
    var json_data = {
        data: cryptoUtil.EncryptJSON(_data, RSAPublicKey, aes_key)
    };
    // console.log(RSAPublicKey);
    // console.log('_data: ', _data);
    // console.log("json_data: ", json_data);
    // make request:
    request.get({
        url: ' https://localhost.io:3000/',
        qs: json_data
    }, function (err, resp, body) {
        console.log("BODY:\n", body, "resp", resp);
    });



}
// checkToken
// follow http://stackoverflow.com/questions/9768192/sending-data-through-post-request-from-a-node-js-server-to-a-node-js-server
function checkToken(access_Token) {
    // create mock object
    var _data = {
        userName: myFb_uid,
        password: access_Token
    };

    aes_key = cryptoUtil.generateAESKey();
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    requestify.post('https://localhost.io:3000/abcd/checkToken', {
            data: cryptoUtil.EncryptJSON(_data, RSAPublicKey, aes_key)
        })
        .then(function (response) {
            // Get the response body (JSON parsed or jQuery object for XMLs)
            console.log(response.getBody());
            // response.end();

        });

}

function getToken() {
    var _data = {
        userName: myFb_uid,
        password: fb_Token
    };
    temp_aes_key = cryptoUtil.generateAESKey();
    // https://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    requestify.post('https://localhost.io:3000/abcd/getToken', {
            data: cryptoUtil.EncryptJSON(_data, RSAPublicKey, temp_aes_key)
        })
        .then(function (response) {
            // Get the response body (JSON parsed or jQuery object for XMLs)
            // resObject = JSON.parse(response.getBody());
            resObject = response.getBody();
            console.log(resObject);
            if (resObject.encrypted_app_token) {
                // decrypt encrypted app_token
                console.log("Decrypt token...............\n");
                var _app_token = cryptoUtil.aesDecryptor(resObject.encrypted_app_token, temp_aes_key);
                console.log("typeof app_token: ", typeof (_app_token));
                console.log('app_token: ', JSON.parse(_app_token).app_token);
                app_token = JSON.parse(_app_token).app_token;
                console.log("Check Token Again....\n");
                checkToken(app_token);
                // response.end();
            }

        });
}

// ping();

// checkToken(fb_Token);

// getToken();


function check_getCollection(id) {

}

function check_getBrand(id) {

}

function getProductAtts() {
    // request.get({
    //     url: ' https://localhost.io:3000/convit/listAtts',
    //     qs: null
    // }, function (err, resp, body) {
    //     console.log("BODY:\n", body, "RESP: ", resp);
    // });
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    requestify.get('https://localhost.io:3000/convit/listAtts')
    // requestify.get('https://www.google.com.vn')
    // https://localhost.io:3000/convit/collections
    // requestify.get('https://localhost.io:3000/convit/collections')
        .then(function (response) {
            console.log("Received: ");
            console.log(response.getBody());
        })
}



// ping();

checkToken(fb_Token);

getToken();

getProductAtts();
console.log("Done");