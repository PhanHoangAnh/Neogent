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
    var currentUrl = window.location.href + "getOptionSets"
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

function create_productAttributes(prop) {
    // console.log("component properties: ", prop);
    for (var i in prop) {
        newId++;
        var _root = document.getElementById("productAttributes");
        // create template
        var controlTemplate = document.getElementById("controlTemplate").content
        controlTemplate.querySelector('[data-controltype="label"]').innerHTML = prop[i]["attributes"]["label"];
        controlTemplate.querySelector('[data-controltype="describe"]').innerHTML = prop[i]["attributes"]['describe'];
        var inputHandler = controlTemplate.querySelector('[app-role="inputHandler"]');
        inputHandler.id = newId;
        _root.appendChild(document.importNode(controlTemplate, true));
        var rHandler = document.getElementById(newId);
        createInputObject(rHandler, prop[i]["data-controlType"], prop[i]["attributes"], prop[i]);
    }
}

function createInputObject(node, cType, attributes, origin) {
    var inputObject = null;
    // console.log("rawData: ", origin);
    if (cType == "radio" || cType == "checkbox") {
        var opts = attributes["options"].split('\n');
        opts = opts.filter(function(n) {
            return n != "";
        });
        for (var i in opts) {
            inputObject = document.getElementById("optionInput").content;
            var input = inputObject.querySelector('[app-role = "option"]');
            input.value = opts[i];
            var span = inputObject.querySelector('[app-role = "displayValue"]');
            span.innerHTML = opts[i];
            input.type = cType;
            input.id = attributes["id"];
            input.name = attributes["id"];
            var rObject = document.importNode(inputObject, true);
            var describe = node.parentNode.querySelector('[data-controltype="describe"]');
            node.insertBefore(rObject, describe);
        }
        var rInputs = node.querySelectorAll('[app-role="option"]');
        node["DATASTORE"] = origin;
        for (var i = 0; i < rInputs.length; i++) {
            rInputs[i].addEventListener("click", getInputFromOption, false);
        }
    } else if (cType == "select") {
        inputObject = document.getElementById("selectInput").content;
        var select = inputObject.querySelector('[data-controltype="select"]');
        var opts = attributes["options"].split('\n');
        opts = opts.filter(function(n) {
            return n != "";
        });
        for (var i in opts) {
            var opt = document.createElement('option');
            // opt.value = i;
            opt.innerHTML = opts[i];
            select.appendChild(opt);
        }
        // var rObject = document.importNode(inputObject, true);
        select.id = attributes.id;
        var describe = node.parentNode.querySelector('[data-controltype="describe"]');
        node.insertBefore(document.importNode(inputObject, true), describe);
        // clear select after import
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
        var rInput = node.querySelector('[data-controltype="select"]');
        rInput["DATASTORE"] = origin;
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
        return;
    } else if (cType == 'textarea') {
        inputObject = document.getElementById("textAreaInput").content;
        var input = inputObject.querySelector('[data-controltype="textarea"]');
        input.type = cType;
        input.id = attributes["id"];
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
    } else {
        inputObject = document.getElementById("standardInput").content;
        var input = inputObject.querySelector('[data-controltype="text"]');
        input.type = cType;
        input.id = attributes["id"];
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
    }
}

function getInputData(evt) {
    this.setAttribute("app-datastore", true);
    this["DATASTORE"]["InputValue"] = evt.target.value;
}

function getInputFromOption(evt) {
    if (!this.parentNode["DATASTORE"]) {
        console.log("No DATASTORE");
        return;
    }
    this.parentNode.setAttribute("app-datastore", true);
    if (evt.target.type == "radio") {
        this.parentNode["DATASTORE"]["InputValue"] = evt.target.value;
        // get data from value
    }
    if (evt.target.type == "checkbox") {
        // this.parentNode["DATASTORE"]["InputValue"] = evt.target.value;
        var inputValues = [];
        var checkArray = this.parentNode.querySelectorAll('[type="checkbox"]');
        console.log(checkArray);
        for (var i = 0; i < checkArray.length; i++) {
            if (checkArray[i].checked == true) {
                inputValues.push(checkArray[i].value);
            }
        }
        this.parentNode["DATASTORE"]["InputValue"] = inputValues;
    }
    // console.log(this.parentNode["DATASTORE"]["InputValue"])
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
