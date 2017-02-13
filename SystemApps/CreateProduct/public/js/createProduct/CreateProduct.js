$(function() {
    var productAttributes = document.querySelector("#productAttributes");
    $(".connectedSortable").sortable({
        connectWith: $(productAttributes),
        cursor: "move",
        remove: function(e, ui) {

        },
        receive: function(e, ui) {
            // 
            if (ui.item[0].getAttribute("app-role") == "optionSet") {
                // Do some stuff here        
                var root = document.getElementById("productAttributes");
                // clear root first
                while (root.firstChild) {
                    root.removeChild(root.firstChild);
                }
                create_productAttributes(ui.item[0]["CUST"]["components"]);
            }
            ui.sender.sortable("cancel");
        },
        placeholder: "ui-sortable-placeholder",
        out: function(event, ui) {}

    });
})

function requestOptionSets() {
    // Get Attributes List from server
    // var currentUrl = window.location.href + "getOptionSets"  
    var urlPath = window.location.href;
    var currentUrl = "getOptionSets"
    $.ajax({
        // url: './userToken',
        url: currentUrl,
        method: 'GET',
        // data: compObj,
        complete: function(data, status, jqXHR) {

            if (!data.responseJSON.err) {
                // console.log(data.responseJSON.doc);
                createOptionSetPanel(data.responseJSON.doc);
            } else {
                console.log(data.responseJSON.err)
            }
        }
    });

    // history.pushState({}, null, urlPath);
    // document.location = urlPath;
    // end of Get Attributes List from server
};
var newId = 0;

function createOptionSetPanel(optSet) {
    var _root = document.getElementById("LoadOptionSets");
    while (_root.firstChild) {
        _root.removeChild(_root.firstChild);
    }
    var optionSetTemplate = document.getElementById("optionSet").content;
    for (var i in optSet) {
        newId++;
        var optionSetName = optionSetTemplate.querySelector('[app-role="setsName"]');
        optionSetName.innerHTML = optSet[i]["setName"];
        optionSetName.style = "border-bottom: 1px solid #555;";
        var tempContainer = optionSetTemplate.querySelector('[app-role = "optionSet"]');
        tempContainer.id = newId;
        _root.appendChild(document.importNode(optionSetTemplate, true));
        var realNode = document.getElementById(newId);
        realNode["CUST"] = optSet[i];
    }
};

function create_productAttributes(prop, destination) {
    var _root;
    if (!destination) {
        _root = document.getElementById("productAttributes");
    } else {
        _root = document.getElementById("systemAttributes");
    }

    for (var i in prop) {
        newId++;
        // create template
        var controlTemplate = document.getElementById("controlTemplate").content
        controlTemplate.querySelector('[data-controltype="label"]').innerHTML = prop[i]["attributes"]["label"];
        controlTemplate.querySelector('[data-controltype="describe"]').innerHTML = prop[i]["attributes"]['describe'];
        var inputHandler = controlTemplate.querySelector('[app-role="inputHandler"]');
        inputHandler.id = newId;
        _root.appendChild(document.importNode(controlTemplate, true));
        var rHandler = document.getElementById(newId);
        createInputObject(rHandler, prop[i]["data-controlType"], prop[i]["attributes"], prop[i], prop[i]['InputValue']);
    }
}

