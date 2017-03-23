// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
//server.listen(8000, function () {
server.listen(process.env.port || process.env.PORT || 3978, function () {
    // server.listen(9999, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var DialogLabels = {
    GetPendingApprovals: 'Get Pending Approvals',
    CreateCompOffRequest: 'Create Comp-Off Requests',
    HRPolicies: 'Find out about HR Policies'
};

var bot = new builder.UniversalBot(connector, [
    function (session) {
        // prompt for Menu options
        builder.Prompts.choice(
            session,
            'Hi, what are you looking for?',
            [DialogLabels.GetPendingApprovals, DialogLabels.CreateCompOffRequest, DialogLabels.HRPolicies],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.GetPendingApprovals:

                return session.beginDialog('GetPendingApprovals');
            case DialogLabels.CreateCompOffRequest:
                return session.beginDialog('CreateCompOffRequest');
            case DialogLabels.HRPolicies:
                return session.beginDialog('HRPolicies');
        }
    }
]);

bot.dialog('GetPendingApprovals', require('./GetPendingApprovals'));
bot.dialog('CreateCompOffRequest', require('./CreateCompOffRequest'));
bot.dialog('HRPolicies', require('./HRPolicies'));

bot.beginDialogAction("ApproveLeave", "/ApproveLeave");
bot.beginDialogAction("RejectLeave", "/RejectLeave");
bot.beginDialogAction("SignIn", "/SignIn");
bot.beginDialogAction("EnterCompOffData", "/EnterCompOffData");

var toKnowSessionValue = "ABC";
var compOffDate = null;
var inTime = null;
var comments = null;


bot.dialog('/SignIn', [
    function (session, args) {
        require("openurl").open("https://kpitbotauthentication.bdt.kpit.com/")
        builder.Prompts.text(session, 'Please login and send your access code here.');
    },
    function (session, results, next) {
        //  session.send("approving leave....");

        //session.beginDialog('GetPendingApprovals');
        console.log("Your access code: " + results.response.entity);
        session.dialogData.leaveId = results.response;
        session.send('Logged in successfully');
        session.replaceDialog('/EnterCompOffData', { reprompt: true });
        //session.send('Lets file your comp-off request!');
        //   builder.Prompts.text(session, 'Please enter Date of your Comp-off leave (dd/mm/yyyy)');
        //  next();
    }

]);




bot.dialog('/EnterCompOffData', [

    function (session) {
        session.send('Lets file your comp-off request!');
        builder.Prompts.text(session, 'Please enter Date of your Comp-off leave (dd-mm-yyyy)');
    },
    function (session, results, next) {
        session.dialogData.compOffDate = results.response;
        compOffDate = session.dialogData.compOffDate;
        var moment = require("moment");
        var IsDateValid = moment(session.dialogData.compOffDate, "DD-MM-YYYY").isValid();
        if (IsDateValid == true) {
            session.replaceDialog('/EnterInTime', { reprompt: true });

        } else {
            session.send('Sorry, Entered datetime is not in required format.');
            //   builder.Prompts.text(session, 'Please enter Date of your Comp-off leave (dd-mm-yyyy)');
            toKnowSessionValue = session.dialogData.leaveId;
            session.replaceDialog('/EnterCompOffData', { reprompt: true });

        }
        //  console.log(session.dialogData.compOffDate);

    }
]);




bot.dialog('/EnterInTime', [
    function (session) {
        builder.Prompts.text(session,
            'Please enter Total In-Time in hours(For ex. If you have worked for 2 hours then enter 2 or if you have worked on 4.5hours then enter 4.5)');
    },
    function (session, results, next) {
        session.dialogData.inTime = results.response;
        var tIt = typeof parseInt(session.dialogData.inTime);
        if (parseInt(session.dialogData.inTime) > 24) {
            session.send('Sorry, Entered In-Time should not be greter then 24.');
            session.replaceDialog('/EnterInTime', { reprompt: true });
        }
        else {
            inTime = session.dialogData.inTime;
            session.replaceDialog('/EnterComment', { reprompt: true });

        }
        //next();
    }
]);

bot.dialog('/EnterComment', [
    function (session) {
        builder.Prompts.text(session, 'Any Comments about this leave - ');
    },
    function (session, results, next) {
        session.dialogData.comments = results.response;
        Comment = session.dialogData.comments;
        //session.send('Applying for your leave.');
        next();
    },
    // Apply for leave
    function (session) {
        console.log(session.dialogData);



        session.send('Ok. Applying for your leave now for %s plese wait...', compOffDate);
        var Client = require('node-rest-client').Client;

        var client = new Client();

        // set content-type header and data as json in args parameter 
        var args = {
            data: {
                "data": {
                    "userName":"ravik12" ,                
                    "compoffDate": compOffDate,
                    "totalInTime": inTime,
                    "lastAccessedDateTime": process.env.lastAccessedDateTime,
                    "deviceId": process.env.deviceId,
                    "tokenId": process.env.tokenId,
                    "appKey": process.env.appKey,
                    "appType":process.env.appType
                }
            },
            headers: { "Content-Type": "application/json" }
        };

        client.post(process.env.createCompOffEndPoint, args, function (data, response) {
            // parsed response body as js object 
            //	console.log(args.data);
            console.log(data);
            var retData = JSON.parse(data);
            var I_Pparam = retData.IT_RETURN;
            if (I_Pparam.STATUS == 200) {
                session.send('Done! Have good time.');
            } else {
                session.send(I_Pparam.MESSAGE);
            	session.endDialog();
            }
            // raw response 
            //	console.log(response.IT_RETURNS);
        });


        //   session.endDialog();
    }
]);




//Approving Leave
bot.dialog('/ApproveLeave', [
    function (session, args) {
        session.dialogData.leaveId = args.data;
        //builder.Prompts.text(session, 'Any Comments about this approval (type N/A for nothing)');
        //var url ="";
        //opn('http://kpitbotauthentication.bdt.kpit.com/');
        //opn('http://kpitbotauthentication.bdt.kpit.com/', {app: 'firefox'});
        require("openurl").open("http://kpitbotauthentication.bdt.kpit.com/")

    },
    function (session, results, next) {
        session.send("approving leave....");
        session.endDialog(session.dialogData.leaveId);
        session.beginDialog('GetPendingApprovals');
        console.log("Your access code: " + results.response.entity);
        session.send('Logged in successfully');
    }
]);

//Approving Leave
bot.dialog('/RejectLeave', [
    function (session, args) {
        session.dialogData.leaveId = args.data;
        builder.Prompts.text(session, 'Any Comments about this Rejection (type N/A for nothing)');
    },
    function (session, results, next) {
        session.send("Rejecting leave....");
        session.endDialog(session.dialogData.leaveId);
        session.beginDialog('GetPendingApprovals');
    }
]);


// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});