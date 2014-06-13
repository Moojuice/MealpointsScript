// https://acadinfo.wustl.edu/CBORD/MealPlan/ URL in which we are going to use
function main() {
	console.log("beginning sequence");
	parse();
	console.log("successfully parsed");
	calculateValues();
	console.log("successfully calculated values");
	makePopUp();
	console.log("popup formed");
}

//An array to store all of our transactions
var transactions = [];

//The object we use to store information, I'm deciding to keep everything for now since you never know what will be useful. 
function transaction(date, location, transaction, tender_used, amount_of_sale, current_balance) {
	this.date = date;
	this.location = location;
	this.transaction = transaction;
	this.tender_used = tender_used;
	this.amount_of_sale = amount_of_sale;
	this.current_balance = current_balance;
}

//Our parsing function, goes through the table and stores the information 
function parse() {
	var trand, lo, tr, tu, aos, cb;
	var column = 0;
	$('#dgGetHistory tr td').each(function() { //The table of information is identified with the particular id, so we iterate through the table elements using the jQuery each function
		if (column == 0) { 
			trand = $(this).text(); //transaction date
			//console.log("transaction date: " + trand);
		}
		if (column == 1) {
			lo = $(this).text(); //locations
			//console.log("location: " + lo);
		}
		if (column == 2) {
			tr = $(this).text(); //transaction
			//console.log("transaction: " + tr);
		}
		if (column == 3) {
			tu = $(this).text(); //tender used
			//console.log("tender used: " + tu);
		}
		if (column == 4) { //we convert money amounts to decimal values 
			aos = parseFloat($(this).text()); //amount of sale
			//console.log("amount of sale " + aos);
		}
		if (column == 5) {
			cb = parseFloat($(this).text()); //current balance
			column = -1; //reset 
			transactions[transactions.length] = new transaction(trand, lo, tr, tu, aos, cb); //add our new transaction 
			trand, lo, tr, tu, aos, cb = undefined; //reset values 
			//console.log("current_balance: " + cb);
		}
		column++;
	});
	transactions.shift(); //first and last rows are not useful 
	transactions.pop();
	console.log(transactions);
}

//generate popup with information
function makePopUp() {
    var d = document.createElement('div'), b;
    d.style.cssText = '\
position: fixed;\
left: 50%;\
top: 25%;\
width: 400px;\
margin-left:-200px;\
margin-top:-150px;\
border:1px solid black;\
background-color:white;\
color:black;\
padding:20px;\
font-size:13px;\
text-align:left;\
z-index:501;';
    d.innerHTML = '<h2>Comprehensive WashU Mealpoint Details</h2>\
<button style="position:absolute;top:0;right:0;">X</button>\
<p>by <a href="http://github.com/MooJuice">Kyle Liu</a> and Prag Batra</p>\
<p>A script used to calculate stats about your eating history. Relevant for up to last 24 purchases. \
<br /> Time stats and overall statistics are under construction. Suggestions? Please e-mail kyleliu[at]wustl.edu</p>\
<br />\
<br />\
<p>Average amount spent: <span id = "avgspent"></span> </p>\
<p>Largest amount spent: <span id = "largestspent"></span> on <span id ="datemostspent"> at <span id ="placemostspent"></span> </p>\
<p>Place eaten at the most: <span id = "favlocation"></span> </p>\
<p>Total amount spent at that location and average amount spent there: <span id ="locationtotal"></span> and <span id ="locationavg"></span> </p> \
<p>Largest amount spent at that location: <span id = "locationlargest"></span> </p>\
<p>Most common time range purchased food: <span id ="timepurchase"></span> </p>';
	
// 	d.innerHTML = '<h2>Comprehensive WashU Mealpoint Details</h2>\
// <button style="position:absolute;top:0;right:0;">X</button>\
// <p>by <a href="http://github.com/MooJuice">Kyle Liu</a> and Prag Batra</p>\
// <p>A script used to calculate stats about your eating history. Relevant for up to last 24 purchases. \
// <br /> Time stats and overall statistics are under construction. Suggestions? Please e-mail kyleliu[at]wustl.edu</p>\
// <br />\
// <br />\
// <p>Average amount spent: $<span id = "avgspent"></span> </p>\
// <p>Largest amount spent: $<span id = "largestspent"></span> on <span id ="datemostspent"> at <span id ="placemostspent"></span> </p>\
// <p>Place eaten at the most: <span id = "favlocation"></span> </p>\
// <p>Total amount spent at that location and average amount spent there: $<span id ="locationtotal"></span> and $<span id ="locationavg"></span> </p> \
// <p>Largest amount spent at that location: $<span id = "locationlargest"></span> </p>\
// <p>Most common time range purchased food: <span id ="timepurchase"></span> </p>';
    document.body.appendChild(d);
    assignValues();
    d.getElementsByTagName('button')[0].addEventListener('click', function () {
        document.body.removeChild(d);
    }, true);
    return d;
}

var avgSpent, largestSpent, dateMostSpent, locMostSpent, favPlace, locationTotal, locationAvg, locationLargest, timePurchase;
//calculate and fill popup
function calculateValues() {
	var totalSpent = transactions[transactions.length-1].current_balance - transactions[0].current_balance;
	avgSpent = (totalSpent/transactions.length).toFixed(2);

	var currentMostSpent = 0;
	var currentMostSpentTransaction;

	var location_occurrances = [];
	var locations = [];

	for (var i = 0; i < transactions.length; i++) {
		var locExists = false;
		if (transactions[i].amount_of_sale > currentMostSpent) {
			currentMostSpent = transactions[i].amount_of_sale;
			currentMostSpentTransaction = transactions[i];
		}
		if (i == 0) {
			location_occurrances[location_occurrances.length] = 1;
			locations[locations.length] = transactions[0].location;
		}
		else {
			for (var j = 0; j < locations.length; j++) {
				if(locations[j] == transactions[i].location) {
					location_occurrances[j]++;
					locExists = true;
				}
			}
			if (!locExists) {
				location_occurrances[location_occurrances.length] = 1;
				locations[locations.length] = transactions[i].location;
			}
		}
	}

	largestSpent = (currentMostSpent).toFixed(2);
	dateMostSpent = currentMostSpentTransaction.date;
	locMostSpent = currentMostSpentTransaction.location; 

	var numTimesEaten = location_occurrances[0];
	var indexOfLocation = 0;

	for (var k = 1; k < location_occurrances.length; k++) {
    	if (location_occurrances[k] > numTimesEaten) {
    	    indexOfLocation = k;
    	    numTimesEaten = location_occurrances[k];
    	}
	}

	favPlace = locations[indexOfLocation];

	var runningSum = 0;
	var largestSpentFavLoc = 0;

	for (var l = 0; l < transactions.length; l++) {
		if (transactions[l].location == favPlace) {
			if (transactions[l].amount_of_sale > largestSpentFavLoc) {
				largestSpentFavLoc = transactions[l].amount_of_sale;
			}
			runningSum += transactions[l].amount_of_sale;
		}
	}

	locationTotal = runningSum;
	locationAvg = (runningSum/numTimesEaten).toFixed(2);

	locationLargest = largestSpentFavLoc; 
}

//assign values to the popup
function assignValues() {
	$('#avgspent').html(avgSpent);
	$('#largestspent').html(largestSpent);
	$('#datemostspent').html(dateMostSpent);
	$('#placemostspent').html(locMostSpent);
	$('#favlocation').html(favPlace);
	$('#locationtotal').html(locationTotal);
	$('#locationavg').html(locationAvg);
	$('#locationlargest').html(locationLargest);
	$('#timepurchase').html("not available yet");
}