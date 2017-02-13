var newId = 0;

// Sortable function
$(function() {
        var sortableDiv = document.querySelector("#div2");
        // console.log(sortableDiv);
        $(sortableDiv).sortable({
            // connectWith: ".connectedSortable",
            receive: function(e, ui) {
                sortableIn = 1;
            },
            start: function(e, ui) {
                // modify ui.placeholder however you like
                // ui.placeholder.html("I'm modifying the placeholder element!");
            },
            sort: function(e) {
                // console.log('X:' + e.screenX, 'Y:' + e.screenY);
                $('[data-toggle=popover]').each(function() {
                    // hide any open popovers when the anywhere else in the body is clicked                
                    $(this).popover('hide');
                });

            },
            placeholder: "ui-sortable-placeholder",
            receive: function(e, ui) {
                if (ui.item[0].getAttribute("app-role") == "optionSet") {
                    loadOptionSets(ui.item[0]["CUST"]);

                }
                ui.sender.sortable("cancel");
            },
            over: function(e, ui) {
                sortableIn = 1;
                // console.log("over from div2: ", sortableIn);
            },
            out: function(e, ui) {
                sortableIn = 0;
            },
            beforeStop: function(e, ui) {
                if (sortableIn == 0) {
                    //ui.item.remove();
                    $(ui.item.context).popover('destroy');
                    $('[data-toggle=popover]').each(function() {
                        // hide any open popovers when the anywhere else in the body is clicked                        
                        $(this).popover('hide');
                    });
                    ui.item.remove();
                }
            }
        });

        $(".connectedSortable").sortable({
            connectWith: $(sortableDiv),
            remove: function(e, ui) {
                // 
                // upgrade for Attribute Set
                if (ui.item[0].getAttribute("app-role") == "optionSet") {
                    return;
                }
                var nodeCopy = ui.item.clone();
                //
                newId++;
                nodeCopy[0].id = newId; /* We cannot use the same ID */
                nodeCopy.attr("data-toggle", "popover");
                nodeCopy.attr("data-placement", "right");
                // chipl initiated popover before first click
                // 1. Create template for associated popover

                if (nodeCopy[0].getElementsByTagName("datalist").length != 0) {
                    nodeCopy[0].getElementsByTagName("datalist")[0].id = newId + "list";
                    var input = nodeCopy[0].getElementsByTagName("input")[0];
                    input.setAttribute("list", newId + "list");
                }
                //
                nodeCopy.controlType = nodeCopy.attr("data-controlType");
                nodeCopy.attribute = {};
                var copyData = getData();
                for (var i in copyData) {
                    if (copyData[i]["Input Type"] == nodeCopy.controlType) {
                        for (var att in copyData[i]["fields"]) {
                            nodeCopy.attribute[att] = copyData[i]["fields"][att];
                            //console.log("for Debug: ", nodeCopy.attribute[att]);
                        }
                    }
                }
                var popoverContent = createAttributePanel(nodeCopy);
                // 2. Create popover
                $(nodeCopy).popover({
                    html: true,
                    trigger: 'click',
                    title: nodeCopy.controlType,
                    content: function() {
                        $('[data-toggle=popover]').each(function() {
                            // hide any open popovers when the anywhere else in the body is clicked                            
                            if (this != nodeCopy.get(0)) {
                                $(this).popover('hide');
                            }
                        });
                        return popoverContent;
                    }
                });
                //nodeCopy.preventDefault;
                nodeCopy.appendTo('#div2');
                $(this).sortable('cancel');
            },
            receive: function(e, ui) {
                ui.sender.sortable("cancel");
            },
            placeholder: "ui-sortable-placeholder",
            out: function(event, ui) {
                $('.placeholder').show();
            }
        });


    })
    // Create controls from JSON definition
$(function CreateControlsTemplate() {
    // body...
    var obj = getData()
    for (i in obj) {
        createSingleControlGroup(obj[i]);
    }
    setAttributeName();
})

