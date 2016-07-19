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
        createInputObject(rHandler, prop[i]["data-controlType"], prop[i]["attributes"]);
    }

}

function createInputObject(node, cType, attributes) {
    var inputObject = null;
    if (cType == "radio" || cType == "checkbox") {
        console.log(attributes);
        var opts = attributes["options"].split('\n');
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
    } else if (cType == "select") {

    } else if (cType == "image") {
        return;
    } else {
        inputObject = document.getElementById("standardInput").content;
        var input = inputObject.querySelector('[data-controltype="text"]');
        input.type = cType;
        input.id = attributes["id"];
        input.placeholder = attributes["placeholder"];
        input.min = attributes["min"];
        input.max = attributes["max"];
        var rObject = document.importNode(inputObject, true);
        var describe = node.parentNode.querySelector('[data-controltype="describe"]');
        node.insertBefore(rObject, describe);
    }

}
