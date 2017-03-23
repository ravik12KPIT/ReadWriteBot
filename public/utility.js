var express  = require('express');
var app = express(); 
var bodyParser = require("body-parser"); 
var http = require('http');
var util = require('util');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data
var Utility = {};

Utility.exchangeName = 'SocialIntegration';
Utility.exchangeType = 'direct';
Utility.sapInboxQueueName = "SAPINBOX";

//Utility.sapDevConfig = {'user': 'DTUSER', 'passwd': 'Init123$', 'ashost': 'kcinhjsap12.kpit.com', 'sysnr': '00', 'client': '100'};
//Utility.sapPreProdConfig = {'user': 'DTUSER', 'passwd': 'abcd123$', 'ashost': 'kcinhjsap33.kpit.com', 'sysnr': '02', 'client': '500'};
//Utility.sapProdConfig = {'user': 'DTUSER', 'passwd': 'Kpit123$', 'ashost': 'kcinhjsap19.kpit.com', 'sysnr': '04', 'client': '500'};

//{'user': 'DTUSER', 'passwd': 'Init123$', 'ashost': 'kcinhjsap12.kpit.com', 'sysnr': '00', 'client': '100'}; //DEV
//{'user': 'DTUSER', 'passwd': 'abcd123$', 'ashost': 'kcinhjsap33.kpit.com', 'sysnr': '02', 'client': '500'}; //UAT
//{'user': 'DTUSER', 'passwd': 'Kpit123$', 'ashost': 'kcinhjsap19.kpit.com', 'sysnr': '04', 'client': '500'}; //PROD

//Utility.sapSystemConfig = {'user': 'DTUSER', 'passwd': 'abcd123$', 'ashost': 'kcinhjsap33.kpit.com', 'sysnr': '02', 'client': '500'};
Utility.sapSystemConfig = {'user': 'DTUSER', 'passwd': 'abcd123$', 'ashost': 'hjsaptrn01.kpit.com', 'sysnr': '00', 'client': '500'};

Utility.userNotFound = '{"status":0,"message":"User not found"}';
Utility.userNotAuth = '{"status":0,"message":"Invalid Credentials"}';
Utility.userFound = '{"status":1,"message":"success","isUserValid":"true","tokenId":"e3457285-b604-4990-b902-960bcadb0693","userName":"cognosys","empId":"00120406","empName":"cognosys","email":"cognosys@kpit.com","mobileNumber":"9882185055"}';
Utility.sussess = '{"status":1,"message":"success",';
Utility.failure = '{"status":0,"message":"No data found"}';
Utility.tokenExpire = '{"status":0,"message":"Access token has been expired. Please login again."}';
Utility.invalidData = '{"status":0,"message":"Invalid input Parameters"}';
Utility.error ='{"IT_RETURN":{"STATUS":500,"MESSAGE":"Internal Server Error"}}';// '{"status":500,"message":"Internal Server Error"}';
Utility.errorForPostService ='{"IT_RETURN":[{"STATUS":500,"MESSAGE":"Internal Server Error"}]}';// '{"status":500,"message":"Internal Server Error"}';

Utility.validToken = '{"status":1,"message":"Valid Token"}';
Utility.invalidToken = '{"status":0,"message":"Invalid Token"}';
Utility.invalidJson = '{"IT_RETURN":{"STATUS":0,"MESSAGE":"Invalid JSON data"}}';//'Invalid JSON data';
Utility.lastAccessedDateTime='"lastAccessedDateTime":';

/* SAP parameters details */
Utility.sapProject_function = 'ZDT_PROJ_DETAILS';
Utility.sapProjectAllocation_function = 'ZDT_STAFF_DETAILS';
Utility.sapInboxApproval_function='ZDT_USER_INBOX_WI_LIST';
Utility.sapPRDetails_function='BAPI_PR_GETDETAIL';
Utility.projectId = 'PROJECT_ID';
Utility.date='DATE'; 
Utility.lastupdateddate='LAST_UPDATED_DATE'; 
Utility.empId='EMP_ID'; 
Utility.projectCreatedDateTime='CREATED_DATETIME'; 
Utility.projectAllocationLastUpdatedDateTime='LAST_UPDATED_DATETIME'; 
Utility.messageString = '"RESULT_LIST":[{"status":';
Utility.invalidResponce="Error while updating the request";
Utility.sapServerResponceMessage = "MESSAGE";
Utility.sapMultipleRequestsUpdateStatus="Requests have been updated successfully";


