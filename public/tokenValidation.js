var bodyParser = require("body-parser");

function tokenValidation() {
   return(null);
}
exports = module.exports = tokenValidation;
var Utility = require('../public/utility');
var result='';

tokenValidation.prototype.tokenValidation = function (reqJsonString, callback) {
	
	var http = require('http');
	var jsonObject = JSON.stringify({"data":reqJsonString});
	console.log('jsonObject inputdata :'+jsonObject);
	var postheaders = {
	    'Content-Type' : 'application/json',
	    'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')

	};
	var optionspost = {
	 host :process.env.validateAccessTokenEndPoint,
	 // host :'uat-userauthentication.bdt.kpit.com',
	 //host :'L-4389.kpit.com',
	 //port : 8888,
	 path : '/validateAccessToken', 
	 method : 'POST',
	 headers : postheaders
	};

	var reqPost = http.request(optionspost, function(res) {
		
		res.setEncoding('utf-8');
		var responseString = '';
	    res.on('data', function(d) {
	    responseString += d;
	    console.log("responseString "+responseString);
	    });
	    
	    res.on('end', function() {
	        callback(responseString);
	      });
		
	});	 
	// write the json data
	reqPost.write(jsonObject);
	reqPost.end();
	reqPost.on('error', function(e) {
	    console.error(e);
	    callback(Utility.error);
	});	
};