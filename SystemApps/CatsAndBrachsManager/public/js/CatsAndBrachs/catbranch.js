var currentState;

function openModal(event, elem) {
    $("#myModal").modal();
    if (elem.id == "createCat") {
        currentState = "createCat";
    } else {
        currentState = "createBranch"
    }
}

function createNewCategoriesGroup(name) {
    console.log("createNewCategoriesGroup");
    var baseLine = document.getElementById("baseLine");
    var catTemp = document.getElementById("catGroupTemp").content;
    baseLine.parentNode.insertBefore(document.importNode(catTemp, true), baseLine);
}

function createNewBranch(name) {
    console.log("createNewBranch");
    var baseLine = document.getElementById("baseLine");
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
