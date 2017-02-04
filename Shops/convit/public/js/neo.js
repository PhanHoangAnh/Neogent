function createFrontPage(shopInfo) {
    console.log(shopInfo);

    var avatars = shopInfo.avatars;
    var icon = document.querySelector('[app-role="icon"]');
    icon.setAttribute("src", '/' + avatars);

    var wallElems = document.querySelectorAll('[app-role="staticImage"]');
    var walls = shopInfo.walls;

    var wallcount = 0
    for (var i = 0; i < wallElems.length; i++) {
        if (!walls[wallcount]) {
            wallcount = 0;
        }
        wallElems[i].style.backgroundImage = 'url(' + "/" + walls[wallcount] + ')';
        wallcount++;
    }
    // create Promoted Collection
    var collections = shopInfo.collections;
    var promotedColl;
    var hotColls = [];
    var highlightedColls = [];
    collections.forEach(function(item) {
        if (item.isPromoted) {
            promotedColl = item;
        }
        if (item["hotCollection"]) {
            hotColls.push(item);
        }
        if (item["highlightCollection"]) {
            highlightedColls.push(item);
        }
    });
    var masthead = document.getElementById("masthead");
    var promotedCollImage = masthead.querySelector('[app-role="promotedCollImage"]');
    promotedCollImage.setAttribute("src", promotedColl["frontImg"]);
    var promotedCollName = masthead.querySelector('[app-role="promotedCollName"]');

    // create hot Collections:
    var hotCollElems = document.querySelectorAll('[app-role = "hotColls"]');
    var hotCollTitles = document.querySelectorAll('[app-role = "collTitle"]');
    for (var i = 0; i < hotCollElems.length; i++) {
        hotCollElems[i].setAttribute('src', hotColls[i]["frontImg"]);
        hotCollTitles[i].innerHTML = hotColls[i]["name"];
    };

    // merge product of highlightColls;
    var highlightProducts = [];
    highlightedColls.forEach(function(coll) {
        highlightProducts = highlightProducts.concat(coll['productLists'])
    });
    // highlightProducts = highlightProducts.filter(function(elem, post) {
    //     console.log("elem: ", elem, "post: ", post, highlightProducts.indexOf(elem));
    //     return highlightProducts.indexOf(elem) == post;
    // });


    highlightProducts = removeDuplicates(highlightProducts, "id");

    console.log("highlightProducts", highlightProducts);
    // build carousel for highlightProducts
    var hi_length = highlightProducts.length;
    var numberOfRows = Math.floor(highlightProducts.length / 3) + 1;
    if (highlightProducts.length % 3 == 0) {
        numberOfRows = numberOfRows - 1;
    } else {
        hi_length = highlightProducts.length + 3 - (highlightProducts.length % 3);
    }
    console.log("numberOfRows: ", numberOfRows, "hi_length: ", hi_length, highlightProducts.length);

    var carouselContainer = document.getElementById("carouselContainer");
    for (var i = 0; i < numberOfRows; i++) {
        var carouselRow = document.getElementById("carouselRow").content;
        var row = carouselRow.querySelector('[app-role="carouselRow"]');
        row.id = "carousel_" + i;
        carouselContainer.appendChild(document.importNode(carouselRow, true));
    }
    // push single product into row

    for (var i = 0; i < hi_length; i++) {
        with({ n: i }) {
            var k = n;
            if (!highlightProducts[n]) {
                k = n - highlightProducts.length;
            }
            var productItem = document.getElementById("productItem").content;
            var productImage = productItem.querySelector('[app-role="productImage"]');
            productImage.setAttribute('src', highlightProducts[k]["img"]);
            var productName = productItem.querySelector('[app-role="productName"]')
            productName.innerHTML = highlightProducts[k]['name'];
            var carouselRow = document.getElementById("carousel_" + Math.floor(n / 3));
            carouselRow.appendChild(document.importNode(productItem, true));
        }
    }
    var carouselRowElems = document.querySelectorAll('[app-role="carouselRow"]');
    carouselRowElems[0].parentNode.classList.add("active");
    // console.log("caroselRow: ", carouselRowElems);

    // build hot BrandList
    var brandNames = shopInfo.brandNames;
    var hotBrands = brandNames.filter(function(brand) {
        return brand["displayInFrontPage"] == true;
    });
    console.log("hotBrands: ", hotBrands);
    var hotBrandsContainer = document.getElementById('hotBrandsContainer');
    var hotBrandElems = document.querySelectorAll('[app-role = "hotBrand"]');

    for (var i = 0; i < hotBrandElems.length; i++) {
        var hotBrandImg = hotBrandElems[i].querySelector('[app-role = "hotBrandImg"]');
        var hotBrandName = hotBrandElems[i].querySelector('[app-role ="hotBrandName"]');
        var n = i;
        if (!hotBrands[i]) {
            n = i - hotBrands.length;
        };
        hotBrandImg.setAttribute('src', hotBrands[n]["img"]);
        hotBrandName.innerHTML = hotBrands[n]['name'];
    }

    updateStaticContent(shopInfo);

}