function createSingleControlGroup(template, isReload) {
    newId++;
    var container_div = document.createElement('div');
    container_div.classList.add("row");
    container_div.classList.add("control");
    container_div.setAttribute("draggable", "true");
    container_div.id = newId;
    // container_div.addEventListener("dragstart", drag, false);
    //2. Create detail Element
    var label_cover = document.createElement("div");
    var label = document.createElement("Label");
    label.setAttribute("data-controlType", "label");
    label.innerHTML = template["label"];
    label_cover.classList.add("col-md-3");
    label_cover.classList.add("col-lg-3");
    label_cover.appendChild(label);

    container_div.appendChild(label_cover);

    var input_cover = document.createElement("div");
    input_cover.classList.add("col-md-9");
    input_cover.classList.add("col-lg-9");
    var input = document.createElement("input");

    switch (template["Input Type"]) {
        case ("text"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.classList.add("form-control");
            input.type = "text";
            if (template["placeholder"] || template["fields"]["placeholder"]) {
                input.placeholder = template["placeholder"] || template["fields"]["placeholder"].value;
            }
            input.setAttribute("data-controlType", "text");
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "text");
            break;
        case ("combobox"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.classList.add("form-control");
            input.type = "combobox";
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
            }
            input.setAttribute("data-controlType", "combobox");
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "combobox");
            // in case for editable combobox, create datalist for this input
            if (template["fields"]["options"]) {
                var datalistId = newId + "datalist";
                input.setAttribute("list", datalistId);
                var datalist = document.createElement("datalist")
                datalist.id = datalistId;
                for (item in template["fields"]["options"]) {
                    var option = document.createElement("option");
                    option.setAttribute("value", template["fields"]["options"][item]);
                    datalist.appendChild(option);
                }
                input_cover.appendChild(datalist);
            }
            break;
        case ("select"):
            input = document.createElement("select");
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.classList.add("form-control");
            if (template["fields"]["options"]) {
                for (item in template["fields"]["options"]) {
                    var option = document.createElement("option");
                    option.setAttribute("value", item);
                    option.innerHTML = template["fields"]["options"][item];
                    input.appendChild(option);
                }
            }
            input_cover.appendChild(input);
            input.setAttribute("data-controlType", "select");
            container_div.setAttribute("data-controlType", "select");
            break;
        case ("textarea"):
            input = document.createElement("textarea");
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.classList.add("form-control");
            input.type = "textarea";
            input.setAttribute("data-controlType", "textarea");
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "textarea");
            break;
        case ("radio"):
            input.type = "radio";
            input.name = template["value"];
            if (template["fields"]["options"]) {
                for (item in template["fields"]["options"]) {
                    input.classList.add("c-left");
                    //input.classList.add("col-lg-6");
                    input.value = item;
                    var copy_radio = input.cloneNode(true);
                    input_cover.appendChild(copy_radio);
                    var span = document.createElement("span")
                    span.innerHTML = template["fields"]["options"][item];
                    span.classList.add("col-md-11");
                    span.classList.add("col-lg-11");
                    input_cover.appendChild(span);
                }
                input_cover.setAttribute("data-controlType", "options");
            }
            container_div.setAttribute("data-controlType", "radio");
            break;
        case ("ImageOptions"):
            // Update for configurable attributes
            newId++;
            var input = document.importNode(document.getElementById('extraOptionImgHandler').content, true);
            input_cover.appendChild(input);
            input.id = newId;
            container_div.setAttribute("data-controlType", "ImageOptions"); //

            break;
        case ("checkbox"):
            input.type = "checkbox";
            input.name = template["value"];
            if (template["fields"]["options"]) {
                for (item in template["fields"]["options"]) {
                    input.classList.add("c-left");
                    //input.classList.add("col-lg-6");
                    input.value = item;
                    var copy_radio = input.cloneNode(true);
                    input_cover.appendChild(copy_radio);
                    var span = document.createElement("span")
                    span.innerHTML = template["fields"]["options"][item];
                    span.classList.add("col-md-11");
                    span.classList.add("col-lg-11");
                    input_cover.appendChild(span);
                }
                input_cover.setAttribute("data-controlType", "options");
                container_div.setAttribute("data-controlType", "checkbox");
            }
            break;
        case ("number"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.classList.add("form-control");
            input.setAttribute("data-controlType", "number");
            input.type = "number";
            if (template["fields"]["min"]) {
                input.min = template["fields"]["min"];
            }
            if (template["fields"]["max"]) {
                input.max = template["fields"]["max"];
            }
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
            }
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "number");
            break;
        case ("date"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.classList.add("form-control");
            input.type = "date";
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
                input.setAttribute("data-controlType", "input");
            }
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "date");
            break;
        case ("color"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.classList.add("form-control");
            input.type = "color";
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
                input.setAttribute("data-controlType", "input");
            }
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "color");
            break;
        case ("range"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.classList.add("form-control");
            input.type = "range";
            if (template["fields"]["min"]) {
                input.min = template["fields"]["min"];
            }
            if (template["fields"]["max"]) {
                input.max = template["fields"]["max"];
            }
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
            }
            container_div.setAttribute("data-controlType", "range");
            input_cover.appendChild(input);
            break;
        case ("month"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.classList.add("form-control");
            input.type = "month";
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "month");
            break;
        case ("week"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.classList.add("form-control");
            input.type = "week";
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "week");
            break;
        case ("time"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.classList.add("form-control");
            input.type = "time";
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "time");
            break;
        case ("image"):
            input = document.createElement('div');
            input.style.backgroundImage = "url('https://rawgit.com/PhanHoangAnh/CreateDynamicAttributeSets/master/materials/sample.jpg')";
            input.style.backgroundSize = 'cover';
            input.style.backgroundRepeat = 'no-repeat';
            input.style.outlineColor = 'rgba(255,255,255,.2)';
            input.style.outlineStyle = 'solid';
            input.style.outlineWidth = '3px';
            var mask = document.createElement('div');
            var height = template["fields"]['height']['value'];
            var width = template["fields"]['width']['value'];
            var paddingTop = height / width * 100;
            if (isNaN(paddingTop)) {
                mask.style = "position: relative; z-index: 5; padding-top: 56.25%;"
            } else {
                mask.style = "position: relative; z-index: 5;"
                mask.style.paddingTop = paddingTop + '%';
            };
            mask.setAttribute("app-role", "mask");
            input.appendChild(mask);
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "image");
            break;
    }

    if (template["fields"]["describe"]) {
        var span = document.createElement("span");
        span.innerHTML = template["fields"]["describe"]["value"];
        span.classList.add("help-block");
        span.classList.add("col-md-12");
        span.classList.add("col-lg-12");
        span.setAttribute("data-controlType", "describe");
    }
    input_cover.appendChild(span);
    container_div.appendChild(input_cover);
    //Test
    if (isReload) {
        container = "div2";
        // 1. add popover for container_div
        $(container_div).attr("data-toggle", "popover");
        $(container_div).attr("data-placement", "right");
        container_div.attribute = template["fields"];
        container_div.controlType = template["Input Type"];

        container_div["CUST"] = template["CUST"];
        var popoverContent = createAttributePanel(container_div);
        // 2. add CUST properties for container_div
        // 2. Create popover
        $(container_div).popover({
            html: true,
            trigger: 'click',
            title: container_div.controlType,
            content: function() {
                $('[data-toggle=popover]').each(function() {
                    // hide any open popovers when the anywhere else in the body is clicked                            
                    if (this != $(container_div).get(0)) {
                        $(this).popover('hide');
                    }
                });
                // set custom attribute for popover content here                
                return popoverContent;
            }
        });
    } else {
        var container = template["container"];
    }
    document.getElementById(container).appendChild(container_div);
}

