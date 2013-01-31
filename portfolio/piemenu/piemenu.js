// ---------------------------------------------------------
// Globals
var pm = {
 clickedelement:null,
 pieorigin:[0,0],
 iconcount:6,
 iconradius:30, // radius of the icon circle in px
 iconrange:[],
 iconimg:[],
 oldimg:null,
 activesector:null,
 oldonclick:null,
 oldonmousemove:null,
 preventSelect:false,
 pieActive:false, // For MS event model
};

/** 
 * Pre-load piemenu icons
 */
function pm_init_pie_menu_icons() {

pm.iconimg[0] = new Image(20,20);
pm.iconimg[0].src = '../images/dotred.gif';
pm.iconimg[0].highsrc = '../images/dotred_big.gif';
pm.iconimg[0].tooltip = 'Red';

pm.iconimg[1] = new Image(20,20);
pm.iconimg[1].src = '../images/dotgreen.gif';
pm.iconimg[1].highsrc = '../images/dotgreen_big.gif';
pm.iconimg[1].tooltip = 'Green';

pm.iconimg[2] = new Image(20,20);
pm.iconimg[2].src = '../images/dotblue.gif';
pm.iconimg[2].highsrc = '../images/dotblue_big.gif';
pm.iconimg[2].tooltip = 'Blue';

pm.iconimg[3] = new Image(20,20);
pm.iconimg[3].src = '../images/dotyellow.gif';
pm.iconimg[3].highsrc = '../images/dotyellow_big.gif';
pm.iconimg[3].tooltip = 'Yellow';

pm.iconimg[4] = new Image(20,20);
pm.iconimg[4].src = '../images/dotpink.gif';
pm.iconimg[4].highsrc = '../images/dotpink_big.gif';
pm.iconimg[4].tooltip = 'Pink';

pm.iconimg[5] = new Image(20,20);
pm.iconimg[5].src = '../images/dotcyan.gif';
pm.iconimg[5].highsrc = '../images/dotcyan_big.gif';
pm.iconimg[5].tooltip = 'Cyan';

pm.iconimg[6] = new Image(20,20);
pm.iconimg[6].src = '../images/dotred.gif';
pm.iconimg[6].highsrc = '../images/dotred_big.gif';
pm.iconimg[6].tooltip = 'Red again';

pm.iconimg[7] = new Image(20,20);
pm.iconimg[7].src = '../images/dotgreen.gif';
pm.iconimg[7].highsrc = '../images/dotgreen_big.gif';
pm.iconimg[7].tooltip = 'Green again';

}

