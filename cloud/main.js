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