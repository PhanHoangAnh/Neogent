var currentImg;
var currentDataStore;
var connectedGroup = [];

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

function postSensitiveData(uid, token, RSAPublicKey, endpoint, payload, exPayload, fn_cb) {
    var _data = {
        userName: uid,
        password: token,
        data: payload
    };
    aes_key = cryptoUtil.generateAESKey();
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

function openModal(event, elem) {
    $("#myModal").modal();
    baseLine = getBaseLine(elem);
}

function updateProductLists(products) {
    products.forEach(function(obj) {
        var productTemplate = document.getElementById("productTemplate").content;
        var productImage = productTemplate.querySelector('[app-role = "productImage"]');
        var productName = productTemplate.querySelector('[app-role="productName"]');
        var atts = obj.atts;
        var imgAtt;
        var systemSKU = obj['systemSKU'];

        atts.forEach(function(att) {
            var isImg = false;
            if (att['sysId'] == "sysProductName") {
                productName.innerHTML = att["InputValue"];

            }
            if (att['data-controlType'] == 'image' && isImg == false) {
                isImg = true;
                productImage.setAttribute('src', att['InputValue']);
                imgAtt = att['InputValue'];
            }
        });
        productName.id = systemSKU;
        var catLists = document.getElementById('catLists');
        catLists.appendChild(document.importNode(productTemplate, true));
        var rItem = document.getElementById(systemSKU);
        rItem['PRODUCT_IMAGE'] = imgAtt;

    })
}

function createNewCollectionGroup(name, collection) {
    // for create categories function
    var catTemp = document.getElementById("collsTemp").content;
    baseLine.parentNode.insertBefore(document.importNode(catTemp, true), baseLine);
    var rItem = previousElementSibling(baseLine);
    var catsName = rItem.querySelector('[app-role="collsName"]');
    catsName.innerHTML = name;
    rItem["DATASTORE"] = {}
    rItem["DATASTORE"]["name"] = name;
    rItem["DATASTORE"]['productLists'] = [];
    if (collection) {
        rItem["DATASTORE"]['productLists'] = collection["productLists"];
        var image = rItem.querySelector('[app-role="collectionImg"]');
        image.setAttribute('src', collection['img']);
        rItem["DATASTORE"]['img'] = collection['img'];
        var collDesc = rItem.querySelector('[app-role="colDesc"]');
        collDesc.innerHTML = collection["collDesc"];
        rItem["DATASTORE"]['collDesc'] = collection["collDesc"];
        var products = collection["productLists"];
        products.forEach(function(obj) {
            var span = document.getElementById("band").content;
            var productName = span.querySelector('[app-role="band"]')
            productName.innerHTML = obj["name"];
            productName.id = obj['id'];
            var productImg = span.querySelector('[app-role="productImg"]');
            productImg.setAttribute('src', obj['img']);
            var productLists = rItem.querySelector('[app-role="product"]');
            productLists.appendChild(document.importNode(span, true));
        });
    }

    $(rItem).sortable({
        receive: function(e, ui) {
            ui.sender.sortable("cancel");
            var elem = ui.item[0].querySelector('[app-role = "productName"]');
            var systemSKU = elem.id;

            var span = document.getElementById("band").content;
            var s = span.querySelector('[app-role = "band"]');
            var tempObj = {};
            s.innerHTML = elem.innerHTML;
            tempObj.name = elem.innerHTML;
            tempObj.id = elem.id;

            var productImg = span.querySelector('[app-role="productImg"]');
            if (elem["PRODUCT_IMAGE"]) {
                productImg.setAttribute('src', elem['PRODUCT_IMAGE']);
                tempObj.img = elem['PRODUCT_IMAGE'];
            } else {
                productImg.setAttribute('src', "imgs/gamebanner.jpg");
                tempObj.img = "imgs/gamebanner.jpg";
            }
            rItem["DATASTORE"]['productLists'].push(tempObj);
            var productLists = rItem.querySelector('[app-role="product"]');
            productLists.appendChild(document.importNode(span, true));

        }
    });
    connectedGroup.push($(rItem));
    $("#catLists").sortable({
        connectWith: connectedGroup
    }).disableSelection();
    // $("#branchLists").sortable({
    //     connectWith: connectedGroup
    // }).disableSelection();
    var deleteButton = rItem.querySelector('[app-role="deleteColls"]');
    deleteButton.addEventListener('click', function() {
        rItem.parentNode.removeChild(rItem);
    }, false);
    var changeCollImage = rItem.querySelector('[app-role="changeCollImage"]');
    changeCollImage.addEventListener('click', function() {
        currentImg = rItem.querySelector('[app-role = "collectionImg"]');
        currentDataStore = rItem;
        $("#m_wall").modal();
    }, false);
    var img = rItem.querySelector('[app-role="collectionImg"]');
    $(img).popover({
        title: function() {
            var popoverHeader = document.getElementById('popoverHeader').content;
            return document.importNode(popoverHeader, true);
        },
        html: true,
        content: function() {
            var collDescElem = document.getElementById("collDescElem").content;
            return document.importNode(collDescElem, true);
        },
        trigger: 'none'

    });
    img.addEventListener('click', function() {
        $(img).popover('toggle');
    }, false);
    $(img).on('hidden.bs.popover', function() {
        var mainPad = findElem(img, "mainPad");
        var colDesc = mainPad.querySelector('[ app-role = "colDesc"]');
        rItem["DATASTORE"]['collDesc'] = colDesc.innerHTML;
    });
    $(img).on('shown.bs.popover', function() {
        var mainPad = findElem(img, "dataHandler");
        var colDesc = mainPad.querySelector('[ app-role = "colDesc"]');
        var descInput = mainPad.querySelector('[app-role = "descInput"]');
        descInput.value = colDesc.innerHTML;
        var nameInput = mainPad.querySelector('[app-role="nameInput"]');
        var oldName = mainPad.querySelector('[app-role="collsName"]');
        nameInput.value = oldName.innerHTML;
    });
    return rItem;
}

function createNew() {
    var catName = document.getElementById("catName").value;
    createNewCollectionGroup(catName);
}

function getBaseLine(elem) {
    if (elem.parentNode.getAttribute('app-role') == 'baseLine') {
        return elem.parentNode;
    } else {
        return getRowCover(elem.parentNode);
    }
}

function previousElementSibling(elem) {
    do {
        elem = elem.previousSibling;
    } while (elem && elem.nodeType !== 1);
    return elem;
}

options = {
    imageBox: '#wallImg',
    thumbBox: '#thumbWall',
    spinner: '#spinnerWall',
    imgSrc: ''
}

var neo_cropper = new cropbox(options, wallPreview);


function initWall(el) {
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
    if (currentImg) {
        currentImg.setAttribute('src', data);
        currentDataStore["DATASTORE"]["img"] = data;
    }
}

function attImgRatio_change(evt, elem) {
    var appRole = elem.getAttribute("app-role");
    var attImgXRatio = 16;
    var attImgYRatio = 9
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

function deleteProduct(elem) {

    var productElem = findElem(elem, "productElement");
    var systemSKU = productElem.querySelector('[app-role="band"]').id;
    if (!systemSKU) {
        systemSKU = "";
    }
    var dataHandler = findElem(productElem, "dataHandler");
    var products = dataHandler["DATASTORE"]["productLists"];
    var deleteObj;
    dataHandler["DATASTORE"]["productLists"].forEach(function(obj) {
        // console.log('systemSKU: ', systemSKU, ' obj.id: ', obj.id, obj.id == systemSKU);
        if (obj.id == systemSKU && obj.name == productElem.querySelector('[app-role="band"]').innerHTML) {
            deleteObj = obj;
            return false;
        }
    });
    console.log('deleteObj: ', deleteObj);
    if (products instanceof Array && products.indexOf(deleteObj) !== -1) {
        products.splice(products.indexOf(deleteObj), 1);
    }
    productElem.parentNode.removeChild(productElem);

}

function updateDesc(elem) {
    var mainPad = findElem(elem, "dataHandler");
    var colDesc = mainPad.querySelector('[ app-role = "colDesc"]');
    colDesc.innerHTML = elem.value;
    mainPad["DATASTORE"]['collDesc'] = elem.value;
}

function updateName(elem) {
    var mainPad = findElem(elem, "dataHandler");
    var catsName = mainPad.querySelector('[app-role="collsName"]');
    catsName.innerHTML = elem.value;
    mainPad["DATASTORE"]['name'] = elem.value;
}

function closePop(elem) {
    $(elem).parents(".popover").popover('hide');
}

function findElem(el, att) {
    if (el.getAttribute("app-role") !== att) {
        return findElem(el.parentNode, att);
    } else {
        return el;
    }
}

//business region
function saveCollection() {
    var dataHandlers = document.querySelectorAll('[app-role="dataHandler"]');
    var savedData = [];
    dataHandlers.forEach(function(obj) {
        savedData.push(obj['DATASTORE']);
    });
    var endpoint = 'update';
    postSensitiveData(fbId, systoken, RSAPublicKey, endpoint, null, savedData, fn_cb);
    console.log(savedData);

    function fn_cb(returnObj) {
        console.log(returnObj)
    }
}

function reloadCollections(collections) {
    elem = document.getElementById("createCat");
    baseLine = getBaseLine(elem);
    if (collections instanceof Array) {
        collections.forEach(function(coll) {
            var result = createNewCollectionGroup(coll['name'], coll);
        })
    }
}
