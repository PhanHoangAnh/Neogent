// console.log('collection.js');


var brand;

function GenerateCollPage(shopInfo) {
    category = shopInfo.brand

    // defaulColl = collections.filter(function(coll) {
    //     return coll.id == collId;
    // })[0];
    createLogo(shopInfo.avatars, shopInfo.shopname);
    createMenus(shopInfo);
    createMainBanner(category);
    creageBreadcrumb(category, shopInfo.shopname);
    informNumberOfProduct(category);
    createProductBoard(category['products'], shopInfo.shopname);
}

function createLogo(imgSrc, link) {
    var logo = document.getElementById('logo');
    logo.querySelector('[app-role = "logoLink"]').setAttribute('href', '/' + link);
    logo.querySelector('[app-role = "avatar"]').setAttribute('src', '/' + imgSrc);
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
            singleCat.setAttribute('href', "/" + shopInfo.shopname + "/" + "categories/" + cat['id']);
            singleCat.innerHTML = cat['name'];
            var categoriesContainer = document.getElementById("cat_" + menuId);
            categoriesContainer.appendChild(document.importNode(singleCategory, true));
        });

        var brands = catGroup["brands"];
        brands.forEach(function(brand) {
            var singleBrand = document.getElementById('singleBrand').content;
            var brandImage = singleBrand.querySelector('[app-role="brandImage"]');
            var brandLinks = singleBrand.querySelector('[app-role="menuLink"]');

            var brandObject = brandNames.filter(function(br) {
                return br['name'] == brand;
            });
            brandLinks.setAttribute('href', "/" + shopInfo.shopname + "/" + 'brands/' + brandObject[0]['id']);
            brandImage.setAttribute('src', brandObject[0]["img"]);
            var brandNameContainer = document.getElementById("brand_" + menuId);
            brandNameContainer.appendChild(document.importNode(singleBrand, true));
        });

        menuId++;
    })
}

function createMainBanner(defaulColl) {
    var mainBanner = document.getElementById('mainBanner')
    if (!defaulColl['img']) {
        mainBanner.classList.add('no-bkg');
    } else {
        mainBanner.style.backgroundImage = "url('" + defaulColl['img'] + "')";
    }
    var collectionTitle = mainBanner.querySelector('[app-role = "collectionTitle"]')
    console.log('defaulColl', defaulColl);
    collectionTitle.innerText = defaulColl['name'] + " " + pageType;
    var titleDescription = mainBanner.querySelector('[app-role = "titleDescription"]');
    titleDescription.innerText = defaulColl['collDesc'];

}

function creageBreadcrumb(defaulColl, shopname) {
    var breadcrmbs = document.getElementById('breadcrumbs');
    breadcrumbs.querySelector("[app-role = 'hompage']").setAttribute('href', '/' + shopname);
    breadcrumbs.querySelector("[app-role = 'collections']").setAttribute('href', '/' + shopname + '/' + "Category");
    breadcrumbs.querySelector("[app-role = 'collectionDetails']").innerText = defaulColl['name'];
}

function informNumberOfProduct(defaulColl) {
    var numberOfProduct = document.getElementById('numberOfProduct');
    numberOfProduct.innerText = defaulColl['products'].length + " Products";
}

function createProductBoard(productLists, shopname) {

    var productsBoard = document.getElementById('productsBoard');
    productLists.forEach(function(product) {
        var productItem = document.getElementById('productRowItem').content;
        var productImage = productItem.querySelector('[app-role = "productImage"]');
        productImage.setAttribute('src', product['img']);
        var productLinks = productItem.querySelectorAll('[app-role = "productLink"]');
        productLinks.forEach(function(productLink) {
            productLink.setAttribute('href', '/' + shopname + '/product/' + product['id']);
        });

        var productName = productItem.querySelector('[app-role = "productName"]')
        productName.innerText = product['sysProductName'];
        var productPrice = productItem.querySelector('[app-role = "productPrice"]');
        productPrice.innerText = product['sysCurrentPrice'] + " " + product['sysCurrency']
        productsBoard.appendChild(document.importNode(productItem, true));
    })



};
