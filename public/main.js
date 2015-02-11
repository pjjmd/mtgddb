Parse.initialize("dne7c2bhXwlaVfnSRaTmhMAeSBsZpIXj6LrXNGGy", "IFPDd3CRKLYcLDosnYJWdHp9NzG9ynYr2G75jlw6");   
var CardObject = Parse.Object.extend("CardObject");
var card=new CardObject();
var number=0;
var listen="";
var stage=0;
var successess=0;
card.set("multiverseid",1);

var getCard=function() {
	console.log("Looking for new card");
	var query = new Parse.Query(CardObject);
	query.doesNotExist("gender");
	query.find({success: function(results) {
		number=parseInt((Math.random()*100));
if (results.length<number){
	number=results.length-1;
}
		card=results[number];
		updatePic();},
		error: function(error) {

			console.log("Error with getCard");} });
};



function updatePic() {
	$(".thumbnail").empty();
	$(".thumbnail").append("<img src='http://mtgimage.com/multiverseid/"+card.get("multiverseid")+".jpg' style='height:75%'>");	
};

function reviewCard (xTag){
Parse.Cloud.run('increment', { id:card.get('multiverseid'),tag:xTag}, {
  success: function(result) {
    console.log("result:"+result)
if (result==="best"){
	successess+=1;
	console.log("boop!");
}
  },
  error: function(error) {
  }
});
	
	console.log(card.get('name')+ " tagged with " + xTag);
getCard();
};

function tutorial() { 
	if (stage===0){
		$(".tutorial").text("This object has no discernable humanoid characters in it, so mark it as 'neither'.");
		listen="neither";				
	}
	else if (stage===1) { 
		$(".tutorial").text("This object has a humanoid character on it, but it is difficult to identify them as 'Man' or 'Woman', please mark it 'Humanoid'.");
		card.set("multiverseid",1460);
		listen="humanoid";	
	}
	else if (stage===2) {
		$(".tutorial").text("The card features 2 people, so select 'Both'. Try to avoid making decisions like 'the subject of this card is female, so this card is 'Woman'.");
		card.set("multiverseid",15377);
		listen="both";
	}
	else if (stage===3) {
		card.set("multiverseid",22959);
		$(".tutorial").text("There is a male character in this image, with difficult to identify masses of people behind him.  Mark this 'Man'.");
		listen="man";	
	}
	else if (stage===4) {
		card.set("multiverseid",2844);
		$(".tutorial").text("Oh man, Magic has art that is tricky to tag.  Are these goblins all male? Uhm.. maybe? In cases like this, go with your gut. Can you identify atleast 1 male and 1 female goblin in this picture? Mark it 'Both'. Are they all male? Mark it 'Man'. Are their genders indistinguishable? Mark it 'Humanoid'.");
		listen="button";
	}
	stage++
};




$( document ).ready(function() {
	if ($(".tutorial").text()==="Pro Mode"){
		console.log("Stuff");
		stage=5;
		listen="button";
		getCard();
	}
	else {

	tutorial();
	console.log("Check 1 2");
	console.log($(".tutorial").text())
	}
	updatePic();

	$("button").click(function(){
		console.log("click");
		console.log($(this).attr('id'));
		if ($(this).attr('id')===listen || listen==="button" ){	
			if (stage<5){
				tutorial();
				updatePic();
			}
			else {
				$(".tutorial").text("Number of cards tripple keyed this session: "+successess);
				console.log("Implement me later");
				reviewCard($(this).attr('id'));
			}
		}
	});

});