function createAttributePanel(nodeCopy, title) {

    var controlType = nodeCopy.controlType;
    var fields = nodeCopy.attribute;
    var main_panel = document.createElement('main_panel');
    main_panel.classList.add("col-md-12");
    main_panel.classList.add("col-lg-12");
    main_panel.classList.add("clearfix");
    for (var item in fields) {
        var label = document.createElement("LABEL");
        label.classList.add("col-lg-12");
        label.classList.add("col-md-12");
        main_panel.appendChild(label);
        if (item != "options" && item != "min" && item != "max" && item != "ImageOptions") {
            label.innerHTML = fields[item]["label"];
            var input = document.createElement("input");
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = fields[item]["Input Type"];
            input.placeholder = fields[item]["value"];

            input.setAttribute("data-controlType", item);
            input.addEventListener("change", changeControlAttribute, false);

            if (item == "required" || item == "invisible") {
                var row = document.createElement("div");
                // row.classList.add("row");
                row.classList.add("clearfix");
                row.style.float = "left";
                row.style.width = "100%";
                row.style["padding-top"] = "7px";
                label.classList.remove("col-lg-12");
                label.classList.remove("col-md-12");
                label.classList.add("col-lg-6");
                label.classList.add("col-md-6");
                label.innerHTML = item;
                input.classList.remove("col-lg-12");
                input.classList.remove("col-md-12");
                input.classList.add("col-md-6");
                input.classList.add("col-lg-6");
                input.type = fields[item]["Input Type"];
                // console.log("from createAttributePanel: ", fields[item]);
                input.checked = (fields[item].value == "true");
                input.addEventListener("change", changeControlAttribute, false);
                row.appendChild(label);
                row.appendChild(input);
                main_panel.appendChild(row);
            } else {
                main_panel.appendChild(input);
            }
        }
        if (item == "options") {
            // if (nodeCopy.controlType == "radio"){};
            var input = document.createElement('textarea');
            input.rows = 3;
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            label.innerHTML = "Options";
            var opt_string = "";
            for (var opt in fields["options"]) {
                opt_string = opt_string + fields["options"][opt] + "\n";
            }
            input.value = opt_string;
            input.setAttribute("data-controlType", item)
            input.addEventListener("change", changeControlAttribute, false);
            main_panel.appendChild(input);
        }
        if (item == "min" || item == "max") {
            label.innerHTML = item;
            var input = document.createElement("input");
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = "number";
            input.placeholder = "Number only";
            input.setAttribute("data-controlType", item);
            input.addEventListener("change", changeControlAttribute, false);
            main_panel.appendChild(input);
        }
        if (item == "ImageOptions") {
            // Update for configurable attributes           
            label.innerHTML = item;
            var input_cover = document.createElement("div");
            input_cover.setAttribute("app-role", "imgOptionHandler");
            if (nodeCopy instanceof Element) {
                nodeCopy = $(nodeCopy);
            }
            input_cover.referParentElem = nodeCopy.get(0);

            input_cover.classList.add("col-md-12");
            input_cover.style.padding = '0';
            var input = document.importNode(document.getElementById('extraOptionImgHandler').content, true);
            input_cover.appendChild(input);
            main_panel.appendChild(input_cover);
            var dropPad = input_cover.querySelector('[app-role="droppad"]');
            // console.log("dropPad: ", dropPad);
            //http: //stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example

            if (!nodeCopy.get(0).CUST) {
                nodeCopy.get(0).CUST = {};
            }
            // var CUST = nodeCopy.get(0).CUST;
            if (!nodeCopy.get(0).CUST['ImageOptions']) {
                nodeCopy.get(0).CUST['ImageOptions'] = fields['ImageOptions'];
            }

            var imgDataOptions = nodeCopy.get(0).CUST['ImageOptions'];
            for (var opt in imgDataOptions) {
                //console.log(" Test: ", fields["ImageOptions"][opt]);
                var item = document.getElementById('extraOptionImgItem').content;
                var label = item.querySelector('[app-role="attName"]');
                label.innerHTML = imgDataOptions[opt]['optName'];
                var img = item.querySelector('[app-role = "attImg"]');
                var imgSrc = imgDataOptions[opt].img
                    // update check valid URL later here                    
                if (imgSrc.indexOf("http") == -1) {
                    imgSrc = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/" + imgSrc
                }
                img.setAttribute('src', imgSrc);
                var temp = document.importNode(item, true);
                var currentNode = dropPad.appendChild(temp);
                dropPad.lastElementChild.setAttribute('app-value', imgDataOptions[opt].value);
            }
        }

    }
    var hr = document.createElement("hr");
    hr.setAttribute("style", "width: 100%;display: block;float: left;");
    main_panel.appendChild(hr);
    var closeBnt = document.createElement("button");
    closeBnt.classList.add("btn");
    closeBnt.classList.add("btn-primary");
    closeBnt.innerHTML = "Close";
    closeBnt.addEventListener("click", function(evt) {
        $('[data-toggle=popover]').each(function() {
            $(this).popover('hide');
        });
        // saveElement();
    }, false);

    var controlHandler = document.createElement("div");
    controlHandler.style["text-align"] = "center";
    controlHandler.style["padding-bottom"] = "15px";
    controlHandler.style["clear"] = "both";
    controlHandler.appendChild(closeBnt);

    var cover = document.createElement("cover");
    cover.classList.add("row");
    cover.style.float = "left";
    cover.style.padding = "15px";
    main_panel.appendChild(controlHandler);
    cover.appendChild(main_panel);

    function changeControlAttribute(evt) {
        var ctrType = this.getAttribute("data-controlType");
        var controls;
        var htmlNodeCopy;
        if (nodeCopy instanceof Node) {
            controls = $(nodeCopy).get(0).querySelectorAll("[data-controlType]");
            htmlNodeCopy = nodeCopy;
        } else {
            controls = nodeCopy.get(0).querySelectorAll("[data-controlType]");
            htmlNodeCopy = nodeCopy.get(0);
        }
        // console.log("changeControlAttribute: line 553: ", htmlNodeCopy);
        if (!htmlNodeCopy["CUST"]) {
            htmlNodeCopy["CUST"] = {};
        }
        for (var elem in controls) {

            htmlNodeCopy["CUST"][ctrType] = this.value;
            // exception for require and invisible fields
            if (ctrType == "required" || ctrType == "invisible") {
                this.value = this.checked;
            }
            // exception for width and height fields
            if (ctrType == "width" || ctrType == "height") {
                var paddingTop = htmlNodeCopy["CUST"]['height'] / htmlNodeCopy["CUST"]['width'] * 100;
                if (isNaN(paddingTop)) {
                    htmlNodeCopy["CUST"]['width'] = 10;
                    htmlNodeCopy["CUST"]['height'] = 10;
                }
                var mask = htmlNodeCopy.querySelector('[app-role="mask"]');
                mask.style.paddingTop = paddingTop + '%';
            }
            if (controls[elem] instanceof Node && ctrType == "placeholder" && (controls[elem].type == "text" || controls[elem].type == "number")) {
                controls[elem].placeholder = this.value;
            }
            if (controls[elem] instanceof Node && ctrType == "options" && (controls[elem].type == "select-one")) {
                var select = controls[elem];
                var optArr = $(this).val().split('\n');
                optArr = optArr.filter(function(n) {
                    return n != "";
                });
                while (select.firstChild) {
                    select.removeChild(select.firstChild);
                }
                for (var item in optArr) {
                    var option = document.createElement("option");
                    option.setAttribute("value", item);
                    option.innerHTML = optArr[item];
                    select.appendChild(option);
                }
            }

            if (controls[elem] instanceof Node && ctrType == "options" && (controls[elem].type == "text")) {
                var optArr = $(this).val().split('\n');
                optArr = optArr.filter(function(n) {
                    return n != "";
                });
                // Select and update datalist                
                var datalistId = controls[elem].getAttribute("list");
                var datalist = document.getElementById(datalistId);
                while (datalist.firstChild) {
                    datalist.removeChild(datalist.firstChild);
                }

                for (var item in optArr) {
                    var option = document.createElement("option");
                    option.setAttribute("value", optArr[item])
                    datalist.appendChild(option);
                }
            }
            if (controls[elem] instanceof Node && controls[elem].getAttribute("data-controltype") == ctrType) {
                if (ctrType == "options") {
                    // follow http://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
                    var optArr = $(this).val().split('\n');
                    optArr = optArr.filter(function(n) {
                        return n != "";
                    });
                    //console.log(optArr);
                    var describe = controls[elem].querySelector("[data-controlType='describe']").cloneNode(true);
                    while (controls[elem].firstChild) {
                        controls[elem].removeChild(controls[elem].firstChild);
                    }
                    var inputType = controls[elem].parentNode.getAttribute("data-controlType");
                    var input = document.createElement("input");
                    input.type = inputType;
                    for (var item in optArr) {
                        // Set input name later
                        input.classList.add("c-left");
                        // input.classList.add("col-lg-6");
                        input.value = item;
                        var copy_radio = input.cloneNode(true);
                        controls[elem].appendChild(copy_radio);
                        var span = document.createElement("span")
                        span.innerHTML = optArr[item];
                        span.classList.add("col-md-11");
                        span.classList.add("col-lg-11");
                        controls[elem].appendChild(span);
                    }
                    controls[elem].appendChild(describe);
                } else {
                    controls[elem].innerHTML = this.value;
                    if (title) {
                        compObj.setName = this.value;
                    }
                }
            }
        }
    }
    return cover;
}

