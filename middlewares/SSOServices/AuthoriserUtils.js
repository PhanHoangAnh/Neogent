function checkAuthorization(req, res, next) {
	//1. check req.shopname
	//2. check req.body.uid
	//3. check whether uid is member of shop
	console.log("via checkAuthorization...........");
    next();
}

module.exports = {
	checkAuth: checkAuthorization
}
