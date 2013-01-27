// Globals
var menudiv;
var clickedelement;
var pieorigin = [0,0];
var iconcount = 5;
var iconradius = 30; // radius of the icons in px
var iconrange = new Array();
var iconimg = new Array();
var theta;
var oldimg = null;
var activesector = null;
var tooltip = null;
var preventSelect = false;

// Functions
// --------------------------------------------------------
function pieMouseDown (e) {
	
	// Normalise the event amd target element for IE or W3C DOM
	// Then chain up parents to node/element that is the container
	e = (e) ? e : ((window.event) ? event : null);
	if (!(e)) {return;}
	var el = (e.target) ? e.target : ((e.srcElement) ? e.srcElement : null);
	while (el.tagName != 'DIV') {
	el = (el.parentElement) ? el.parentElement : el.parentNode ;}
	clickedelement = el;
	
	// Load the images and get info on the window
	windowWidth =  (window.innerWidth) ? window.innerWidth : document.body.clientWidth;
	windowHeight = (window.innerHeight) ? window.innerHeight : document.body.clientHeight;

	// Get mousedown position
	if (e.pageX || e.pageY) {
		mouseX = e.pageX;
		mouseY = e.pageY;
        } else if (typeof e.clientX != "undefined") {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}
	
	//Get the absolute location of the clicked element
	var clickedtrail = clickedelement;
	var clickedoffsetLeft = 0;
	var clickedoffsetTop = 0;
	while (clickedtrail) {
		clickedoffsetLeft += clickedtrail.offsetLeft; 
		clickedoffsetTop += clickedtrail.offsetTop;
		clickedtrail = clickedtrail.offsetParent;
	}
				
	// Note the middle of the pie at mouse, may be offset if element was against an edge.
	pieorigin = [Math.max(mouseX,document.body.scrollLeft+iconradius+10),Math.max(mouseY,document.body.scrollTop+iconradius+10)];
	maxX = windowWidth-iconradius-20;
	maxY = windowHeight-iconradius-20;
	pieorigin = [Math.min(pieorigin[0],maxX),Math.min(pieorigin[1],maxY)];

	// Build the pie contents
	theta = (2*Math.PI)/iconcount; // Angle between icons in radians
	angle = 0;
	newHTML = '<p style="position:absolute;visibility:hidden" id="pietooltip"></p>';
	iconrange = new Array();
	for (i=0;i<iconcount;i++) {
		iconX = (iconradius * Math.sin(angle)) - parseInt(iconimg[i].width/2);
		iconY = (-iconradius * Math.cos(angle)) - parseInt(iconimg[i].height/2);
		newHTML += '<img src="'+ iconimg[i].src +'" id="pieicon'+ i +'" ';
		newHTML += 'align="middle" height="'+ iconimg[i].height +'" width="'+ iconimg[i].width +'" ';
		newHTML += 'style="position:absolute;left:'+ iconX +'px;top:'+ iconY +'px">';
		// Set angle ranges where this icon is selected
		iconrange[i] = [angle-(theta/2),angle,angle,angle+(theta/2)];
		if (iconrange[i][0] < -Math.PI) {
			iconrange[i][0] += 2*Math.PI;
			iconrange[i][1] += 2*Math.PI;
		}
		angle += theta;
		if (angle >= Math.PI) {angle = angle-(2*Math.PI);}
	}
	
	// Position the div at event mouse position and activate the menu
	menudiv = document.getElementById('piemenu');
	menudiv.innerHTML = newHTML;
	menudiv.style.zIndex = 2;
	menudiv.style.visibility = 'visible';
	menudiv.style.left = pieorigin[0];	
	menudiv.style.top  = pieorigin[1];
	menudiv.style.visibility = 'visible';
	
	// Locate the tooltip somewhere sensible
	tooltip = document.getElementById('pietooltip');
	tooltip.style.zIndex = 3;
	
	// Is there space on the right
	if ((pieorigin[0] + iconradius + tooltip.style.width) < windowWidth) { //Put it on right
		tooltip.style.left = iconradius + 30;
		tooltip.style.top = -15;
	} else if ((pieorigin[1] - iconradius - tooltip.style.height) > 0) { //Put it on top
		tooltip.style.left = iconradius - tooltip.style.width;
		tooltip.style.top = -iconradius -15 - tooltip.style.height;
	} else { // Bung in in the middle	
		tooltip.style.left = -30;
		tooltip.style.top = -15;
	}
	// Is there space below
	// Is there space on the left
	// Is there space above

	if (document.addEventListener) {
		document.addEventListener("mouseup",pieSelect,true);
		document.addEventListener("mousemove",pieMouseMove,false);
	}
	else if (document.attachEvent) {
		document.attachEvent("onmouseup",pieSelect);
		document.attachEvent("onmousemove",pieMouseMove);
		// preventSelect = true;
	}
	
	//Prevent propogation and return
	if (e.preventDefault) {	e.preventDefault();}
	else {e.returnValue = false;}
	if (e.stopPropagation) {e.stopPropagation();}
	else {e.cancelbubble = true;}
	
	return false;

}