function setAttributeName() {
    var legent = document.querySelector("#SetsName");
    // var legent = $(_legent);
    legent.setAttribute("data-toggle", "popover");
    legent.setAttribute("data-placement", "right");
    legent.attribute = {};
    legent.attribute["label"] = {
        "label": "Set Attributes Set Name",
        "Input Type": "text",
        "value": "Text Input"
    }

    var _Content = createAttributePanel(legent, true);
    // 2. Create popover
    $(legent).popover({
        html: true,
        // trigger: 'click',
        title: "Set Attributes Name",
        content: function() {
            $('[data-toggle=popover]').each(function() {
                if (this != legent) {
                    $(this).popover('hide');
                }
            });
            return _Content;
        }
    });
}

var compObj = {}


function initIcon(el) {
    var options = {
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
    // el.files = [];
    document.querySelector('#icon_btnZoomIn').addEventListener('click', function() {
        cropper.zoomIn();
    })
    document.querySelector('#icon_btnZoomOut').addEventListener('click', function() {
        cropper.zoomOut();
    })
    $('#m_icon').on('hidden.bs.modal', function() {
        document.getElementById('iconHolder').setAttribute('src', img_Icon);
    });
    $('#m_icon').on('show.bs.modal', function() {
        cropper.resetOption(options);
    }).modal('show');

    function iconPreview(data) {
        // img_Icon = data;
        document.getElementById('icon_preview').setAttribute('src', data);
        document.getElementById('icon_preview-md').setAttribute('src', data);
        document.getElementById('icon_preview-sm').setAttribute('src', data);
    }

};

function loadOptionSets(optSet) {
    //1. Load option Sets Name
    var setsName = document.getElementById("SetsName").querySelector('[data-controltype="label"]');
    compObj.setName = setsName.innerHTML = optSet.setName;
    compObj.objId = optSet._id;
    //2. Rendering component and its attributes
    // clear div2 before add new element
    var airField = document.getElementById("div2");
    while (airField.firstChild) {
        airField.removeChild(airField.firstChild);
    }
    //
    var _data = getData();
    for (var i in optSet.components) {
        var mockObj = {};
        for (var k in _data) {
            if (optSet.components[i] && _data[k]["Input Type"] == optSet.components[i]["data-controlType"]) {
                mockObj.fields = _data[k]["fields"];
                break;
            }
        }
        for (var k in mockObj.fields) {
            var compareItem = optSet.components[i].attributes[k];
            if (!compareItem) {
                break;
            }
            // Must be updated here Chipl
            if (k == "options") {
                var optArr = compareItem.split('\n');
                optArr = optArr.filter(function(n) {
                    return n != "";
                });
                mockObj.fields[k] = optArr;
            } else if (k != "ImageOptions") {
                mockObj.fields[k].value = compareItem;
            }
        }
        // mockObj.fields =
        if (optSet.components[i]) {
            mockObj["Input Type"] = optSet.components[i]["data-controlType"];
            mockObj["label"] = optSet.components[i]["attributes"]["label"];
            // copy object to avoid the refer
            var CUST = Object.assign({}, optSet["components"][i]["attributes"])
            mockObj["CUST"] = CUST;
            createSingleControlGroup(mockObj, true);
        }

    }
}


function saveAttributeSets(el) {
    var sortableDiv = document.querySelector("#div2");
    var elementLists = sortableDiv.querySelectorAll("[id]");
    var printedList = [];
    var exPayload = [];
    for (var elem in elementLists) {
        if (elementLists[elem]["CUST"] && elementLists[elem].getAttribute("data-controlType") != "ImageOptions") {
            var jsonObj = {};
            jsonObj["data-controlType"] = elementLists[elem].getAttribute("data-controlType");
            jsonObj["attributes"] = elementLists[elem]["CUST"];
            printedList.push(jsonObj);
        } else if (elementLists[elem]["CUST"] && elementLists[elem].getAttribute("data-controlType") == "ImageOptions") {
            var jsonObj = {};
            jsonObj["data-controlType"] = elementLists[elem].getAttribute("data-controlType");
            jsonObj["attributes"] = elementLists[elem]["CUST"];
            exPayload.push(jsonObj);
        }
    }
    compObj.components = printedList
        // Post Attributes List to server
    var currentUrl = window.location.href + "updateOptionSets"
    console.log(exPayload);
    postSensitiveData(fbId, systoken, RSAPublicKey, currentUrl, compObj, fn_cb, exPayload)
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

    function fn_cb(returnObj) {
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
        requestOptionSets();
    };
}

function requestOptionSets() {
    // Get Attributes List from server
    var currentUrl = window.location.href + "getOptionSets"
    $.ajax({
        // url: './userToken',
        url: currentUrl,
        beforeSend: function(request) {
            var _data = {
                userName: fbId,
                password: systoken
            };
            aes_key = cryptoUtil.generateAESKey();
            request.setRequestHeader("x-access-token", cryptoUtil.EncryptJSON(_data, RSAPublicKey, aes_key));
        },
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
}

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
        var node = _root.appendChild(document.importNode(optionSetTemplate, true));
        var realNode = document.getElementById(newId);
        realNode["CUST"] = optSet[i];
    }
}

function createNewSet() {
    compObj = new Object();
    compObj.setName = "Create new AttributeSets"
    loadOptionSets(compObj);
}

function cloneSet() {
    delete compObj.objId;
}

function deleteSet() {
    if (compObj.objId) {
        var currentUrl = window.location.href + "deleteOptionSets/" + compObj.objId
        $.ajax({
            // url: './userToken',
            url: currentUrl,
            method: 'GET',
            beforeSend: function(request) {
                var _data = {
                    userName: fbId,
                    password: systoken
                };
                aes_key = cryptoUtil.generateAESKey();
                request.setRequestHeader("x-access-token", cryptoUtil.EncryptJSON(_data, RSAPublicKey, aes_key));
            },
            // data: compObj,
            complete: function(data, status, jqXHR) {

                if (!data.responseJSON.err) {
                    // console.log(data.responseJSON.doc);
                    createNewSet();
                    requestOptionSets();
                } else {
                    console.log(data.responseJSON.err)
                }
            }
        });
    }
}
//
function toggleShow(elem, event) {
    // console.log(elem);
    if (elem) {
        elem.classList.toggle("active");
        var dropdown = elem.parentNode.querySelector('[app-role="dropdown"]');
        dropdown.classList.toggle("open");
    }
}

function hideShow(elem) {
    if (elem) {
        elem.classList.remove("active");
        var dropdown = elem.parentNode.querySelector('[app-role="dropdown"]');
        dropdown.classList.remove("open");
    }
}

function activeShow(elem, event) {
    if (elem) {
        elem.classList.add("active");
        var dropdown = elem.parentNode.querySelector('[app-role="dropdown"]');
        dropdown.classList.add("open");
    }
}

function itemFocuses(elem) {
    console.log("Item focus: ", elem);
}



var imgOptionHandler;
var currentImgOptItem;
var currentDropPad;


function getOptionImage(evt) {
    var selectHandler = getHandler(evt, "selectHandler");
    // evt.stopPropagation();
    imgOptionHandler = getHandler(evt, "imgOptionHandler").referParentElem

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
    var bntBox = cln.querySelector('.s-button');
    if (bntBox) {
        bntBox.parentNode.removeChild(bntBox);
    };
    // change the css indicate selectedItem.
    // remove current css of selected item
    var curr = selectHandler.querySelector('.curr');
    if (curr) {
        curr.classList.remove('curr');
    };
    // ad this css for new element
    evt.classList.add('curr');
}


function addMoreOrEditImageOptions(elem, event) {

    event.stopPropagation();
    var appRole = elem.getAttribute('app-role');
    var rootElem = getHandler(elem, 'imgOptionHandler')
    imgOptionHandler = rootElem.referParentElem;

    switch (appRole) {
        case "addMoreImgOption":
            // console.log('1');
            currentImgOptItem = {};
            document.querySelector('[app-role="attImgName"]').value = null;
            document.querySelector('[app-role="attImgXRatio"]').value = null;
            document.querySelector('[app-role="attImgYRatio"]').value = null;
            ngOpt.imgSrc = '';
            neo_cropper.resetOption(ngOpt, 1);
            break;
        case "editImgOption":
            var itemHwd = getHandler(elem, "selectItem")
            console.log('2 ', itemHwd);
            var ImageOptions = null;
            ImageOptions = imgOptionHandler.CUST['ImageOptions'];
            var appValue = itemHwd.getAttribute("app-value");
            if (appValue) {
                currentImgOptItem = imgOptionHandler.CUST['ImageOptions'].filter(function(obj) {
                    return obj.value.toString() == itemHwd.getAttribute("app-value");
                })[0];
                document.getElementById("attImgName").value = currentImgOptItem["optName"];
                document.getElementById("attImgXRatio").value = currentImgOptItem["attImgXRatio"];
                document.getElementById("attImgYRatio").value = currentImgOptItem["attImgYRatio"];
                changeAttImgOptionRatio(currentImgOptItem["attImgXRatio"], currentImgOptItem["attImgXRatio"]);
            };
            break;
        case "deleteImgOption":
            var itemHwd = getHandler(elem, "selectItem");
            console.log('3 ', itemHwd);
            // delete item in ImageOptions list of imgOptionHandler
            var ImageOptions = null;
            ImageOptions = imgOptionHandler.CUST['ImageOptions'];
            var appValue = itemHwd.getAttribute("app-value");
            // http://stackoverflow.com/questions/15287865/remove-array-element-based-on-object-property
            if (appValue) {
                ImageOptions = ImageOptions.filter(function(obj) {
                    return obj.value.toString() !== appValue;
                });
            };
            imgOptionHandler.CUST['ImageOptions'] = ImageOptions;
            // console.log("After delete: ",appValue, imgOptionHandler.CUST['ImageOptions'], ImageOptions);
            // remove itemHwd from it's parent
            itemHwd.parentNode.removeChild(itemHwd);
            return;
    }



    //input_cover.querySelector('[app-role="droppad"]')
    currentDropPad = rootElem.querySelector('[app-role="droppad"]')

    function getHandler(el, att) {
        // console.log(elem);
        // if (elem.parentNode.getAttribute('app-role') == "selectHandler") {
        if (el.parentNode.getAttribute('app-role') == att) {
            //console.log("finish : ", el.parentNode, el.parentNode.getAttribute('app-role'));
            return el.parentNode
        } else {
            return getHandler(el.parentNode, att);
        }
    }
    // console.log('imgOptionHandler: ', imgOptionHandler);

    $(imgOptionsModal).modal("show");

}

function attImgRatio_change(evt, elem) {

    var appRole = elem.getAttribute("app-role");
    if (appRole == "attImgName") {
        appRole = "optName";
    }
    currentImgOptItem[appRole] = elem.value;
    changeAttImgOptionRatio(currentImgOptItem['attImgXRatio'], currentImgOptItem['attImgYRatio']);
    // console.log(currentImgOptItem);
}

function changeAttImgOptionRatio(attWidth, attHeight) {
    var thumbBox = document.getElementById("attImageThumb");
    if (!attWidth || attWidth == 0) {
        attWidth = 10;
    }
    if (!attHeight || attHeight == 0) {
        attHeight = 10;
    }
    var ratio = attWidth / attHeight;
    var w = 200 * ratio;
    thumbBox.style.width = w + "px";
    thumbBox.style.marginLeft = -w / 2 + 'px';
    neo_cropper.resetOption(ngOpt);
}

var img_Store;

var ngOpt = {
    imageBox: '#attImageBox',
    thumbBox: '#attImageThumb',
    spinner: '#attSpinner',
    imgSrc: ''
}
neo_cropper = new cropbox(ngOpt, optionPreview);

function iniAttImgOptItem(el) {

    var reader = new FileReader();

    reader.onload = function(e) {
        ngOpt.imgSrc = e.target.result;
        neo_cropper.resetOption(ngOpt, 1);
    }

    reader.readAsDataURL(el.files[0]);


    // el.files = [];
    document.querySelector('#att_btnZoomIn').addEventListener('click', function() {
        neo_cropper.zoomIn();
    })
    document.querySelector('#att_btnZoomOut').addEventListener('click', function() {
        //console.log("Iam here", currentImgOptItem);
        neo_cropper.zoomOut();
    });

}

function optionPreview(data) {
    img_Store = data;
    document.getElementById('attPreview').setAttribute('src', data);
    document.getElementById('attPreviewMd').setAttribute('src', data);
    document.getElementById('attPreviewSm').setAttribute('src', data);
    //error here
    if (currentImgOptItem) {
        currentImgOptItem['img'] = data;;
    }

}

document.getElementById("attImgOptSave").addEventListener('click', function(el) {

    var item = currentDropPad.querySelector('[app-value="' + currentImgOptItem.value + '"]');
    if (!item) {
        item = document.getElementById('extraOptionImgItem').content;
        currentDropPad.appendChild(document.importNode(item, true));
        var currentItem = currentDropPad.lastElementChild;
        item = currentItem;
        var ImageOptions = null;
        ImageOptions = imgOptionHandler.CUST['ImageOptions'];
        var valueArr = [];
        var max = 0;
        if (ImageOptions) {
            for (var i = 0; i < ImageOptions.length; i++) {
                valueArr.push(ImageOptions[i].value);
                if (isNaN(ImageOptions[i].value) || isFinite(ImageOptions[i].value) || ImageOptions[i].value == "-Infinity") {
                    ImageOptions[i].value = i;
                }
            }
            max = Math.max.apply(Math, valueArr);
        } else {
            imgOptionHandler.CUST['ImageOptions'] = [];
        }
        max++;
        currentImgOptItem.value = max;
        currentItem.setAttribute('app-value', max);
        // Update current list of currentItem
        imgOptionHandler.CUST.ImageOptions.push(currentImgOptItem);
        // console.log(ImageOptions);
    }
    var label = item.querySelector('[app-role="attName"]');
    label.innerHTML = currentImgOptItem['optName'];
    var img = item.querySelector('[app-role = "attImg"]');
    img.setAttribute('src', img_Store);


}, false);
