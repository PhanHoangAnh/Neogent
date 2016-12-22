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

function createNewCategoriesGroup(name) {
    var catTemp = document.getElementById("catGroupTemp").content;
    baseLine.parentNode.insertBefore(document.importNode(catTemp, true), baseLine);
    var rItem = previousElementSibling(baseLine);
    var catsName = rItem.querySelector('[app-role="catsName"]');
    catsName.innerHTML = name;
    rItem["DATASTORE"] = {}
    rItem["DATASTORE"]["name"] = name;
    rItem["DATASTORE"]['cats'] = [];
    rItem["DATASTORE"]['brands'] = [];
    $(rItem).sortable({
        receive: function(e, ui) {
            ui.sender.sortable("cancel");
            var span = document.getElementById("band").content;
            var s = span.querySelector('[app-role = "band"]');
            s.innerHTML = ui.item[0].querySelector('[app-role="content"]').innerHTML;
            var appRole = ui.item[0].getAttribute("app-role");
            if (appRole == "category") {
                var cat = rItem.querySelector('[app-role="categories"]');
                if (rItem["DATASTORE"]['cats'].indexOf(s.innerHTML) == -1) {
                    cat.appendChild(document.importNode(span, true));
                    rItem["DATASTORE"]['cats'].push(s.innerHTML);
                }
            }
            if (appRole == "brand") {
                var brand = rItem.querySelector('[app-role="brandname"]');
                if (rItem["DATASTORE"]['brands'].indexOf(s.innerHTML) == -1) {
                    brand.appendChild(document.importNode(span, true));
                    rItem["DATASTORE"]['brands'].push(s.innerHTML);
                }
            }
        }
    });
    connectedGroup.push($(rItem));

    $("#brandLists").sortable({
        connectWith: connectedGroup
    }).disableSelection();
    $("#catLists").sortable({
        connectWith: connectedGroup
    }).disableSelection();

    var deleteButton = rItem.querySelector('[app-role="deleteCats"]');
    deleteButton.addEventListener('click', function() {
        connectedGroup.splice(connectedGroup.indexOf($(rItem)), 1);
        rItem.parentNode.removeChild(rItem);
    }, false);
    var changeCatImage = rItem.querySelector('[app-role="changeCatImage"]');
    changeCatImage.addEventListener('click', function() {
        currentImg = rItem.querySelector('[app-role = "categoryImg"]');
        currentDataStore = rItem;
        $("#m_wall").modal();
    }, false);
    return rItem;

}

function readTitleAndDesc(el) {
    function findcatGroup(el) {
        if (el.parentNode.getAttribute("app-role") == "catGroup") {
            return el.parentNode;
        } else {
            return findcatGroup(el.parentNode);
        }
    }
    var catGroup = findcatGroup(el);
    if (el.getAttribute("app-role") == "catTitle") {
        catGroup["DATASTORE"]["Tilte"] = el.value;
    } else {
        catGroup["DATASTORE"]["Desc"] = el.value;
    }
}

function deleteCatBrands(elem) {
    var bandCover = getElement(elem, "bandCover");
    var catGroup = getElement(elem, "catGroup");
    var roles = findElemRoles(elem).getAttribute("app-role");
    var itemContent = bandCover.querySelector('[app-role="band"]').innerHTML
    var data;
    switch (roles) {
        case "categories":
            data = catGroup["DATASTORE"]["cats"];
            break;
        case "brandname":
            data = catGroup["DATASTORE"]["brands"];
            break;
    }
    data.splice(data.indexOf(itemContent), 1)
    bandCover.parentNode.removeChild(bandCover);

    function findElemRoles(el) {
        if (el.getAttribute("base-role") !== "handler") {
            return findElemRoles(el.parentNode)
        } else {
            return el;
        }
    }
}

function getElement(el, att) {
    if (el.parentNode.getAttribute('app-role') == att) {
        return el.parentNode;
    } else {
        return getElement(el.parentNode, att);
    }
}

function createNew() {
    var catName = document.getElementById("catName").value;
    createNewCategoriesGroup(catName);
}

