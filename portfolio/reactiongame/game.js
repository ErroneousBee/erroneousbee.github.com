// Global vars.
var timer1, timer2;
var lasthiscore = 6;

// Functions
// -----------------------------------------------------
function setImages()
{
parent.frames["gameframe"].document.getElementById("blob1").src = "blobblack.gif";
parent.frames["gameframe"].document.getElementById("blob2").src = "blobtrans.gif"
parent.frames["gameframe"].document.getElementById("blob3").src = "blobred.gif"
if (Math.random() > 0.5) {swapImages();}
}

// -----------------------------------------------------
function swapImages()
{
src1 = parent.frames["gameframe"].document.getElementById("blob1").src;
parent.frames["gameframe"].document.getElementById("blob1").src = parent.frames["gameframe"].document.getElementById("blob3").src;
parent.frames["gameframe"].document.getElementById("blob3").src = src1;

}

// -----------------------------------------------------
function startTimer()
{
	// Show the middle image, start a timer
	if (Math.random() > 0.5) {
		parent.frames["gameframe"].document.getElementById("blob2").src = "blobblack.gif";
	}
	else {
		parent.frames["gameframe"].document.getElementById("blob2").src = "blobred.gif";
	}
	timer1 = new Date();
	
	// Make the 2 icons active
	parent.frames["gameframe"].document.getElementById("blob1").onmousedown = imagePressed;
	parent.frames["gameframe"].document.getElementById("blob3").onmousedown = imagePressed;
	
	return;
}

// ------------------------------------------------------
function imagePressed()
{
	// Stop the timer
	timer2 = new Date();
	timer2.setTime(timer2 - timer1);
	
	// Turn off the handlers
	parent.frames["gameframe"].document.getElementById("blob1").onmousedown = null;
	parent.frames["gameframe"].document.getElementById("blob3").onmousedown = null;
	
	// Was the correct image pressed
	if (parent.frames["gameframe"].document.getElementById("blob2").src == parent.frames["gameframe"].document.getElementById(this.id).src) {
		if (addHiScore(timer2.getTime())==true) 
			{message = "Well Done, a High Score!";}
		else 
			{message = "Well Done, but not a High Score!";}
	} else {
		alert("You pressed the wrong one!");
		message = "Ooops!";
	}
	messageArea("Timer: " + timer2.toLocaleTimeString() + "." + timer2.getMilliseconds(),"timerarea");
	messageArea(message,"messagearea");
	
}

// -----------------------------------------------------
function initHiScores()
{
	scores = getCookie("HiScores");
	if (scores == null) {
		scores = "999 AAA,999 BBB,999 CCC,999 DDD,999 EEE";
			setCookie("HiScores",scores,getExpDate(100,0,0));
	}
}
// -----------------------------------------------------
function updateHiScores(scores)
{
	if (scores == null) {
		scores = "999 AAA,999 BBB,999 CCC,999 DDD,999 EEE";
	}
	
	score = scores.split(",");
	score.sort();
	
	// Run along the scores string 
	for (i = 0; i < 5; i++) {
		divid = "00" + i.toString();
		divid = "hiscore" + divid.substr(-2);
		var obj = parent.frames["scoreframe"].document.getElementById(divid);
		pair = score[i].split(" ");
		obj.childNodes[1].innerHTML = pair[0];
		obj.childNodes[3].innerHTML = pair[1];
		obj.style.visibility = "visible";
		if (i==lasthiscore) {obj.style.fontWeight = "bold";}
		else {obj.style.fontWeight = "normal";}
	}

}

// --------------------------------------------------
function addHiScore(newscore)
{
	scores = getCookie("HiScores");
	var score = scores.split(",");
	score.sort();
	var ishiscore = false;

	
	// Insert hi score in array if is a good number
	for (i = 0; i < 5; i++) {
		var pair = score[i].split(" ");		
		if (pair[0] > newscore) {
			insert = "" + newscore + " " + prompt("Congratulations, you have a High Score. Please enter your name"); 
			score.splice(i,0,insert);
			score.pop();
			lasthiscore = i;
			ishiscore = true;
			break;
		}
	}
		
	scores = score.join(",");
	setCookie("HiScores",scores,getExpDate(100,0,0));		
	updateHiScores(scores);
	return ishiscore;
}
// --------------------------------------------------
function resetHiScores()
{
	scores = "999 AAA,999 BBB,999 CCC,999 DDD,999 EEE";
	setCookie("HiScores",scores,getExpDate(100,0,0));
	lasthiscore = 6;
	updateHiScores(hiscores);
}
// -----------------------------------------------------
function messageArea(message,target)
{
	var obj = parent.frames["scoreframe"].document.getElementById(target);
	obj.innerHTML = message;
}

// -----------------------------------------------------
function runStuff()
{
	setImages();
	timeout = Math.round((Math.random() * 1000) + 3000);
	setTimeout('startTimer()',timeout);
}
// -----------------------------------------------------
// Runs when the page has loaded
function onLoad()
{
	hiscores = getCookie("HiScores");
	updateHiScores(hiscores);
}
// -----------------------------------------------------
// Runs when the page first starts running
function onPageStart()
{
	initHiScores();
}
  