function createInputObject(node, cType, attributes, origin, inputValue) {
    var inputObject = null;
    // console.log("rawData: ", origin);
    if (cType == "radio" || cType == "checkbox") {
        var opts = attributes["options"].split('\n');
        opts = opts.filter(function(n) {
            return n != "";
        });
        node.setAttribute("data-controltype", cType);
        for (var i in opts) {
            inputObject = document.getElementById("optionInput").content;
            var input = inputObject.querySelector('[app-role = "option"]');
            input.value = opts[i];
            var span = inputObject.querySelector('[app-role = "displayValue"]');
            span.innerHTML = opts[i];
            input.type = cType;
            input.id = attributes["sysId"];
            input.name = attributes["sysId"];
            var rObject = document.importNode(inputObject, true);
            var describe = node.parentNode.querySelector('[data-controltype="describe"]');
            node.insertBefore(rObject, describe);
        }
        var rInputs = node.querySelectorAll('[app-role="option"]');
        // var parent = node.querySelector('[app-role="inputHandler"]')
        node.setAttribute("app-datastore", true);
        node["DATASTORE"] = origin;
        // console.log(node, rInputs);
        for (var i = 0; i < rInputs.length; i++) {
            rInputs[i].addEventListener("click", getInputFromOption, false);
        }
    } else if (cType == "select_tags" || cType == "select_tag_single") {
        if (cType == "select_tags") {
            inputObject = document.getElementById("selectInputTags").content;
        } else {
            inputObject = document.getElementById("selectInputSingle").content
        }

        var select = inputObject.querySelector('[data-controltype="select"]');
        var attOpts = attributes["options"];
        for (var i = 0; i < attOpts.length; i++) {
            var opt = document.createElement('option');
            // opt.value = i;
            opt.innerHTML = attOpts[i];
            select.appendChild(opt);
        }
        var rObject = document.importNode(inputObject, true);
        select.id = attributes.sysId;
        var describe = node.parentNode.querySelector('[data-controltype="describe"]');
        node.insertBefore(document.importNode(inputObject, true), describe);
        // clear select after import
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
        var rInput = node.querySelector('[data-controltype="select"]');
        rInput["DATASTORE"] = origin;
        if (inputValue) {
            rInput.setAttribute("app-datastore", true);
        }
        // rInput.addEventListener("change", getInputData, false);
        $(rInput).select2({
                tags: true
            })
            .on("change", function(e) {
                // http://stackoverflow.com/questions/15102000/jquery-select2-how-to-access-ajax-data-at-onchange-function
                data = $(this).select2('data');
                // console.log(data)
                var inputValues = [];
                for (var i = 0; i < data.length; i++) {
                    inputValues.push(data[i].text);
                    if (attOpts.indexOf(data[i].text) < 0) {
                        rInput["DATASTORE"]["attributes"]["options"].push(data[i].text);
                    }
                }
                rInput.setAttribute("app-datastore", true);
                rInput["DATASTORE"]["InputValue"] = inputValues;
            });
    } else if (cType == "select") {
        inputObject = document.getElementById("selectInput").content;
        var select = inputObject.querySelector('[data-controltype="select"]');
        var opts = attributes["options"]

        for (var i in opts) {
            var opt = document.createElement('option');
            // opt.value = i;
            opt.innerHTML = opts[i];
            select.appendChild(opt);
        }
        // var rObject = document.importNode(inputObject, true);
        select.id = attributes.sysId;
        var describe = node.parentNode.querySelector('[data-controltype="describe"]');
        node.insertBefore(document.importNode(inputObject, true), describe);
        // clear select after import
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
        var rInput = node.querySelector('[data-controltype="select"]');
        rInput["DATASTORE"] = origin;
        rInput.setAttribute("app-datastore", true);
        rInput.addEventListener("change", getInputData, false);

    } else if (cType == "image") {
        inputObject = document.getElementById("imgInput").content;
        var img = inputObject.querySelector('[data-controltype="img"]');
        img.id = attributes.id;
        // Set ratio to image
        var imgMask = inputObject.querySelector('[data-controltype="imgMask"]');
        var imgRatio = (attributes["height"] / attributes["width"] * 100) + "%";
        var rRatio = attributes["height"] / attributes["width"];
        imgMask.style.paddingTop = imgRatio;

        //imgMask.addEventListener('click', openModal, false);
        var imgsCollection = inputObject.querySelector('[data-controltype="collection"]') //data-controltype="collection"
        imgsCollection.innerHTML = "Collection: " + attributes["imageGroup"];
        var rObject = document.importNode(inputObject, true);
        var describe = node.parentNode.querySelector('[data-controltype="describe"]');
        node.insertBefore(rObject, describe);
        //config real Mask
        var rMark = node.parentNode.querySelector('[data-controltype="imgMask"]');
        rMark.addEventListener('click', openModal, false);
        rMark.customRatio = rRatio;
        rMark.customImg = img.id;
        rMark["DATASTORE"] = origin;
        rMark.setAttribute("app-datastore", true);

        return;
    } else if (cType == 'textarea') {
        inputObject = document.getElementById("textAreaInput").content;
        var input = inputObject.querySelector('[data-controltype="textarea"]');
        input.type = cType;
        input.id = attributes["sysId"];
        input.placeholder = attributes["placeholder"];
        input.min = attributes["min"];
        input.max = attributes["max"];
        input["DATASTORE"] = origin;
        input.addEventListener("onchange", getInputData, false);
        var rObject = document.importNode(inputObject, true);
        var describe = node.parentNode.querySelector('[data-controltype="describe"]');
        node.insertBefore(rObject, describe);
        var rInput = node.querySelector('[data-controltype="textarea"]');
        rInput["DATASTORE"] = origin;
        rInput.addEventListener("change", getInputData, false);

        rInput.setAttribute("app-datastore", true);

    } else if (cType == "ImageOptions") {
        // Special case for ImageOptions
        if (!attributes["ImageOptions"]) {
            return;
        }
        var imgOpts = attributes["ImageOptions"];
        inputObject = document.getElementById("extraOptionImgHandler").content;
        var rObject = document.importNode(inputObject, true);
        var describe = node.parentNode.querySelector('[data-controltype="describe"]');
        rObject = node.insertBefore(rObject, describe);
        var dataStoreHandler = node.querySelector('[app-role="selectHandler"]');
        dataStoreHandler["DATASTORE"] = origin;
        dataStoreHandler.setAttribute("app-datastore", true);
        dataStoreHandler.setAttribute("data-controltype", "imgOpt");
        var dropPad = node.querySelector('[app-role="droppad"]');
        for (var opt in imgOpts) {
            //console.log(" Test: ", fields["ImageOptions"][opt]);
            var item = document.getElementById('extraOptionImgItem').content;
            var label = item.querySelector('[app-role="attName"]');
            label.innerHTML = imgOpts[opt]['optName'];
            var img = item.querySelector('[app-role = "attImg"]');
            var imgSrc = imgOpts[opt].img
                // update check valid URL later here                    
            if (imgSrc.indexOf("http") == -1) {
                imgSrc = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/" + imgSrc
            }
            img.setAttribute('src', imgSrc);
            var temp = document.importNode(item, true);
            var currentNode = dropPad.appendChild(temp);
            dropPad.lastElementChild.setAttribute('app-value', imgOpts[opt].value);
            dropPad.lastElementChild["SELFDATA"] = imgOpts[opt];
            // dropPad.lastElementChild.focus();

        }

    } else {
        inputObject = document.getElementById("standardInput").content;
        var input = inputObject.querySelector('[data-controltype="text"]');
        input.type = cType;
        input.id = attributes["sysId"];
        input.placeholder = attributes["placeholder"];
        input.min = attributes["min"];
        input.max = attributes["max"];
        input["DATASTORE"] = origin;
        input.addEventListener("onchange", getInputData, false);
        var rObject = document.importNode(inputObject, true);
        var describe = node.parentNode.querySelector('[data-controltype="describe"]');
        node.insertBefore(rObject, describe);
        var rInput = node.querySelector('[data-controltype="text"]');
        rInput["DATASTORE"] = origin;
        rInput.addEventListener("change", getInputData, false);
        input.setAttribute("app-datastore", true);

    }
}

