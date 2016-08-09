var systoken;
var fbId;
var fbToken;
var conBnt;
var RSAPublicKey;
$(document).ready(function() {
    var bntFbLogin = document.getElementById('bntFbLogin');
    var fb = new fbHandler(getStatus, bntFbLogin);

    function getStatus(objFb) {
        // console.log(objFb);
        if (objFb.loginStatus == "connected") {
            removedElement = document.querySelector("[app-role = 'removeAfterLogin']");
            var fbPad = document.getElementById("FbPad").content;
            var fbAvatar = fbPad.querySelector('[app-role = "fbAvatar"]');
            var fbName = fbPad.querySelector('[app-role = "fbName"]');
            fbAvatar.setAttribute("src", objFb.fbAvatar);
            fbName.innerHTML = objFb.fbName;
            fbId = objFb.fbId;
            fbToken = objFb.fbToken;
            if (!systoken) {
                systoken = localStorage.getItem("app_token");
                checkToken(objFb.fbId, systoken, RSAPublicKey, afterCheckToken);
            } else {
                getToken(fbId, fbToken, RSAPublicKey, afterGetToken);
            }

            var parent = removedElement.parentNode;
            parent.removeChild(removedElement);
            parent.appendChild(document.importNode(fbPad, true));
            // btn-primary
            // conBnt = document.getElementById('bntCon');
            // conBnt.classList.add('btn-info');
            // conBnt.innerHTML = "Get system Token";

        }
    }

    function afterGetToken(token) {
        systoken = token;
        console.log("from afterGetToken: ", token);
    }

    function afterCheckToken(result) {
        if (result.errNum != 0) {
            getToken(fbId, fbToken, RSAPublicKey, afterGetToken);
            return;
        }
    }


    function getToken(uid, fbToken, RSAPublicKey, fn_cb) {
        var _data = {
            userName: uid,
            password: fbToken
        };
        aes_key = cryptoUtil.generateAESKey();
        var json_data = {
            data: cryptoUtil.EncryptJSON(_data, RSAPublicKey, aes_key)
        };
        // Make post request to getToken Endpoint
        var currentUrl = '../getToken';
        $.ajax({
            // url: './userToken',
            url: currentUrl,
            method: 'POST',
            data: json_data,
            // data: compObj,
            complete: function(data, status, jqXHR) {
                if (!data.responseJSON.errNum) {
                    var encrypted_app_token = data.responseJSON.encrypted_app_token;
                    var _app_token = cryptoUtil.aesDecryptor(encrypted_app_token, aes_key);
                    app_token = JSON.parse(_app_token).app_token;
                    localStorage.setItem("app_token", app_token);
                    if (fn_cb) {
                        fn_cb(app_token);
                    }
                }
            }
        });
    }

    function checkToken(uid, token, RSAPublicKey, fn_cb) {
        var _data = {
            userName: uid,
            password: token
        };
        aes_key = cryptoUtil.generateAESKey();
        var json_data = {
            data: cryptoUtil.EncryptJSON(_data, RSAPublicKey, aes_key)
        };
        var currentUrl = '../checkToken';
        $.ajax({
            // url: './userToken',
            url: currentUrl,
            cache: false,
            method: 'POST',
            headers: { "cache-control": "no-cache" },
            data: json_data,
            // contentType:'application/json',
            complete: function(data, status, jqXHR) {

                if (data.status == 401) {
                    window.location = "/";
                }
                if (fn_cb) {

                    fn_cb(data.responseJSON);
                }

            }
        });
    }

    function postSensitiveData(uid, token, RSAPublicKey, endpoint, payload, fn_cb) {
        var _data = {
            userName: uid,
            password: token,
            data: payload
        };
        aes_key = cryptoUtil.generateAESKey();
        var json_data = {
            data: cryptoUtil.EncryptJSON(_data, RSAPublicKey, aes_key)
        };

        $.ajax({
            // url: './userToken',
            url: endpoint,
            cache: false,
            method: 'POST',
            headers: { "cache-control": "no-cache" },
            data: json_data,
            // contentType:'application/json',
            complete: function(data, status, jqXHR) {
                if (fn_cb) {
                    fn_cb(data.responseJSON);
                }

            }
        });
    }

});
