var builder = require('botbuilder');

module.exports = [
	function (session) {
		var leavesPending = [{"leaveid":123,"userName":"brijraj singh","comments":"i need this leave"}];
		var message = new builder.Message()
		                    .attachmentLayout(builder.AttachmentLayout.carousel)
		                    .attachments(leavesPending.map(login));
		     session.send(message);
		     session.endDialog();
		},
    // function (session) {
    //     session.send('Lets file your comp-off request!');
    //     builder.Prompts.text(session, 'Please enter Date of your Comp-off leave (dd/mm/yyyy)');
    // },
    function (session, results, next) {
        session.dialogData.compOffDate = results.response;
        console.log(session.dialogData.compOffDate);
        next();
    },
    
    function (session) {
        builder.Prompts.text(session, 'Total In-Time in hours');
    },
    function (session, results, next) {
        session.dialogData.inTime = results.response;
        next();
    },

    function (session) {
        builder.Prompts.text(session, 'Any Comments about this leave - ');
    },
    function (session, results, next) {
        session.dialogData.comments = results.response;
        //session.send('Applying for your leave.');
        next();
    },

    // Apply for leave
    function (session) {
        console.log(session.dialogData);

        var compOffDate = session.dialogData.compOffDate;
        var inTime = session.dialogData.inTime;
        var comments = session.dialogData.comments;

        session.send('Ok. Applying for your leave now for %s...',compOffDate);
        session.send('Done! Have good time.');

        session.endDialog(); 
    }
];
// function createSigninCard(session) {
//     return new builder.SigninCard(session)
//     .text('BotFramework Sign-in Card')
//         .button('Sign-in', 'https://login.microsoftonline.com')
// }
function login(accessCode) {
   // require("openurl").open("http://kpitbotauthentication.bdt.kpit.com/");
	return new builder.HeroCard()
		.title("SignIn")
		//.subtitle(leave.comments)
		.buttons([
			builder.CardAction.dialogAction(null, "SignIn", "", "Authentication Required"),
			//builder.CardAction.dialogAction(null, "ApproveLeave", leave.leaveid, "Approve"),
			//builder.CardAction.dialogAction(null, "RejectLeave", leave.leaveid, "Reject"), 
		]);
}