function reloadProductAtts(object) {
    try {
        var items = object.items[0]["productAtttributes"];
        var sysRoot = document.getElementById("systemAttributes");
        while (sysRoot.firstChild) {
            sysRoot.removeChild(sysRoot.firstChild);
        }
        var systemAttributes = items.filter(function(obj) {
            return !obj.sysId;
        });
        // Generate AttributeControl from data
        create_productAttributes(systemAttributes, true);
        var customAtts = items.filter(function(obj) {
            return obj.sysId;
        })
        create_productAttributes(customAtts, false);
        // fillup AttributeControl
        var productControls = document.querySelectorAll('[app-datastore="true"]');
        //console.log(productControls.length);
        for (var i = 0; i < productControls.length; i++) {
            if (productControls[i].getAttribute("data-controltype") == 'text') {
                productControls[i].value = productControls[i]["DATASTORE"]["InputValue"];
            }
            if (productControls[i].getAttribute("data-controltype") == 'radio') {
                var optionCheckeds = productControls[i].querySelectorAll('[app-role="inputCover"]');
                var option = productControls[i]["DATASTORE"]["InputValue"]
                for (var opt in optionCheckeds) {
                    if (optionCheckeds[opt] instanceof Element) {
                        var optValue = optionCheckeds[opt].querySelector('[app-role="option"]').value;
                        if (optValue == option) {
                            optionCheckeds[opt].querySelector('[app-role="option"]').checked = true;
                        }
                    }

                }
            }
            if (productControls[i].getAttribute("data-controltype") == 'checkbox') {
                var optionCheckeds = productControls[i].querySelectorAll('[app-role="inputCover"]');
                var option = productControls[i]["DATASTORE"]["InputValue"]
                for (var opt in optionCheckeds) {
                    if (optionCheckeds[opt] instanceof Element) {
                        var optValue = optionCheckeds[opt].querySelector('[app-role="option"]').value;
                        if (option instanceof Array) {
                            for (var chkItem in optValue) {
                                if (option[chkItem] == optValue) {
                                    optionCheckeds[opt].querySelector('[app-role="option"]').checked = true;
                                }
                            }
                        }
                    }

                }
            }
            if (productControls[i].getAttribute("data-controltype") == "imgMask") {
                var img = document.createElement('img');
                img.setAttribute('app-img', true);
                img.setAttribute('src', productControls[i]["DATASTORE"]["InputValue"]);
                img.style.position = "absolute";
                productControls[i].parentNode.insertBefore(img, productControls[i]);
            }
            if (productControls[i].getAttribute("data-controltype") == "imgOpt") {
                var selectbox = productControls[i].querySelector('[app-role="selectbox"]');
                var optValue = productControls[i]["DATASTORE"]["InputValue"].value;
                var selectedItem = productControls[i].querySelector('[app-value="' + optValue + '"]');
                var cln = selectedItem.cloneNode(true);
                var selectbox = productControls[i].querySelector('[app-role="selectbox"]');
                while (selectbox.firstChild) {
                    selectbox.removeChild(selectbox.firstChild);
                };
                cln.onclick = null;
                selectbox.appendChild(cln);
            }
            if (productControls[i].getAttribute("data-controltype") == "select") {
                var selectType = productControls[i]["DATASTORE"]["data-controlType"];
                var inputValue = productControls[i]["DATASTORE"]["InputValue"];
                if (selectType == "select_tag_single" && productControls[i]["DATASTORE"]["InputValue"] instanceof Array) {
                    $(productControls[i]).val(inputValue[0]).trigger("change");
                } else
                if (selectType == "select_tags" && productControls[i]["DATASTORE"]["InputValue"] instanceof Array) {
                    // http://stackoverflow.com/questions/24905607/select2-cant-set-multiple-value                    
                    if (inputValue && inputValue instanceof Array) {
                        $(productControls[i]).val(inputValue).trigger("change");
                    }
                } else if (selectType == "select") {
                    productControls[i].value = inputValue;
                }
            }
        }
    } catch (err) { console.log(err) };
}