// Functions
// --------------------------------------------------------
function pm_activate_pie(e) {
	
	var mouseX , mouseY;
	var iconX , iconY;
	
	// Prevent IE events propogating into here when a menu is active.
	if (pm.pieActive) {return false;}
	
	// Normalise the event amd target element for IE or W3C DOM
	// Then chain up parents to node/element that is the container
	e = (e) ? e : ((window.event) ? event : null);
	if (!(e)) {return;}
	var el = (e.target) ? e.target : ((e.srcElement) ? e.srcElement : null);
	while (el.tagName != 'DIV') {
	el = (el.parentElement) ? el.parentElement : el.parentNode ;}
	pm.clickedelement = el;
	
	// Load the images and get info on the window
	var windowWidth =  (window.innerWidth) ? window.innerWidth : document.body.clientWidth;
	var windowHeight = (window.innerHeight) ? window.innerHeight : document.body.clientHeight;

	// Get mousedown position
	if (e.pageX || e.pageY) {
		mouseX = e.pageX;
		mouseY = e.pageY;
        } else if (typeof e.clientX != "undefined") {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}
	
	//Get the absolute location of the clicked element
	var clickedtrail = pm.clickedelement;
	var clickedoffsetLeft = 0;
	var clickedoffsetTop = 0;
	while (clickedtrail) {
		clickedoffsetLeft += clickedtrail.offsetLeft; 
		clickedoffsetTop += clickedtrail.offsetTop;
		clickedtrail = clickedtrail.offsetParent;
	}
				
	// Note the middle of the pie at mouse, may be offset if element was against an edge.
	// Adjust XY away from left/top screen edges
	pm.pieorigin = [Math.max(mouseX,pm.iconradius+10),Math.max(mouseY,pm.iconradius+10)];
        // Adjust XY away from right/bottom scroll edges
        //pm.pieorigin[0] = Math.min(pm.pieorigin[0],document.body.scrollLeft-pm.iconradius-10)
        //pm.pieorigin[1] = Math.min(pm.pieorigin[1],document.body.scrollTop-pm.iconradius-10)
        

	// Build the pie contents
	var theta = (2*Math.PI)/pm.iconcount; // Angle between icons in radians
	var angle = 0;
	var newHTML = '';
	pm.iconrange = [];
	for (i=0;i<pm.iconcount;i++) {
            iconX = (pm.iconradius * Math.sin(angle));
            iconY = -(pm.iconradius * Math.cos(angle));
            iconX += pm.pieorigin[0] - (pm.iconimg[i].width/2);
            iconY += pm.pieorigin[1] - (pm.iconimg[i].height/2);
            newHTML += '<img src="'+ pm.iconimg[i].src +'" class="pieicon" id="pieicon'+ i +'" ';
            newHTML += 'align="middle" height="'+ pm.iconimg[i].height +'" width="'+ pm.iconimg[i].width +'" ';
            newHTML += 'style="position:absolute;left:'+ iconX +'px;top:'+ iconY +'px">';
		
            // Set angle ranges where this icon is selected
            pm.iconrange[i] = [angle-(theta/2),angle,angle,angle+(theta/2)];
            if (pm.iconrange[i][0] < -Math.PI) {
                pm.iconrange[i][0] += 2*Math.PI;
                pm.iconrange[i][1] += 2*Math.PI;
            }
            angle += theta;
            if (angle >= Math.PI) {angle = angle-(2*Math.PI);}
	}                                                                               
	
	// Position the div at event mouse position and activate the menu
	var menudiv = document.getElementById('piemenu');
        menudiv.innerHTML = '<span id="pietooltip"></span><span id="pieicons"></span>';
        
	var menudiv = document.getElementById('pieicons');
	menudiv.innerHTML = newHTML;
	menudiv.style.zIndex = 2;
	menudiv.style.visibility = 'visible';
	menudiv.style.left = pm.pieorigin[0];	
	menudiv.style.top  = pm.pieorigin[1];
	menudiv.style.visibility = 'visible';
	
	// Locate the tooltip somewhere sensible
	var tooltip = document.getElementById('pietooltip');
	tooltip.style.zIndex = 3;
	
	// Is there space on the right
	if ((pm.pieorigin[0] + pm.iconradius + tooltip.style.width) < windowWidth) { //Put it on right
		tooltip.style.left = pm.pieorigin[0] + pm.iconradius + 30;
		tooltip.style.top = pm.pieorigin[1] -15;
	} else if ((pm.pieorigin[1] - pm.iconradius - tooltip.style.height) > 0) { //Put it on top
		tooltip.style.left = pm.pieorigin[0] + pm.iconradius - tooltip.style.width;
		tooltip.style.top = pm.pieorigin[1] - pm.iconradius -15 - tooltip.style.height;
	} else { // Bung in in the middle	
		tooltip.style.left = pm.pieorigin[0]-30;
		tooltip.style.top = pm.pieorigin[1]-15;
	}


	if (document.addEventListener) {
		document.addEventListener("click",pm_select_action,true);
		document.addEventListener("mousemove",pm_mouse_move,false);
	}
	else {
		pm.oldonclick = document.onclick;
		pm.oldmousemove	= document.onmousemove;
		document.onclick = pm_select_action;
		document.onmousemove = pm_mouse_move;
		pm.preventSelect = true;
	}
	
	//Prevent propogation and return
	if (e.preventDefault) {	e.preventDefault();}
	else {e.returnValue = false;}
	if (e.stopPropagation) {e.stopPropagation();}
	else {e.cancelbubble = true;}
	
	pm.pieActive = true;
        
	return false;

}

