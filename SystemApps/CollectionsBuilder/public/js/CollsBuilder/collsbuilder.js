var currentImg;
var currentDataStore;
var connectedGroup = [];

function openModal(event, elem) {
    $("#myModal").modal();
    baseLine = getBaseLine(elem);
}



function createNewCategoriesGroup(name) {
    var catTemp = document.getElementById("collsTemp").content;
    baseLine.parentNode.insertBefore(document.importNode(catTemp, true), baseLine);
    var rItem = previousElementSibling(baseLine);
    var catsName = rItem.querySelector('[app-role="collsName"]');
    catsName.innerHTML = name;
    rItem["DATASTORE"] = {}
    rItem["DATASTORE"]["name"] = name;
    rItem["DATASTORE"]['productLists'] = [];

    $(rItem).sortable({
        receive: function(e, ui) {
            ui.sender.sortable("cancel");
            var span = document.getElementById("band").content;
            var s = span.querySelector('[app-role = "band"]');
            s.innerHTML = ui.item[0].querySelector('[app-role="dataContent"]').innerHTML;
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
    createNewCategoriesGroup(catName);
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