function createMenus(shopInfo) {
    var catGroups = shopInfo.catGroups;
    var brandNames = shopInfo.brandNames;
    var mainMenu = document.getElementById('mainMenu');
    var menuId = 0;
    catGroups.forEach(function(catGroup) {
        var menuMainDetails = document.getElementById('menuMainDetails').content;

        var categoriesContainer = menuMainDetails.querySelector('[app-role="categoriesContainer"]');
        categoriesContainer.id = "cat_" + menuId;
        var brandNameContainer = menuMainDetails.querySelector('[app-role="brandNameContainer"]');
        brandNameContainer.id = "brand_" + menuId;


        var categoriesGroupName = menuMainDetails.querySelector('[app-role="categoriesGroupName"]');
        categoriesGroupName.innerHTML = catGroup["Title"];
        mainMenu.appendChild(document.importNode(menuMainDetails, true));

        var cats = catGroup["cats"];
        cats.forEach(function(cat) {
            var singleCategory = document.getElementById('singleCategory').content;
            var singleCat = singleCategory.querySelector('[app-role="singleCat"]');
            singleCat.innerHTML = cat;
            var categoriesContainer = document.getElementById("cat_" + menuId);
            categoriesContainer.appendChild(document.importNode(singleCategory, true));
        });

        var brands = catGroup["brands"];
        brands.forEach(function(brand) {
            var singleBrand = document.getElementById('singleBrand').content;
            var brandImage = singleBrand.querySelector('[app-role="brandImage"]');
            var brandObject = brandNames.filter(function(br) {
                return br['name'] == brand;
            });
            console.log("brandObject: ", brandObject[0]);
            brandImage.setAttribute('src', brandObject[0]["img"]);
            var brandNameContainer = document.getElementById("brand_" + menuId);
            brandNameContainer.appendChild(document.importNode(singleBrand, true));
        });

        menuId++;

    })
}

// utility
function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

function updateStaticContent(shopInfo) {
    var staticContents = shopInfo.staticContents;
    var staticContentsElems = document.querySelectorAll('[app-role = "staticContent"]');

    for (var i = 0; i < staticContents.length; i++) {
        var singleContent = staticContents[i];
        // console.log("singleContent: ", singleContent);
        if (staticContentsElems[i]) {
            var fragment = document.createRange().createContextualFragment(json2html(singleContent));
            staticContentsElems[i].appendChild(fragment);
            // remove attribute contenteditable
            var contenteditables = staticContentsElems[i].querySelectorAll('[contenteditable="true"]');
            contenteditables.forEach(function(elem) {
                elem.setAttribute('contenteditable', false);
            });
            var removedElems = staticContentsElems[i].getElementsByClassName("ql-tooltip ql-hidden");

            for (var j = 0; j < removedElems.length; j++) {
                removedElems[j].parentNode.removeChild(removedElems[j]);
            }
        }
    }
}