// --------------------------------------------------------
/**
 * Function:  pm_mouse_move
 * Mouse has moved, a pie is active, to drive any screen updates.
 */
function pm_mouse_move(e) {
	
	var posX, posY;
	
	e = (e) ? e : ((window.event) ? event : null);
	if (!(e)) {return;}

	// Get mouse position
	if (e.pageX || e.pageY) {
            posX = e.pageX  - pm.pieorigin[0];
            posY = e.pageY  - pm.pieorigin[1];
        } else if (typeof e.clientX != "undefined") {
	    posX = e.clientX  - pm.pieorigin[0];
            posY = e.clientY  - pm.pieorigin[1];
	}

	// Small radius => turn off active select
	var radius = Math.sqrt(Math.pow(posY,2) + Math.pow(posX,2))
	if (radius < pm.iconradius/2) {
		if (pm.oldimg != null) {	// Set the old icon back
			pm.oldimg.src = pm.oldimg.oldsrc;
			pm.oldimg = null;
		}
		if (tooltip != null) {
			tooltip.style.visibility = 'hidden';
		}
		activesector = null;
		return false;
	}

	// Get angle in radians. 0=N -pi=S -pi/2=W pi/2=E
	var angle = Math.atan2(posX,-posY);
	var sector = null;
	for (i=0;i<pm.iconcount && sector==null;i++) {
		if ((angle >= pm.iconrange[i][0] && angle <= pm.iconrange[i][1]) 
		|| (angle >= pm.iconrange[i][2] && angle <= pm.iconrange[i][3])) {sector = i;}
	}
	
	// Identify the img associated with this sector and activate focus if we are new here
	var img = document.getElementById('pieicon' + sector);
	var tooltip = document.getElementById('pietooltip');
	if (pm.oldimg != img) {
		if (pm.oldimg != null) {	// Set the old icon back
			pm.oldimg.src = pm.oldimg.oldsrc;
		}
		pm.oldimg = img;
		pm.oldimg.oldsrc = img.src;
		img.src = pm.iconimg[sector].highsrc;
		tooltip.innerHTML = pm.iconimg[sector].tooltip;
		tooltip.style.visibility = 'visible';
		activesector = sector;
	}
	
	pm.preventSelect = false;	
	return false;
}

// --------------------------------------------------------
/**
 * Function: pm_select_action
 * event handler for the pie menu select. 
 * 
 * Simply issues an alert to say what was selected
 */
function pm_select_action(e) {
	
	e = (e) ? e : ((window.event) ? event : null);
	if (!(e)) {return;}

	// Suppress the IE follow through.
	if (pm.preventSelect) {
		preventSelect = false;
		e.cancelbubble = true;
		e.returnValue = false;
		return false;
	}
	
	var menudiv = document.getElementById('piemenu');

	selectedsector = activesector;

	// Close the menu
	menudiv.style.visibility = 'hidden';
        menudiv.innerHTML = '';
        pm.oldimg = null;
        
	activesector = null;

	// Execute the action
	if (selectedsector != null) { alert(pm.iconimg[selectedsector].tooltip + ' activated.');}
	else { alert('cancelled menu');}

	if (document.removeEventListener) {
		document.removeEventListener("click",pm_select_action,true);
		document.removeEventListener("mousemove",pm_mouse_move,false);
	}
	else {
		document.onclick = oldonclick;
		document.onmousemove = oldmousemove;
		pm.preventSelect = false;
	}

	//Prevent propogation
	if (e.preventDefault) {e.preventDefault();}
	else {e.returnValue = false;}
	if (e.stopPropagation) {e.stopPropagation();}
	else {e.cancelbubble = true;}	
	
	pm.pieActive = false;
	return false;
}


