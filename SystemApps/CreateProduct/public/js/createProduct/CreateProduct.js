// $(".connectedSortable").sortable({
//     // connectWith: $(document.getElementById("productAttributes")),
//     // remove: function(e, ui) {

//     // },
//     // receive: function(e, ui) {
//     //     // ui.sender.sortable("cancel");
//     // },
//     // placeholder: "ui-sortable-placeholder",
//     // out: function(event, ui) {

//     // }
// });

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
        out: function(event, ui) {

        }

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
            input.value = i;
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
        // rInputs["DATASTORE"] = origin;
        console.log(rInputs);
        for (var i = 0; i < rInputs.length; i++) {
            rInputs[i].addEventListener("click", getInputFromOption, false);
            // console.log(getEventListener(rInputs[i]));
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
        imgMask.style.paddingTop = imgRatio;
        console.log("imgRatio: ", imgRatio);
        var imgsCollection = inputObject.querySelector('[data-controltype="collection"]') //data-controltype="collection"
        imgsCollection.innerHTML = "In collection: " + attributes["imageGroup"];
        var rObject = document.importNode(inputObject, true);
        var describe = node.parentNode.querySelector('[data-controltype="describe"]');
        node.insertBefore(rObject, describe);
        return;
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
    this["DATASTORE"]["InputValue"] = evt.target.value;
    console.log("from getInputData: ", this["DATASTORE"], this);
}

function getInputFromOption(evt) {
    console.log("here");
}
