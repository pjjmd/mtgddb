//The parse client and JS API keys.  These will allow you to querey the database.  They will not allow you to alter any of the information on the database.


Parse.initialize("dne7c2bhXwlaVfnSRaTmhMAeSBsZpIXj6LrXNGGy", "IFPDd3CRKLYcLDosnYJWdHp9NzG9ynYr2G75jlw6");   
//Because I don't know how promises work, the code currently uses a global variable with a CardObject object already initiated so my code works.
var CardObject = Parse.Object.extend("CardObject");
var card=new CardObject();
card.set("multiverseid",1);
//I'm sloppy and have global variables all over the place.
//Listen is a variable for the tutorial section that holds the desired answer for the tutorial, and sets the listenr to only pay attention to that button
var listen="";
//This tracks what stage of the tutorial the user is on.
var stage=0;
//This tracks how many times an entry has been tripple keyed successfully this session.
var successess=0;



//This is the funciton that sets the global card variable to a new card, and calls updateCard to update the DOM.
var getCard=function() {
// Parse.Query is a parse object with a method of 'find' that will return an array of objects that match the selectors given to it.
	var query = new Parse.Query(CardObject);
//Here, the only selector I am looking for is that it hasn't had it's gender set.
	query.doesNotExist("gender");
//The default size of the array is 100 at it's largest, we want to get 1000 to reduce the amount of repeats the user sees.
	query.limit(1000);
	query.find({success: function(results) { 
//We select a random result from the array.
		card=results[parseInt((Math.random()*results.length))];
//We then update the picture on the screen
		updatePic();},
//Error handling!		
		error: function(error) {
			console.log("Error with getCard");} });
};


//This function emptys the .thumbnail div, and then adds the current image's url.  This should probably be rewritten to only modify the dom once, and also be less reliant on the structure of the html page
function updatePic() {
	$(".thumbnail").empty();
	$(".thumbnail").append("<img src='http://mtgimage.com/multiverseid/"+card.get("multiverseid")+".jpg' style='height:75%'>");	
};

//This is a function that calls server side code, since only code that runs on the server can modify the parse database.
function reviewCard (xTag){
	Parse.Cloud.run('increment', { id:card.get('multiverseid'),tag:xTag}, {
		success: function(result) {
			//The serverside code will return the phrase 'best' if a card has been tripple keyed.
			if (result==="best"){
//This updates the global variable which will (later on) update the tutorial text to let the user know he has been succesfull in building the database
				successess+=1;
			}
		},
		error: function(error) {}
	});
	console.log(card.get('name')+ " tagged with " + xTag);

};

//The tutorial has 5 stages, and iterates over them one at a time. Each time it updates the dom's tutorial text, and then updates the global card variable with the multiverseid of the desired picture
function tutorial() { 
	//checks to see if the tutorial is supposed to be skipped
	if ($(".tutorial").text()==="Pro Mode"){
		stage=5;
		listen="button";
		$(".tutorial").text("Number of cards tripple keyed this session: "+successess);
		getCard();
	}
	//if not, checks what stage of the tutorial the user is on, and sets listeners appropriately
	else if (stage===0){
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

//The meat of the program.
$( document ).ready(function() {

	
	tutorial();
	updatePic();

	$("button").click(function(){
		if ($(this).attr('id')===listen || listen==="button" ){	
			if (stage<5){
				tutorial();
				updatePic();
			}
			else {
				$(".tutorial").text("Number of cards tripple keyed this session: "+successess);
				reviewCard($(this).attr('id'));
				getCard();			
			}
		}
	});

});