function getInputData(evt) {
    this.setAttribute("app-datastore", true);
    this["DATASTORE"]["InputValue"] = evt.target.value;
}

function getInputFromOption(evt) {
    if (!this.parentNode.parentNode["DATASTORE"]) {
        console.log("No DATASTORE");
    }
    this.parentNode.parentNode.setAttribute("app-datastore", true);
    if (evt.target.type == "radio") {
        this.parentNode.parentNode["DATASTORE"]["InputValue"] = evt.target.value;
        // get data from value
    }
    if (evt.target.type == "checkbox") {
        inputValues = [];
        var checkArray = this.parentNode.parentNode.querySelectorAll('[type="checkbox"]');
        for (var i = 0; i < checkArray.length; i++) {
            if (checkArray[i].checked == true) {
                inputValues.push(checkArray[i].value);
            }
        }
        this.parentNode.parentNode["DATASTORE"]["InputValue"] = inputValues;
    }
    // console.log(this.parentNode["DATASTORE"]["InputValue"])
}

function toggleShow(elem) {
    // console.log(elem);
    if (elem) {
        elem.classList.toggle("active");
        var dropdown = elem.parentNode.querySelector('[app-role="dropdown"]');
        dropdown.classList.toggle("open");
    }
    // detect current htmlNodeCopy for this exception
    // console.log(elem);
}

