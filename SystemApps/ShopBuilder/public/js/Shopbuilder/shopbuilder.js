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
    var currentUrl = '../../getToken';
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
                //for testing only                
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
    var currentUrl = '../../checkToken';
    $.ajax({
        // url: './userToken',
        url: currentUrl,
        cache: false,
        method: 'POST',
        headers: { "cache-control": "no-cache" },
        data: json_data,
        // contentType:'application/json',
        complete: function(data, status, jqXHR) {
            // console.log(data);
            // if (data.status == 401 || !data.responseJSON.auth) {
            //     window.location = "/";
            // }
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


function openIconModal(evt) {
    $(m_icon).modal("show");
}

function openBackgroundModal(evt) {
    $(m_wall).modal("show");
}

function initIcon(el) {
    options = {
        imageBox: '#iconImg',
        thumbBox: '#thumbIcon',
        spinner: '#spinnerIcon',
        imgSrc: ''
    }
    var reader = new FileReader();
    cropper = new cropbox(options, iconPreview);
    reader.onload = function(e) {
        options.imgSrc = e.target.result;
        cropper.resetOption(options);
    }
    reader.readAsDataURL(el.files[0]);
    //el.files = [];
    document.querySelector('#icon_btnZoomIn').addEventListener('click', function() {
        cropper.zoomIn();
    })
    document.querySelector('#icon_btnZoomOut').addEventListener('click', function() {
        cropper.zoomOut();
    })
    $('#m_icon').on('hidden.bs.modal', function() {
        // console.log('close modal:');
        document.getElementById('iconHolder').setAttribute('src', img_Icon);
        document.getElementById('logo').setAttribute('src', img_Icon);
        // upload icon
        // uploadImage("avatars");
    });
    $('#m_icon').on('shown.bs.modal', function() {
        cropper.resetOption(options);
    });

    function iconPreview(data) {
        //console.log('imgdata: ', data);
        img_Icon = data;
        document.getElementById('icon_preview').setAttribute('src', data);
        document.getElementById('icon_preview-md').setAttribute('src', data);
        document.getElementById('icon_preview-sm').setAttribute('src', data);
        //document.getElementById('Img_Avatar').setAttribute('src',data);
    }

};

var img_Icon;
var img_Wall;

function initWall(el) {
    // console.log("initWall..");    
    // document.getElementById("wallImg").style.height = screen.height + "px";
    // document.getElementById("thumbWall").style.height = screen.height + "px";
    options = {
        imageBox: '#wallImg',
        thumbBox: '#thumbWall',
        spinner: '#spinnerWall',
        imgSrc: ''
    }
    var reader = new FileReader();
    cropper = new cropbox(options, wallPreview);
    reader.onload = function(e) {
        options.imgSrc = e.target.result;
        cropper.resetOption(options);
    }
    reader.readAsDataURL(el.files[0]);
    //el.files = [];
    document.querySelector('#wall_btnZoomIn').addEventListener('click', function() {
        cropper.zoomIn();
    })
    document.querySelector('#wall_btnZoomOut').addEventListener('click', function() {
        cropper.zoomOut();
    })
    $('#m_wall').on('hidden.bs.modal', function() {

        var masthead = document.getElementById('masthead');
        var prop = "#f3f3f3 url('" + img_Wall + "') no-repeat right top"
        masthead.style.background = prop;

        masthead.classList.remove("hiddenElem");
        // masthead.addClass('start');
        setTimeout(function() {
            masthead.classList.add('start');
        }, 100);
        // upload wall
        // uploadImage("walls");

    });
    $('#m_wall').on('shown.bs.modal', function() {
        cropper.resetOption(options);
    });

    function wallPreview(data) {

        img_Wall = data;
        document.getElementById('wall_preview').setAttribute('src', data);
        document.getElementById('wall_preview-md').setAttribute('src', data);
        document.getElementById('wall_preview-sm').setAttribute('src', data);
        document.getElementById("openInput").classList.add("hiddenElem");
        document.getElementById('wallHolder').setAttribute('src', data);
    }

};