function getBaseLine(elem) {
    if (elem.parentNode.getAttribute('app-role') == 'baseLine') {
        return elem.parentNode;
    } else {
        return getBaseLine(elem.parentNode);
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
    }
    if (currentDataStore) {
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
//
function saveCatAndBrands() {
    var saveElems = document.querySelectorAll('[app-role="catGroup"]');
    var saveDataStores = [];
    saveElems.forEach(function(obj) {
        obj["DATASTORE"].type = "catGroup"
        saveDataStores.push(obj["DATASTORE"]);
    });
    saveElems = document.querySelectorAll('[app-role="icon"]');
    saveElems.forEach(function(obj) {
        var iteratedObj = {}
        iteratedObj.type = "brand"
        iteratedObj['img'] = obj.getAttribute('src');
        iteratedObj['name'] = obj.name;
        saveDataStores.push(iteratedObj);
    })

    var endpoint = 'update';
    // console.log("saveDataStores: ", saveDataStores);
    // postSensitiveData(fbId, systoken, RSAPublicKey, endpoint, shopInfo, fn_cb);
    postSensitiveData(fbId, systoken, RSAPublicKey, endpoint, null, saveDataStores, fn_cb);

    function fn_cb(returnObj) {
        console.log(returnObj)
    }
}

function generateCatGroups(groups) {
    var newId = 0;
    groups.filter(function(item) {
        baseLine = getBaseLine(document.getElementById('createCat'))
        var rItem = createNewCategoriesGroup(item['name']);
        var img = rItem.querySelector('[app-role="categoryImg"]');
        img.setAttribute("src", "/" + item['img']);
        rItem["DATASTORE"] = {}
        rItem["DATASTORE"]["name"] = item['name'];
        rItem["DATASTORE"]['cats'] = item['cats'];
        rItem["DATASTORE"]['brands'] = item['brands'];
        rItem["DATASTORE"]['img'] = item['img'];
        var catLine = rItem.querySelector('[app-role="categories"]');
        var brandLine = rItem.querySelector('[app-role="brandname"]');
        item.cats.filter(function(obj) {
            var span = document.getElementById("band").content;
            var s = span.querySelector('[app-role = "band"]');
            s.innerHTML = obj;
            catLine.appendChild(document.importNode(span, true));
        });
        item.brands.filter(function(obj) {
            var span = document.getElementById("band").content;
            var s = span.querySelector('[app-role = "band"]');
            s.innerHTML = obj;
            brandLine.appendChild(document.importNode(span, true));
        });
    });
    // update items for categories and brandnames
    var brandnames = shopInfo.brandNames;
    var categories = shopInfo.categories;

    for (var i = 0; i < brandnames.length; i++) {
        with({ n: i }) {
            var brandcats = document.getElementById("brandcats").content;
            var span = brandcats.querySelector('[app-role = "content"]')
            span.id = "br_" + n;
            span.innerHTML = brandnames[n]['name'];
            var item = document.importNode(brandcats, true);
            document.getElementById("brandLists").appendChild(document.importNode(brandcats, true));
            var rItem = document.getElementById(span.id);
            rItem.parentNode.setAttribute("app-role", "brand");

            var brandPad = document.getElementById("brandTemp").content;
            var legend = brandPad.querySelector('[app-role="setsName"]');
            var image = brandPad.querySelector('[app-role="icon"]');
            var contentId = "contentId_" + n;
            var cats = brandPad.querySelector('[app-role = "cats"]');
            cats.id = contentId;
            if (brandnames[n]['img']) {
                image.setAttribute('src', brandnames[n]['img']);
            }
            image.name = brandnames[n]['name']
            legend.innerHTML = brandnames[n]['name'];
            document.getElementById("brandPad").appendChild(document.importNode(brandPad, true));
            cats = document.getElementById(contentId);

            for (var j = 0; j < brandnames[n]['categories'].length; j++) {
                (function(m) {
                    console.log(m);
                    var brandcats = document.getElementById("smallCat").content;
                    var span = brandcats.querySelector('[app-role = "band"]')
                    span.id = "catContent_" + n;
                    span.innerHTML = brandnames[n]['categories'][m];
                    cats.appendChild(document.importNode(brandcats, true));
                })(j);
            }

        }
    }

    for (var i = 0; i < categories.length; i++) {
        with({ n: i }) {

            var brandcats = document.getElementById("brandcats").content;
            var span = brandcats.querySelector('[app-role = "content"]')
            span.id = "br_" + n;
            span.innerHTML = categories[n];
            var item = document.importNode(brandcats, true);
            // item.innerHTML = categories[n];
            // item.id = "cat_" + n;
            //item.setAttribute("app-role", "category")
            document.getElementById("catLists").appendChild(item);
            var rItem = document.getElementById(span.id);
            //rItem.innerHTML = categories[n];
            rItem.parentNode.setAttribute("app-role", "category");

        }
    }
}

function changeBrandBackground(elem) {

    var brandGroup = getElement(elem, "brandGroup");
    currentImg = brandGroup.querySelector('[app-role="icon"]');
    currentDataStore = null;
    //console.log("changeBrandBackground", currentImg);
    $("#m_wall").modal();
}