function getOptionImage(evt) {
    var selectHandler = getHandler(evt, "selectHandler");
    // evt.stopPropagation();
    selectHandler["DATASTORE"]["InputValue"] = evt["SELFDATA"];

    function getHandler(elem, att) {
        // console.log(elem);
        // if (elem.parentNode.getAttribute('app-role') == "selectHandler") {
        if (elem.parentNode.getAttribute('app-role') == att) {
            // console.log("finish : ", elem, elem.parentNode)
            return elem.parentNode
        } else {
            return getHandler(elem.parentNode, att);
        }
    }

    // console.log("imgOptionHandler parent: ", imgOptionHandler)
    var selectbox = selectHandler.querySelector('[app-role="selectbox"]');
    toggleShow(selectbox);
    // remove all childs
    while (selectbox.firstChild) {
        selectbox.removeChild(selectbox.firstChild);
    }
    // clone this node
    var cln = evt.cloneNode(true);

    // remove action Listener
    cln.onclick = null;
    selectbox.appendChild(cln);
    // remove current css of selected item
    var curr = selectHandler.querySelector('.curr');
    if (curr) {
        curr.classList.remove('curr');
    };
    // ad this css for new element
    evt.classList.add('curr');
}

var currentImageTarget;

function openModal(evt) {
    // console.log(this.customRatio, this.customImg);
    img_Store = null;
    var thumbIcon = document.getElementById("thumbIcon");
    var imageBox = document.getElementById("iconImg");
    console.log("current Ratio: ", this.customRatio);
    thumbIcon.style.width = 700 + "px";
    thumbIcon.style.marginLeft = (-350) + "px";
    var height = 700 * this.customRatio;

    var top = -height / 2;
    thumbIcon.style.height = height + "px";
    thumbIcon.style.marginTop = top + "px";
    imageBox.style.height = height + 30 + "px";
    $(cropImageModal).modal("show");
    currentImageTarget = document.getElementById(this.customImg);

}

var img_Store;
options = {
    imageBox: '#iconImg',
    thumbBox: '#thumbIcon',
    spinner: '#spinnerIcon',
    imgSrc: ''
}

function initImg(el) {

    var reader = new FileReader();
    cropper = new cropbox(options, iconPreview);
    reader.onload = function(e) {
        options.imgSrc = e.target.result;
        cropper.resetOption(options);
    }

    reader.readAsDataURL(el.files[0]);
    // el.files = [];
    document.querySelector('#icon_btnZoomIn').addEventListener('click', function() {
        cropper.zoomIn();
    })
    document.querySelector('#icon_btnZoomOut').addEventListener('click', function() {
        cropper.zoomOut();
    });

    function iconPreview(data) {
        img_Store = data;
        document.getElementById('icon_preview').setAttribute('src', data);
        document.getElementById('icon_preview-md').setAttribute('src', data);
        document.getElementById('icon_preview-sm').setAttribute('src', data);
    }

};

