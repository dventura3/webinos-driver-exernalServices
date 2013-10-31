webinos-driver-exernalServices
==============================

Driver to support external web services for webinos project.

In this moment, there are two examples of exernal services:
- Twitter, to post a tweet by personal account.
- Facebook, to post a message on the wall by personal account.

To add other external web services, it's necessary to implement the driver and put it inside this directory: /lib/drivers/exernalServices/fileXXX.js.
Then, it's necessary to modify the config.json file writing "name" (of api service), "descirption" (of service), "filename" (es. fileXXX.js), other useful information.

####How To Use Twitter driver

To use Twitter and Post something on your account, there are two operations to do.

- Step 1: 
Create a personal Application on https://dev.twitter.com site with personal account.
It's necessary to generate personal access token!

- Step 2:
Then, It's needs to configure the config.json file. Here is an example:
<pre>
{
	"params" : {
		"drivers" : {
			"twitter" : {
				"name" : "Twitter Service",
				"description" : "Connection to Twitter Service to post a tweet",
				"filename" : "twitterDriver.js",
				"appInfo" : {
					"consumerKey" : "...",
					"consumerSecret": "...",
					"accessToken" : "...",
					"accessTokenSecret" : "..."
				}
			}
		}
	}
}
</pre>


####How To Use Facebook driver

To use Facebook and Post something on personal wall, there are two operations to do.
In this module, it isn't implemented the login, which should be in client-application.

- Step 1:
Create a personal Application on https://developers.facebook.com site with personal account.
NB: The callback is necessary when you use an application. The callback should be the address of application.

- Step 2:
Then, It's needs to configure the config.json file. Here is an example:
<pre>
{
	"params" : {
		"drivers" : {
			"facebook" : {
				"name" : "Facebook Service",
				"description" : "Connection to Facebook Service to post a message on the wall",
				"filename" : "facebookDriver.js",
				"appInfo" : {
					"appID" : "...",
					"appSecret": "...",
					"userID" : "..."
				}
			}
		}
	}
}
</pre>