var aes_key;

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
                    getToken(fbId, fbToken, RSAPublicKey, afterGetToken);
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

function postSensitiveData(uid, token, RSAPublicKey, endpoint, payload, exPayload, fn_cb) {
    var _data = {
        userName: uid,
        password: token,
        data: payload
    };
    // aes_key = cryptoUtil.generateAESKey();    
    var json_data = {
        data: cryptoUtil.EncryptJSON(_data, RSAPublicKey, aes_key),
        exPayload: exPayload
    };

    $.ajax({
        // url: './userToken',
        url: endpoint,
        cache: false,
        method: 'POST',
        contentType: "application/json; charset=utf-8",
        headers: { "cache-control": "no-cache" },
        data: JSON.stringify(json_data),
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

var currentImage;

function openBackgroundModal(evt) {
    currentImage = this;
    $(m_wall).modal("show");
}

icon_options = {
    imageBox: '#iconImg',
    thumbBox: '#thumbIcon',
    spinner: '#spinnerIcon',
    imgSrc: ''
}

var cropper = new cropbox(icon_options, iconPreview);

function initIcon(el) {
    var reader = new FileReader();
    if (!cropper) {
        cropper = new cropbox(icon_options, iconPreview);
    }
    reader.onload = function(e) {
        icon_options.imgSrc = e.target.result;
        cropper.resetOption(icon_options);
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
        cropper.resetOption(icon_options);
    });


};

function iconPreview(data) {
    //console.log('imgdata: ', data);
    //shopInfo.avatars = data;
    img_Icon = data;
    document.getElementById('icon_preview').setAttribute('src', data);
    document.getElementById('icon_preview-md').setAttribute('src', data);
    document.getElementById('icon_preview-sm').setAttribute('src', data);
    //document.getElementById('Img_Avatar').setAttribute('src',data);
}

var img_Icon;
var img_Wall;

options = {
    imageBox: '#wallImg',
    thumbBox: '#thumbWall',
    spinner: '#spinnerWall',
    imgSrc: ''
}

var neo_cropper = new cropbox(options, wallPreview);


function initWall(el) {
    // console.log("initWall..");    
    // document.getElementById("wallImg").style.height = screen.height + "px";
    // document.getElementById("thumbWall").style.height = screen.height + "px";


    var reader = new FileReader();
    if (!neo_cropper) {
        neo_cropper = new cropbox(options, wallPreview);
    }
    reader.onload = function(e) {
        options.imgSrc = e.target.result;
        neo_cropper.resetOption(options);
    }
    reader.readAsDataURL(el.files[0]);
    //el.files = [];
    document.querySelector('#wall_btnZoomIn').addEventListener('click', function() {
        neo_cropper.zoomIn();
    })
    document.querySelector('#wall_btnZoomOut').addEventListener('click', function() {
        neo_cropper.zoomOut();
    })
    $('#m_wall').on('hidden.bs.modal', function() {

        var masthead = document.getElementById('masthead');
        //var prop = "#f3f3f3 url('" + img_Wall + "') no-repeat right top"
        //masthead.style.background = prop;

        masthead.classList.remove("hiddenElem");
        // masthead.addClass('start');
        setTimeout(function() {
            masthead.classList.add('start');
        }, 100);
        // upload wall
        // uploadImage("walls");

    });
    $('#m_wall').on('shown.bs.modal', function() {
        neo_cropper.resetOption(options);
    });



};

function wallPreview(data) {
    img_Wall = data;
    document.getElementById('wall_preview').setAttribute('src', data);
    document.getElementById('wall_preview-md').setAttribute('src', data);
    document.getElementById('wall_preview-sm').setAttribute('src', data);
    //document.getElementById("openInput").classList.add("hiddenElem");
    //document.getElementById('wallHolder').setAttribute('src', data);
    if (currentImage) {
        currentImage.setAttribute('src', data);
    }
}


// Update post object section

$(document).ready(function() {
    var inputs = document.querySelectorAll('[app-input]');
    // console.log("available input: ", inputs);
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("change", updateShopInfo, false);
        inputs[i].parentNode.classList.add("missing");
    }
});

function updateShopInfo(evt) {
    var att = this.getAttribute("app-input");
    this.parentNode.classList.remove("missing");
    shopInfo[att] = this.value;
}

var attImgXRatio = 16;
var attImgYRatio = 9;

function attImgRatio_change(evt, elem) {
    var appRole = elem.getAttribute("app-role");

    if (appRole == "attImgXRatio") {
        attImgXRatio = elem.value;
    } else if (appRole == "attImgYRatio") {
        attImgYRatio = elem.value;
    }
    var ratio = attImgYRatio / attImgXRatio
    var imageBox = document.getElementById("wallImg");
    var thumbBox = document.getElementById("thumbWall");
    var realWidth = imageBox.getBoundingClientRect().width;
    var realHeight = imageBox.getBoundingClientRect().height
    var applyHeight = realWidth * ratio + 'px'
    thumbBox.style.height = applyHeight;
    imageBox.style.height = applyHeight;
}

var current_staticContent;

function addMoreStaticContent(el, content) {
    var root = getRowCover(el).parentNode;
    var staticContentTempplate = document.getElementById("textAreaInput").content;
    root.insertBefore(document.importNode(staticContentTempplate, true), getRowCover(el));
    var contentPad = previousElementSibling(getRowCover(el));
    var deleteBnt = contentPad.querySelector('[app-role ="deleteBnt"]')
    deleteBnt.addEventListener('click', function() {
        contentPad.parentNode.removeChild(contentPad);
    }, false);
    // upgrade feature
    // var dynamicContent = contentPad.querySelector('[app-role = "dynamicContent"]');
    // var FontAttributor = Quill.import('attributors/class/font');
    // FontAttributor.whitelist = [
    //     'sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu'
    // ];
    // Quill.register(FontAttributor, true);

    // follow http://codepen.io/anon/pen/NbWJGb
    var icons = Quill.import('ui/icons');
    // icons['bgcolor'] = '<i app-role ="bgcolor" class="fa fa-sticky-note-o" aria-hidden="true"></i>';
    icons['bgcolor'] = '<i app-role ="bgcolor" class="fa fa-sticky-note-o" aria-hidden="true"></i>';

    var dynamicContent = contentPad.querySelector('[app-role = "dynamicContent"]');
    if (!content) {
        var quill = new Quill(dynamicContent, {
            modules: {
                formula: false,
                syntax: false,
                toolbar: toolbarOptions

            },
            placeholder: 'Compose an epic...',
            theme: 'snow'
        });
    } else {
        // contentPad.querySelector('[app-role="static_content"]').value = JSON.stringify(content);
        //update featrue
        var fragment = document.createRange().createContextualFragment(json2html(content));
        dynamicContent.appendChild(fragment);
        var quill = new Quill(dynamicContent, {
            modules: {
                formula: false,
                syntax: false,
                toolbar: toolbarOptions

            },
            theme: 'snow'
        });
        //
    }

    var bgcolor = contentPad.querySelector('[app-role ="bgcolor"]');
    bgcolor.addEventListener('click', function() {
        current_staticContent = dynamicContent;
        console.log(current_staticContent);
        document.getElementById('colorPicker').click();
    });

}

var imgId = 0

function addMoreBackgroundImg(el, image) {
    var root = document.getElementById("imageHandler");
    var staticBackGroundImg = document.getElementById("imgInput").content
    imgId++;
    var _img = staticBackGroundImg.querySelector('[app-role ="imgBackground"]')
    _img.id = "img_" + imgId;
    root.appendChild(document.importNode(staticBackGroundImg, true));
    var img = document.getElementById("img_" + imgId);
    img.addEventListener('click', openBackgroundModal, false);
    var deleteBnt = img.parentNode.querySelector('[app-role ="deleteBnt"]')
    deleteBnt.addEventListener('click', function() {
        img.parentNode.parentNode.removeChild(img.parentNode);
    }, false);
    if (image) {
        console.log("image: ", image);
        img.setAttribute('src', window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/" + image);
    }
}

function getRowCover(elem) {
    if (elem.parentNode.getAttribute('app-role') == 'rowCover') {
        return elem.parentNode;
    } else {
        return getRowCover(elem.parentNode);
    }
}

//http://stackoverflow.com/questions/9008732/does-previoussibling-always-return-the-parents-text-node-first
function previousElementSibling(elem) {
    do {
        elem = elem.previousSibling;
    } while (elem && elem.nodeType !== 1);
    return elem;
}

function updatePage(elem) {
    var controlType = elem.getAttribute("app-input");
    if (controlType == "companyName") {
        document.getElementById("companyName").innerHTML = elem.value;
    }
}

function saveShopInfo() {

    var exPayload = {}
    exPayload.walls = []
    exPayload.staticContent = [];
    var wallHandlers = document.querySelectorAll('[app-role ="imgBackground"]');
    wallHandlers.forEach(function(img) {
        if (img.getAttribute('src').indexOf("data:image/png;base64") !== -1) {
            exPayload.walls.push(img.getAttribute('src'));
        } else {
            exPayload.walls.push(img.getAttribute('src').replace(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/", ""));
        }
    });
    // var staticContentHandler = document.querySelectorAll('[app-role="static_content"]');
    // staticContentHandler.forEach(function(elem) {
    //     exPayload.staticContent.push(elem.value);
    // })
    if (document.getElementById('iconHolder').getAttribute('src').indexOf("data:image/png;base64") !== -1) {
        exPayload.avatars = document.getElementById('iconHolder').getAttribute('src');
    } else {
        exPayload.avatars = document.getElementById('iconHolder').getAttribute('src').replace(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/", "");
    }


    // upgrade features
    var dynamicContentHandler = document.querySelectorAll('[app-role="dynamicContent"]');
    var orderNumber = 1;
    dynamicContentHandler.forEach(function(dyc) {
        var html = dyc.innerHTML;
        var jsonHtml = html2json(html);
        jsonHtml.orderNumber = orderNumber;
        orderNumber++;
        exPayload.staticContent.push(JSON.stringify(jsonHtml));
        // console.log("jsonHtml: ", jsonHtml);
    });
    // console.log("staticContent: ", exPayload.staticContent);
    //
    var atts = document.querySelectorAll("[app-input]");
    var pendding = false;
    for (var i = 0; i < atts.length; i++) {
        if (!atts[i].value) {
            pendding = true;
            // add class that indicate require fields
            console.log(atts[i]);
            atts[i].parentNode.classList.add("missing");
        }
    }
    //console.log("shopInfo: ", shopInfo);    
    console.log(pendding);
    if (!pendding) {
        // sending shopInfo to server
        var endpoint = 'updateShop';
        // postSensitiveData(fbId, systoken, RSAPublicKey, endpoint, shopInfo, fn_cb);
        // delete duplicate and unnecessary attribute to reduce workload of encrypter
        delete shopInfo.staticContent;
        delete shopInfo.walls;
        postSensitiveData(fbId, systoken, RSAPublicKey, endpoint, shopInfo, exPayload, fn_cb);

        function fn_cb(returnObj) {
            console.log(returnObj)
            if (returnObj['errNum'] == 2) {

            }
        }
    }

}

function loadShopInfo(shopInfo) {
    var inputs = document.querySelectorAll('[app-input]');
    for (var i in shopInfo) {
        if (i == "staticContent" && shopInfo[i] instanceof Array) {
            var addMoreSC = document.getElementById("AddmoreStaticContent");
            shopInfo[i].filter(function(obj) {
                addMoreStaticContent(addMoreSC, obj);
            });
        } else if (i == "walls" && shopInfo[i] instanceof Array) {
            var addMoreBG = document.getElementById('AddmoreBackrgound');
            shopInfo[i].filter(function(obj) {
                addMoreBackgroundImg(addMoreBG, obj);
            })
        } else if (i == "avatars") {
            var imgPath = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/" + shopInfo[i];
            document.getElementById('logo').setAttribute('src', imgPath);
            document.getElementById('iconHolder').setAttribute('src', imgPath);

        } else {
            inputs.forEach(function(item) {
                // console.log("item Attribute: ", item.getAttribute('app-input'));
                if (item.getAttribute('app-input') == i) {
                    item.value = shopInfo[i];
                }
                if (i == "companyName") {
                    document.getElementById("companyName").innerHTML = shopInfo[i];
                }
            })
        }
    }
};

var colorPicker = document.getElementById('colorPicker')
colorPicker.addEventListener("input", function() {
    current_staticContent.style.backgroundColor = colorPicker.value;
});

// adding feature to googlemap

// var mapCover = document.getElementById("mapCover")


// mapCover.addEventListener('click', function() {
//    google.maps.event.trigger(window, 'resize', {});
// })