//var MQ_VCAP_SERVICES = '{"p-rabbitmq":[{"name":"test_rmq","label":"p-rabbitmq","tags":["rabbitmq","messaging","message-queue","amqp","stomp","mqtt","pivotal"],"plan":"standard","credentials":{"http_api_uris":["http://d6d7ed99-e99d-4c30-be42-28ede6e14b29:qvdpq70l151islhmh19t8pckhu@10.10.125.95:15672/api"],"ssl":false,"dashboard_url":"http://pivotal-rabbitmq.pcfdev.kpit.com/#/login/d6d7ed99-e99d-4c30-be42-28ede6e14b29/qvdpq70l151islhmh19t8pckhu","password":"qvdpq70l151islhmh19t8pckhu","protocols":{"management":{"path":"/api","ssl":false,"hosts":["10.10.125.95"],"password":"qvdpq70l151islhmh19t8pckhu","username":"d6d7ed99-e99d-4c30-be42-28ede6e14b29","port":15672,"host":"10.10.125.95","uri":"http://d6d7ed99-e99d-4c30-be42-28ede6e14b29:qvdpq70l151islhmh19t8pckhu@10.10.125.95:15672/api","uris":["http://d6d7ed99-e99d-4c30-be42-28ede6e14b29:qvdpq70l151islhmh19t8pckhu@10.10.125.95:15672/api"]},"amqp":{"vhost":"b87c10e0-f632-4daf-bbf6-ae638cddbd7d","username":"d6d7ed99-e99d-4c30-be42-28ede6e14b29","password":"qvdpq70l151islhmh19t8pckhu","port":5672,"host":"10.10.125.95","hosts":["10.10.125.95"],"ssl":false,"uri":"amqp://d6d7ed99-e99d-4c30-be42-28ede6e14b29:qvdpq70l151islhmh19t8pckhu@10.10.125.95:5672/b87c10e0-f632-4daf-bbf6-ae638cddbd7d","uris":["amqp://d6d7ed99-e99d-4c30-be42-28ede6e14b29:qvdpq70l151islhmh19t8pckhu@10.10.125.95:5672/b87c10e0-f632-4daf-bbf6-ae638cddbd7d"]}},"username":"d6d7ed99-e99d-4c30-be42-28ede6e14b29","hostname":"10.10.125.95","hostnames":["10.10.125.95"],"vhost":"b87c10e0-f632-4daf-bbf6-ae638cddbd7d","http_api_uri":"http://d6d7ed99-e99d-4c30-be42-28ede6e14b29:qvdpq70l151islhmh19t8pckhu@10.10.125.95:15672/api","uri":"amqp://d6d7ed99-e99d-4c30-be42-28ede6e14b29:qvdpq70l151islhmh19t8pckhu@10.10.125.95/b87c10e0-f632-4daf-bbf6-ae638cddbd7d","uris":["amqp://d6d7ed99-e99d-4c30-be42-28ede6e14b29:qvdpq70l151islhmh19t8pckhu@10.10.125.95/b87c10e0-f632-4daf-bbf6-ae638cddbd7d"]}}]}';
var rmqusername='',rmqpassword='',rmqvhost='',rmqhostname='';
var dbusername = '', dbpassword = '', dbvhost = '', dbhostname = '', databasename = '', dbjdbcurl = '', dburi='';
if (process.env.VCAP_SERVICES) {

	//var svcInfo = JSON.parse(MQ_VCAP_SERVICES);
	var svcInfo = JSON.parse(process.env.VCAP_SERVICES);
	for(var label in svcInfo) {
	var svcs = svcInfo[label];
	for(var index in svcs) {
		var uri = svcs[index].credentials.uri;   
		console.log("uri:"+uri);
		if (uri.lastIndexOf("amqp", 0) ===0) {
			console.log("amqp uri :"+uri);
			rmqusername = svcs[index].credentials.username;
			rmqpassword = svcs[index].credentials.password;
			rmqvhost = svcs[index].credentials.vhost;
			rmqhostname = svcs[index].credentials.hostname;			
	    	console.log("username :"+rmqusername);
	    	console.log("password :"+rmqpassword);
	    	console.log("vhost :"+rmqvhost);
	    	console.log("hostname :"+rmqhostname);		
		}
		
		if (uri.indexOf("mysql") > -1) {
            console.log("mysql uri :" + uri);
            dbusername = svcs[index].credentials.username;
            dbpassword = svcs[index].credentials.password;        
            dbhostname = svcs[index].credentials.hostname;
            databasename = svcs[index].credentials.name;
            dbjdbcurl = svcs[index].credentials.jdbcUrl;
            dburi = svcs[index].credentials.uri;        
            console.log("username :" + dbusername);
            console.log("password :" + dbpassword);
            console.log("hostname :" + dbhostname);
            console.log("database :" + databasename);
            console.log("meeta cloud db");
        
        }
		
	}
	}
}
Utility.rabbitMQConfig = {
		host: rmqhostname || "localhost"
		,port: 5672
		, login: rmqusername || 'admin'
		, password: rmqpassword || 'admin@123'
		, connectionTimeout: 10000
		, authMechanism: 'AMQPLAIN'
		, vhost: rmqvhost || '/'
		, noDelay: true
		, ssl: {
			enabled : false
		}	
};

Utility.MySqlConfig = {
	    
	    host     : dbhostname || 'mysql.sysdt.kpit.com',
	    user     : dbusername || 'yHshDqKHhhHwQQBV', 
	    password : dbpassword || 'fyRmtpcWu14r4alg',
	    database : databasename || 'cf_39440543_cafc_40c2_92d1_24af0dce7021',
	    port : 3306


	};

module.exports = Utility;