var fs = require('fs')
	, path = require("path")
	, FB = require('../../../node_modules/fb')
	//, express = require('../../../node_modules/express')
	//, http = require('http')
;


var accessToken = null;


(function () {
    
	//To Have App Access Token
	//https://graph.facebook.com/oauth/access_token?client_id="..."&client_secret="..."&grant_type=client_credentials

   //TO CHANGE PERMISSION:  https://developers.facebook.com/tools/explorer/750695701626753 (==> appID)

  	var done = false;

  	var appID = null;
  	var appSecret = null;
  	var userID = null;

    exports.exernalServiceInit = function(){
    	try{
            var filePath = path.resolve(__dirname, "../../../config.json");
            fs.readFile(filePath, function(err,data) {
                if (!err) {
                   var settings = JSON.parse(data.toString());
                    var drivers = settings.params.drivers;
                    try{
                    	appID = drivers.facebook.appInfo.appID;
                        appSecret = drivers.facebook.appInfo.appSecret;
                        userID = drivers.facebook.appInfo.userID;
                        oauth_autentication();
                    }
                    catch(e){
                        console.log("Error to load config file - Check please!" + e);
                    }
                }
            });
        }
        catch(err){
            console.log("Error : "+err);
        }
    }
    
    exports.doPost = function(text_for_post, successCB, errorCB){
/*
    	var url = FB.getLoginUrl({ client_id: appID, scope: 'user_status' });
    	console.log(">>>>>>>>> " + JSON.stringify(url));
*/

/*
//OTTIMUS - DANIELA
		if(done == false){
			executeOAuthLogin();
			done = true;
		}
*/

		postOnWall(text_for_post);
		
    };


/*
    var app = express();

	app.get('/auth/facebook/callback', function(req, res){
		return res.sendfile( require('path').resolve(__dirname, '../../drivers/../..', 'public') + '/success.html');
	});


	app.get('/getAppID', function(req, res) {
		var statusList = {
	      "appID" : appID
	    };

	  	res.writeHead(200, { 'content-type':'application/json',
                          'content-length':statusList.length,
                          'Access-Control-Allow-Origin' : '*'});
	    res.write(JSON.stringify(statusList));
	    return res.end();
	});

	app.listen(3741);
*/

	function oauth_autentication(){	
	    FB.api(
	    		'oauth/access_token'
	    		, {
					client_id: appID,
					client_secret: appSecret,
					grant_type: "client_credentials"
				}
				, function (res) {
				    if(!res || res.error) {
				        console.log(!res ? 'error occurred' : res.error);
				        return;
				    }
				    accessToken = res.access_token;
					FB.setAccessToken(accessToken);
					console.log("Application AccessToken: " + accessToken);
				}
		);
	}

	function executeOAuthLogin(){
		var url = "http://www.facebook.com/dialog/oauth?client_id="+appID+"&redirect_uri=http://local.funnyf7.com:3741/auth/facebook/callback&scope=publish_actions";
		require("openurl").open(url);
	}

	function postOnWall(text_for_post){
		//no 'me/feed'
    	var url =  userID + "/feed";
    	FB.api( url,
			'post', 
			{message: new String(text_for_post.actualValue[0])},
			function (res) {
				if(!res || res.error) {
					console.log(!res ? ' error occurred ' : res.error);
					if(res.error.code == 200){
						console.log("Facebook: no permission to post!");
					}
					return;
				}
				//console.log('Post Id: ' + res.id);
			}
		);
	}

	
}()); 