// --------------------------------------------------------
function pieMouseMove (e) {
	
	e = (e) ? e : ((window.event) ? event : null);
	if (!(e)) {return;}

	// Get mouse position
	if (e.pageX || e.pageY) {
            posX = e.pageX  - pieorigin[0];
            posY = e.pageY  - pieorigin[1];
        } else if (typeof e.clientX != "undefined") {
	    posX = e.clientX  - pieorigin[0];
            posY = e.clientY  - pieorigin[1];
	}

	// Small radius => turn off active select
	radius = Math.sqrt(Math.pow(posY,2) + Math.pow(posX,2))
	if (radius < iconradius/2) {
		if (oldimg != null) {	// Set the old icon back
			oldimg.src = oldimg.oldsrc;
			oldimg = null;
		}
		if (tooltip != null) {
			tooltip.style.visibility = 'hidden';
		}
		activesector = null;
		return false;
	}

	// Get angle in radians. 0=N -pi=S -pi/2=W pi/2=E
	angle = Math.atan2(posX,-posY);
	sector = null;
	for (i=0;i<iconcount && sector==null;i++) {
		if ((angle >= iconrange[i][0] && angle <= iconrange[i][1]) 
		|| (angle >= iconrange[i][2] && angle <= iconrange[i][3])) {sector = i;}
	}
	
	// Identify the img associated with this sector and activate focus if we are new here
	img = document.getElementById('pieicon' + sector);
	if (oldimg != img) {
		if (oldimg != null) {	// Set the old icon back
			oldimg.src = oldimg.oldsrc;
		}
		oldimg = img;
		oldimg.oldsrc = img.src;
		img.src = iconimg[sector].highsrc;
		tooltip.innerHTML = iconimg[sector].tooltip;
		tooltip.style.visibility = 'visible';
		activesector = sector;
	}
		
	preventSelect = false;
	return false;
}

// --------------------------------------------------------
function pieSelect (e) {
	
	e = (e) ? e : ((window.event) ? event : null);
	if (!(e)) {return;}
	
	// Suppress the IE follow through.
	if (preventSelect) {
		preventSelect = false;
		e.cancelbubble = true;
		e.returnValue = false;
		return false;
	}

	menudiv = document.getElementById('piemenu');
	selectedsector = activesector;

	// Close the menu
	menudiv.style.visibility = 'hidden';
	menudiv.innerHTML = '';
	oldimg = null;
	activesector = null;
	tooltip = null;

	// Execute the action
	if (selectedsector != null) { alert('Sector ' + selectedsector + ' activated.');}
	else { alert('cancelled menu');}

	//Prevent propogation
	if (e.preventDefault) {	e.preventDefault();}
	else {e.returnValue = false;}
	if (e.stopPropagation) {e.stopPropagation();}
	else {e.cancelbubble = true;}
		
	if (document.removeEventListener) {
		document.removeEventListener("mouseup",pieSelect,true);
		document.removeEventListener("mousemove",pieMouseMove,false);
	}
	else if (document.detachEvent) {
		document.detachEvent("onmouseup",pieSelect);
		document.detachEvent("onmousemove",pieMouseMove);
		preventSelect = false;
	}
	
	return false;
}