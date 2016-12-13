var currentState;
var baseLine;

function openModal(event, elem) {
    $("#myModal").modal();
    if (elem.id == "createCat") {
        currentState = "createCat";
    } else {
        currentState = "createBranch"
    }
    baseLine = getBaseLine(elem);
}

function createNewCategoriesGroup(name) {
    console.log("createNewCategoriesGroup");
    var catTemp = document.getElementById("catGroupTemp").content;
    baseLine.parentNode.insertBefore(document.importNode(catTemp, true), baseLine);
    var rItem = previousElementSibling(baseLine);
    console.log(rItem);
    $(rItem).sortable({
        receive: function(e, ui) {
            ui.sender.sortable("cancel");
            var span = document.getElementById("band").content;
            var s = span.querySelector('[app-role = "band"]');
            s.innerHTML = ui.item[0].innerHTML;
            var cat = rItem.querySelector('[app-role="categories"]');
            cat.appendChild(document.importNode(span, true));
        }
    });
    $("#catLists").sortable({
        connectWith: $(rItem)
    })
}

function createNewBranch(name) {
    console.log("createNewBranch");
    var catTemp = document.getElementById("branchTemp").content;
    baseLine.parentNode.insertBefore(document.importNode(catTemp, true), baseLine);
}

function createNew() {
    if (currentState == "createCat") {
        createNewCategoriesGroup("abc");
    } else {
        createNewBranch("something");
    }
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
