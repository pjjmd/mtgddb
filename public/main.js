//The parse client and JS API keys.  These will allow you to querey the database.  They will not allow you to alter any of the information on the database.
Parse.initialize("dne7c2bhXwlaVfnSRaTmhMAeSBsZpIXj6LrXNGGy", "IFPDd3CRKLYcLDosnYJWdHp9NzG9ynYr2G75jlw6");   
//Because I don't know how promises work, the code currently uses a global variable with a CardObject object already initiated so my code works.
var CardObject = Parse.Object.extend("CardObject");
var card=new CardObject();
var cardID=1;





//I'm sloppy and have global variables all over the place.
//Listen is a variable for the tutorial section that holds the desired answer for the tutorial, and sets the listenr to only pay attention to that button
var listen="";
//This tracks what stage of the tutorial the user is on.
var stage=0;
//This tracks how many times an entry has been tripple keyed successfully this session.
var successess=0;


//This is the funciton that sets the global card variable to a new card, and calls updateCard to update the DOM.
var getCard=function() {
Parse.Cloud.run('getCard', {}, {
		success: function(result) {
		cardID=result;
		updatePic();
		},
		error: function(error) {console.log(error);}
	});
//We then update the picture on the screen

};

function ding(){
	localStorage.mtgdbTagScore=parseInt(localStorage.mtgdbTagScore)+1;
	console.log("ding!");
	var percentageDone=parseInt(localStorage.mtgdbTagScore);
		if (parseInt(percentageDone)<=100){
	percentageDone=percentageDone%10;
	percentageDone=percentageDone*10;
		}
	else {
	percentageDone=percentageDone%100;
	}
	$(".progress-bar").attr("style","width:"+percentageDone+"%");

	$(".progress-bar").attr("style","width:"+percentageDone+"%");
	var level=parseInt(localStorage.mtgdbTagScore)-(parseInt(localStorage.mtgdbTagScore)%10)
	switch (level) {
		case 0:
		$(".tutorial").text("Level 0: Apprentice");
		break;
		case 10:
		$(".tutorial").text("Level 1: Adept");
		break;
		case 20:
		$(".tutorial").text("Level 2: Task Mage");
		break;
		case 30:
		$(".tutorial").text("Level 4: Academy Researchers");
		break;
		case 40:
		$(".tutorial").text("Level 5: Academy Elite");
		break;
		case 50:
		$(".tutorial").text("Level 6: Guildmage");
		break;
		case 60:
		$(".tutorial").text("Level 7: Grand Librarian");
		break;
		case 70:
		$(".tutorial").text("Level 8: Pathmage");
		break;
		case 80:
		$(".tutorial").text("Level 9: Seer");
		break;
		case 90:
		$(".tutorial").text("Level 10: Elder Dragon");
		break;
		case 100:
		$(".tutorial").text("Level 1: Planeswalker");
		break;
		case 200:
		$(".tutorial").text("Level 2: Tibalt, the Fiend-Blooded");
		break;
		case 300:
		$(".tutorial").text("Level 3: Ashiok, Nightmare Weaver");
		break;
		case 400:
		$(".tutorial").text("Level 4: Jace, the Mind Sculptor");
		break;
		case 500:
		$(".tutorial").text("Level 5: Liliana Vess");
		break;
		case 600:
		$(".tutorial").text("Level 6: Garruk, Caller of Beasts");
		break;
		case 700:
		$(".tutorial").text("Level 7: Garruk, Apex Predator");
		break;
		case 800:
		$(".tutorial").text("Level 8: Nicol Bolas, Planeswalker");
		break;
		case 900:
		$(".tutorial").text("Level 9: Mishra");
		break;
		case 1000:
		$(".tutorial").text("Level 10: Yagmoth");
		break;
		case 1100:
		$(".tutorial").text("Level 11+ Urza");
		break;
		default:
		console.log("womp womp");
		break;
	}
};

//This function emptys the .thumbnail div, and then adds the current image's url.  This should probably be rewritten to only modify the dom once, and also be less reliant on the structure of the html page
function updatePic() {
$(".cardImg").attr("src", 'http://mtgimage.com/multiverseid/'+cardID+'.jpg')
};

//This is a function that calls server side code, since only code that runs on the server can modify the parse database.
function reviewCard (xTag){
	Parse.Cloud.run('increment', { id:cardID,tag:xTag}, {
		success: function(result) {
			//The serverside code will return the phrase 'best' if a card has been tripple keyed.
			if (result==="best"){
//This updates the global variable which will (later on) update the tutorial text to let the user know he has been succesfull in building the database
			ding();
			}
		},
		error: function(error) {}
	});
};

//The tutorial has 4 stages, and iterates over them one at a time. Each time it updates the dom's tutorial text, and then updates the global card variable with the multiverseid of the desired picture
function tutorial() { 
	//checks to see if the tutorial is supposed to be skipped
	if (localStorage.mtgdbTagScore>0) {
	stage=5;
	getCard();
	listen="button";
	localStorage.mtgdbTagScore=parseInt(localStorage.mtgdbTagScore)-1;
	ding();
	}

	if ($(".tutorial").text()==="Pro Mode"){
		stage=5;
		getCard();
	

	}
	//if neitherot, checks what stage of the tutorial the user is on, and sets listeners appropriately
	else if (stage===0){
		$(".tutorial").text("This object has no discernable humanoid characters in it, so mark it as 'neither'.");
		listen="neither";				
	}
	else if (stage===1) { 
		$(".tutorial").text("This object has a humanoid character on it, but it is difficult to identify them as 'Man' or 'Woman', please mark it 'Neither'.");
		cardID=1460;
		updatePic();
		listen="neither";	
	}
	else if (stage===2) {
		$(".tutorial").text("The card features 2 people, so select 'Both'. Try to avoid making decisions like 'the subject of this card is female, so this card is 'Woman'.");
		cardID=15377;
		updatePic();
		listen="both";
	}
	else if (stage===3) {
		cardID=22959;
		updatePic();
		$(".tutorial").text("There is a male character in this image, with difficult to identify masses of people behind him.  Mark this 'Man'.");
		listen="man";	
	}
	else if (stage===4) {
		cardID=2844;
		updatePic();
		$(".tutorial").text("Oh man, Magic has art that is tricky to tag.  Are these goblins all male? Uhm.. maybe? In cases like this, go with your gut. Can you identify atleast 1 male and 1 female goblin in this picture? Mark it 'Both'. Are they all male? Mark it 'Man'. Are their genders indistinguishable? Mark it 'Neither'.");
		listen="button";
		localStorage.mtgdbTagScore=0;
	localStorage.mtgdbTagScore=parseInt(localStorage.mtgdbTagScore)-1;
	}
	stage++
};

//The meat of the program.
$( document ).ready(function() {
	if (localStorage.mtgdbTagScore){
	localStorage.mtgdbTagScore=parseInt(localStorage.mtgdbTagScore)-1;
	ding();
	}
    else {
	localStorage.mtgdbTagScore = 0;
	localStorage.mtgdbTagScore=parseInt(localStorage.mtgdbTagScore)-1;
	ding();
}

	tutorial();
	updatePic();

	$("button").click(function(){
		if ($(this).attr('id')===listen || listen==="button" ){	
			if (stage<5) {
				tutorial();
				updatePic();
			}
			else {
				reviewCard($(this).attr('id'));
				getCard();			
			}
		}
	});

});