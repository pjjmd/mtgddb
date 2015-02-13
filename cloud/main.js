//This is the funciton that sets the global card variable to a new card, and calls updateCard to update the DOM.
Parse.Cloud.define("getCard", function(request,response) {
// Parse.Query is a parse object with a method of 'find' that will return an array of objects that match the selectors given to it.
var CardObject = Parse.Object.extend("CardObject");
var card=new CardObject();
var query = new Parse.Query("CardObject");
//Here, the only selector I am looking for is that it hasn't had it's gender set.
query.doesNotExist("gender");
//The default size of the array is 100 at it's largest, we want to get 1000 to reduce the amount of repeats the user sees.
query.limit(100);
query.find({success: function(results) { 
//We select a random result from the array.
response.success(results[parseInt((Math.random()*results.length))].get("multiverseid"));
},
//Error handling!		
error: function(error) {
	response.failure("Error with getCard");} 
});
});



Parse.Cloud.define("increment", function(request, response) {
	Parse.Cloud.useMasterKey();
	var CardObject = Parse.Object.extend("CardObject");
	var card=new CardObject();
	var query = new Parse.Query("CardObject");
	var tag=request.params.tag;
	query.equalTo("multiverseid", request.params.id);
	query.find({
		success: function(results) {
			console.log("Query Hello! "+results.length+ " ");
			card=results[0];

			switch (tag) {
				case "man":
				case "woman":
				case "both":
				case "neither":
				case "humanoid":
				card.increment("timesTagged");
				var temp="hooray";
				if (card.has(tag)){
					card.increment(tag);
				}
				else {
					card.set(tag,1);
				}
				if (card.get("timesTagged")>2){
					if (card.get(tag)>=3){
						card.set("gender",tag);
					temp="best";
					}
					else {
						card.set({timesTagged:0,man:0,woman:0,both:0,neither:0,humanoid:0});
					}	
				}
				card.save();
				response.success(temp);
				break;
				default:
				response.failure("boo");
				break;
			}
		},
		error: function() {
			response.error("boo");
		}
	});
});