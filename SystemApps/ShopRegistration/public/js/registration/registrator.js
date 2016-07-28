function getToken(uid, fbToken, RSAPublicKey) {
    var _data = {
        userName: uid,
        password: fbToken
    };
    aes_key = cryptoUtil.generateAESKey();
    var json_data = {
        data: cryptoUtil.EncryptJSON(_data, RSAPublicKey, aes_key)
    };
    // Make post request to getToken Endpoint
    var currentUrl = window.location.href + 'getToken';
    console.log(currentUrl);
    $.ajax({
        // url: './userToken',
        url: currentUrl,
        method: 'POST',
        data: json_data,
        // data: compObj,
        complete: function(data, status, jqXHR) {
            // var obj = JSON.parse(data.responseText);
            if (!data.responseJSON.errNum) {

                console.log(data.responseJSON);
                var encrypted_app_token = data.responseJSON.encrypted_app_token;
                    // console.log('encrypted_app_token: ', encrypted_app_token);
                var _app_token = cryptoUtil.aesDecryptor(encrypted_app_token, aes_key);
                    // console.log("typeof app_token: ", typeof(_app_token));
                console.log('app_token: ', JSON.parse(_app_token));
                app_token = JSON.parse(_app_token).app_token;
                localStorage.setItem("app_token", app_token);

            } else {

            }
        }
    });
}
