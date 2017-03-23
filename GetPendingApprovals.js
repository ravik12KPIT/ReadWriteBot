var builder = require('botbuilder');
var TokenValidation = require('./public/tokenValidation.js');
var request = require("request");
//var opn = require('opn');
var openurl = require('openurl');

module.exports = [


	function (session) {
		var leavesPending = [{ "leaveid": 123, "userName": "brijraj singh", "comments": "i need this leave" }];
		var message = new builder.Message()
			.attachmentLayout(builder.AttachmentLayout.carousel)
			.attachments(leavesPending.map(login));
		session.send(message);
		session.endDialog();

		//	session.send('Fetching your pending approvals....');




			//dummy object - get this from database
			//@todo: get pending approvals

		//   var leavesPending = [{"leaveid":123,"userName":"brijraj singh","comments":"i need this leave"},{"leaveid":345,"userName":"Mani bindra","comments":"i need comp-off"}]


		//      var message = new builder.Message()
		//                     .attachmentLayout(builder.AttachmentLayout.carousel)
		//                     .attachments(leavesPending.map(leavesAsAttachments));
		//      session.send(message);
		//      session.endDialog(); 
	}
];

// Helpers
// function leavesAsAttachments(leave) {
//     return new builder.HeroCard()
//         .title(leave.userName)
//         .subtitle(leave.comments)
//         .buttons([
//            builder.CardAction.dialogAction(null, "ApproveLeave", leave.leaveid, "Approve"),
//            builder.CardAction.dialogAction(null, "RejectLeave", leave.leaveid, "Reject"), 
//         ]);
// }

function login(accessCode) {
	return new builder.HeroCard()
		.title("SignIn")
		//.subtitle(leave.comments)
		.buttons([
			builder.CardAction.dialogAction(null, "ApproveLeave", "SignIn", "AUthentication Required"),
			//builder.CardAction.dialogAction(null, "ApproveLeave", leave.leaveid, "Approve"),
			//builder.CardAction.dialogAction(null, "RejectLeave", leave.leaveid, "Reject"), 
		]);
}


