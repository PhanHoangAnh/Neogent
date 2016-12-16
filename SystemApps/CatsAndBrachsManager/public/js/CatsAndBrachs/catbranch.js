var currentImg;
var currentDataStore;
var connectedGroup = [];

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
    rItem["DATASTORE"]['branchs'] = [];
    $(rItem).sortable({
        receive: function(e, ui) {
            ui.sender.sortable("cancel");
            var span = document.getElementById("band").content;
            var s = span.querySelector('[app-role = "band"]');
            s.innerHTML = ui.item[0].innerHTML;
            var appRole = ui.item[0].getAttribute("app-role");
            if (appRole == "category") {
                var cat = rItem.querySelector('[app-role="categories"]');
                if (rItem["DATASTORE"]['cats'].indexOf(s.innerHTML) == -1) {
                    cat.appendChild(document.importNode(span, true));
                    rItem["DATASTORE"]['cats'].push(s.innerHTML);
                }
            }
            if (appRole == "branch") {
                var branch = rItem.querySelector('[app-role="branchname"]');
                if (rItem["DATASTORE"]['branchs'].indexOf(s.innerHTML) == -1) {
                    branch.appendChild(document.importNode(span, true));
                    rItem["DATASTORE"]['branchs'].push(s.innerHTML);
                }
            }
        }
    });
    connectedGroup.push($(rItem));
    $("#catLists").sortable({
        connectWith: connectedGroup
    }).disableSelection();
    $("#branchLists").sortable({
        connectWith: connectedGroup
    }).disableSelection();
    var deleteButton = rItem.querySelector('[app-role="deleteCats"]');
    deleteButton.addEventListener('click', function() {
        rItem.parentNode.removeChild(rItem);
    }, false);
    var changeCatImage = rItem.querySelector('[app-role="changeCatImage"]');
    changeCatImage.addEventListener('click', function() {
        currentImg = rItem.querySelector('[app-role = "categoryImg"]');
        currentDataStore = rItem;
        $("#m_wall").modal();
    }, false);
}


function deleteCatBranchs(elem) {
    var bandCover = getElement(elem, "bandCover");
    console.log("bandCover: ", bandCover);
    var catGroup = getElement(elem, "catGroup");
    console.log("catGroup: ", catGroup);
    var roles = findElemRoles(elem).getAttribute("app-role");
    var itemContent = bandCover.querySelector('[app-role="band"]').innerHTML
    console.log("handler: ", roles);
    var data;
    switch (roles) {
        case "categories":
            data = catGroup["DATASTORE"]["cats"]
            console.log("categories");
            break;
        case "branchname":
            data = catGroup["DATASTORE"]["branchs"]
            console.log("branchname");
            break
    }
    data.splice(data.indexOf(itemContent), 1)
    bandCover.parentNode.removeChild(bandCover);
    console.log(catGroup["DATASTORE"])

    function getElement(el, att) {
        if (el.parentNode.getAttribute('app-role') == att) {
            return el.parentNode;
        } else {
            return getElement(el.parentNode, att);
        }
    }

    function findElemRoles(el) {
        if (el.getAttribute("base-role") !== "handler") {
            return findElemRoles(el.parentNode)
        } else {
            return el;
        }
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
