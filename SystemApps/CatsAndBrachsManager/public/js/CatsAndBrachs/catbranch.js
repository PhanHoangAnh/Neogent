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
