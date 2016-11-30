var neededModifyCats = []; // only in category
var newCats = []; // only in pCatValues

pCatValues = ['xanh', 'vang', 'tim', "red", "gaf"];

categories = [{
    "name": "vang",
    "products": [
        "583eb5d1125219a2022feaf6"
    ],
    "branchNames": [
        "mèo"
    ]
}, {
    "name": "xanh",
    "products": [
        "583eb5d1125219a2022feaf6"
    ],
    "branchNames": [
        "mèo"
    ]
}, {
    "name": "blue",
    "products": [
        "583eb5d1125219a2022feaf6"
    ],
    "branchNames": [
        "mèo"
    ]
}, {
    "name": "green",
    "products": [
        "583eb5d1125219a2022feaf6"
    ],
    "branchNames": [
        "mèo"
    ]
}]



// neededModifyCats = categories.filter(function(current) {
//     return !pCatValues.some(function(current_b) {
//         return current_b == current.name
//     });
// });

// var newCats = pCatValues.filter(function(current) {
//     return !categories.some(function(current_a) {
//         return current_a.name = current;
//     });
// })

neededModifyCats = categories.filter(function(obj) {
    return pCatValues.indexOf(obj.name) == -1;
})

var index = categories.map(function(item) {
    return item.name;
});



// var newCats = pCatValues.filter(function(obj) {
//     return index.indexOf(obj) == -1;
// })

var sameInBoth = categories.filter(function(obj){
    return pCatValues.indexOf(obj.name) !== -1;
})



var newCats = pCatValues.filter(function(obj) {
    return categories.map(function(item) {
        return item.name;
    }).indexOf(obj) == -1;
})

console.log("neededModifyCats: ", neededModifyCats);



console.log("newCats: ", newCats);

console.log("sameInBoth: ", sameInBoth);



//
