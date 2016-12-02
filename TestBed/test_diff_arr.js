var neededModifyCats = []; // only in category
var newCats = []; // only in pCatValues

pCatValues = ['xanh', 'vang', 'tim', "red", "gaf"];

// secondArr = ['xanh', 'vang', 'dien', 'meo'];
secondArr = ['meo'];

BranchName = ['ga'];

var uq = secondArr.concat(BranchName.filter(function(obj) {
    return secondArr.indexOf(obj) < 0;
}));

console.log("Join uq------------: ", uq);

var uinque = pCatValues.concat(secondArr.filter(function(obj) {
    return pCatValues.indexOf(obj) < 0;
}))

console.log('Join de-duplicate: ', uinque);
// [ 'xanh', 'vang', 'tim', 'red', 'gaf', 'dien', 'meo' ]

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

var sameInBoth = categories.filter(function(obj) {
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

console.log("///////////////////////////////////////////////////////////");

// var oldCatContainSKU = [{
//     name: 'alice',
//     products: ['58412e41c564fd5a10a4dda6'],
//     branchNames: ['mèo']
// }, {
//     name: 'bob',
//     products: ['58412e41c564fd5a10a4dda6'],
//     branchNames: ['mèo']
// }]

var oldCatContainSKU = [{
    "name": "alice",
    "products": [
        "58412e41c564fd5a10a4dda6"
    ],
    "branchNames": [
        "mèo"
    ]
}, {
    "name": "bob",
    "products": [
        "58412e41c564fd5a10a4dda6"
    ],
    "branchNames": [
        "mèo"
    ]
}, {
    "name": "celina",
    "products": [
        "58412e58c564fd5a10a4dda7"
    ],
    "branchNames": [
        "cún"
    ]
}]

var neededModifyCats = oldCatContainSKU.filter(function(obj) {
    return obj.products.indexOf("58412e58c564fd5a10a4dda7") !== -1
})

console.log("neededModifyCats: ", neededModifyCats);
//
