// $(function() {
//     startFacebook(document, 'script', 'facebook-jssdk');
// });
fbHandler = function(fn_cb, loginBnt) {

    startFacebook(document, 'script', 'facebook-jssdk');
    var self = this;

    function checkLoginStatus() {
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    }

    window.fbAsyncInit = function() {
        FB.init({
            appId: '203172309854130',
            cookie: true, // enable cookies to allow the server to access 
            // the session
            xfbml: false, // parse social plugins on this page
            version: 'v2.4' // use version 2.2
        });

        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });

    };

    function startFacebook(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }

    function fetchingInfo(callback) {

        // console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', 'GET', {
            "fields": "id,name,email"
        }, function(response) {
            callback(response);
        });

    }

    function handleFBData(response) {
        // document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
        var _name = response.name;
        // parent.removeChild(visitorHolder);
        FB.api('/me/picture?type=large', function(response) {
            // document.getElementById("profileImage").setAttribute("src", response.data.url);
            // console.log(response.data.url);
            self.fbId = uid;
            self.accessToken = accessToken;
            self.avatar = response.data.url;
            self.fbName = _name;
            setfbObject();
            fn_cb(FbObj);
        });
    }

    var isLoggedIn = false;
    // This is called with the results from from FB.getLoginStatus().
    var uid
    var accessToken;

    function statusChangeCallback(response) {
        self.loginStatus = response.status;
        if (response.status === 'connected') {
            fetchingInfo(handleFBData);
            uid = response.authResponse.userID;
            accessToken = response.authResponse.accessToken;

            // checkToken(uid, accessToken);            
        } else if (response.status === 'not_authorized') {
            addLoginListener();
        } else {
            addLoginListener();
        }

        function addLoginListener() {
            // var login = document.querySelector('#bntFbLogin');
            if (loginBnt) {
                loginBnt.addEventListener('click', fb_enter, false);
            }
        }
    }


    function fb_enter() {
        FB.login(function(response) {
            if (response.status === 'connected') {
                statusChangeCallback(response);
                // Add some related function here                
            }
        }, {})
    }
    var FbObj = {};

    function setfbObject() {
        // self.fbId = uid;
        // self.accessToken = accessToken;
        FbObj.fbId = self.fbId;
        FbObj.fbToken = self.accessToken;
        FbObj.fbAvatar = self.avatar;
        FbObj.loginStatus = self.loginStatus;
        FbObj.fbName = self.fbName;
        return FbObj;
    }
}