function saveImage() {
    if (!img_Store) {
        return;
    }
    // console.log("okie", !!img_Store, currentImageTarget, currentImageTarget.parentNode);
    //1. Remove current element
    var currentImgs = currentImageTarget.querySelectorAll('[app-img="true"]');
    for (var i = 0; i < currentImgs.length; i++) {
        currentImgs[i].parentNode.removeChild(currentImgs[i]);
    }
    //2. Create image instead of removed element
    var img = document.createElement('img');
    img.setAttribute('app-img', true);
    img.setAttribute('src', img_Store);
    img.style.position = "absolute";
    var mask = currentImageTarget.querySelector('[data-controltype="imgMask"]')
    currentImageTarget.insertBefore(img, mask);
    mask["DATASTORE"]["InputValue"] = img_Store;
    mask.setAttribute("app-datastore", true);
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
            // if (data.status == 401) {
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
// Business Region
function saveProduct(el) {
    var productAttList = document.getElementById("content").querySelectorAll('[app-datastore="true"]');
    var productAttCollection = [];
    var exProductAttCollection = [];
    for (var elem in productAttList) {
        if (productAttList[elem]["DATASTORE"]) {
            // console.log(productAttList[elem]["DATASTORE"]);
            if (productAttList[elem]["DATASTORE"]["data-controlType"] == "image") {
                // productAttList[elem]["DATASTORE"]["InputValue"] = null;
                exProductAttCollection.push(productAttList[elem]["DATASTORE"]);
            } else {
                productAttCollection.push(productAttList[elem]["DATASTORE"]);
            }
        }
    }
    var payload = {};
    payload.systemSKU = systemSKU;
    console.log(payload);
    console.log("from post product", systemSKU);
    payload.productAtttributes = productAttCollection;
    // var endpoint = window.location.href + "updateProduct";
    var endpoint = "updateProduct";
    postSensitiveData(fbId, systoken, RSAPublicKey, endpoint, payload, exProductAttCollection, saveProductCb);
    //console.log(productAttCollection);
    el.disabled = true;

    var notify = $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        title: 'System Info',
    }, {
        element: 'body',
        position: null,
        type: "info",
        allow_dismiss: true,
        newest_on_top: false,
        showProgressbar: true,
        placement: {
            from: "bottom",
            align: "center"
        },
        offset: 20,
        spacing: 10,
        z_index: 1031,
        delay: 5000,
        timer: 100,
        url_target: '_blank',
        mouse_over: null,
        animate: {
            // enter: 'animated fadeInDown',
            // exit: 'animated fadeOutUp'
            enter: 'animated flipInY',
            exit: 'animated flipOutX'
        },
        icon_type: 'class',
        template: document.getElementById("notification").innerHTML
    });
    notify.update('message', "start saving process");

    function saveProductCb(returnObj) {
        console.log(returnObj);
        el.disabled = false;
        if (returnObj['errNum'] == 2) {
            notify.update('type', 'warning');
            notify.update('message', returnObj.errMessage);
            notify.update('delay', 5000);
        } else if (returnObj['return_id']) {
            notify.update('type', 'success'); // success
            notify.update('message', "Your data has been saved");
            notify.update('delay', 113000);
        } else {
            notify.update('type', 'danger'); //danger
            notify.update('message', "Something go wrong here");
            notify.update('delay', 5000);
        }
    }
}

function cloneProduct() {
    systemSKU = null;
}

function createNewProduct() {
    //location.href = window.location.href;
    //
    var productAttributes = document.getElementById("productAttributes");
    while (productAttributes.firstChild) {
        productAttributes.removeChild(productAttributes.firstChild);
    }
    var systemAttributes = document.getElementById("systemAttributes")
    while (systemAttributes.firstChild) {
        systemAttributes.removeChild(systemAttributes.firstChild);
    }
    create_productAttributes(system, true);
    systemSKU = null;
}

function deleteProduct() {
    if (!systemSKU) {
        return;
    }
    // var endpoint = window.location.href;
    var endpoint = '';
    //fbId, systoken, RSAPublicKey
    var _data = {
        userName: fbId,
        password: systoken,
        data: { systemSKU: systemSKU }
    };
    aes_key = cryptoUtil.generateAESKey();
    var json_data = {
        data: cryptoUtil.EncryptJSON(_data, RSAPublicKey, aes_key)
    };

    $.ajax({
        url: endpoint,
        type: 'DELETE',
        data: JSON.stringify(json_data), //JSON.stringify({ systemSKU: systemSKU })
        contentType: 'application/json', // <---add this
        dataType: 'text', // <---update this
        complete: function(data, status, jqXHR) {
            console.log("from delete function: ", data);
        }
    });
}
