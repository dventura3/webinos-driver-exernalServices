var fs = require('fs')
	, path = require("path")
	, Twit = require('../../../node_modules/twit')
;

(function () {

	var T = null;

    var tweet_operations = {
          postNewTweet : "statuses/update"
        , sendPrivateMessage : "direct_messages/new"
    };

    exports.exernalServiceInit = function(){
    	try{
            var filePath = path.resolve(__dirname, "../../../config.json");
            fs.readFile(filePath, function(err,data) {
                if (!err) {
                   var settings = JSON.parse(data.toString());
                    var drivers = settings.params.drivers;
                    try{
                        T = new Twit({
                            consumer_key: drivers.twitter.appInfo.consumerKey,
                            consumer_secret: drivers.twitter.appInfo.consumerSecret,
                            access_token: drivers.twitter.appInfo.accessToken,
                            access_token_secret: drivers.twitter.appInfo.accessTokenSecret
                        });
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
    
    exports.doPost = function(text_for_tweet){
        T.post('statuses/update', { status: new String(text_for_tweet.actualValue[0])}, function(err, reply) {
            if(err) {
                console.log("Twitter error! " + err);
            }else{
                console.log("Check your tweet");
            }
        });
    };

}()); 