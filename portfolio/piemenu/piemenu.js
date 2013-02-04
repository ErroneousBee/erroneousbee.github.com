// ---------------------------------------------------------
// Globals
var pm = {
    clickedelement: null,
    pieorigin: [0, 0],
    iconcount: 6,
    iconradius: 30, // radius of the icon circle in px
    iconrange: [],
    iconimg: [],
    oldimg: null,
    activesector: null,
    oldonclick: null,
    oldonmousemove: null,
    prevent_select: false,
    pie_active: false, // For MS event model
    type: 'click'
};

/** 
 * Pre-load piemenu icons
 */
function pm_init_pie_menu_icons() {

    pm.iconimg[0] = new Image(20, 20);
    pm.iconimg[0].src = '../images/dotred.gif';
    pm.iconimg[0].highsrc = '../images/dotred_big.gif';
    pm.iconimg[0].tooltip = 'Red';

    pm.iconimg[1] = new Image(20, 20);
    pm.iconimg[1].src = '../images/dotgreen.gif';
    pm.iconimg[1].highsrc = '../images/dotgreen_big.gif';
    pm.iconimg[1].tooltip = 'Green';

    pm.iconimg[2] = new Image(20, 20);
    pm.iconimg[2].src = '../images/dotblue.gif';
    pm.iconimg[2].highsrc = '../images/dotblue_big.gif';
    pm.iconimg[2].tooltip = 'Blue';

    pm.iconimg[3] = new Image(20, 20);
    pm.iconimg[3].src = '../images/dotyellow.gif';
    pm.iconimg[3].highsrc = '../images/dotyellow_big.gif';
    pm.iconimg[3].tooltip = 'Yellow';

    pm.iconimg[4] = new Image(20, 20);
    pm.iconimg[4].src = '../images/dotpink.gif';
    pm.iconimg[4].highsrc = '../images/dotpink_big.gif';
    pm.iconimg[4].tooltip = 'Pink';

    pm.iconimg[5] = new Image(20, 20);
    pm.iconimg[5].src = '../images/dotcyan.gif';
    pm.iconimg[5].highsrc = '../images/dotcyan_big.gif';
    pm.iconimg[5].tooltip = 'Cyan';

    pm.iconimg[6] = new Image(20, 20);
    pm.iconimg[6].src = '../images/dotred.gif';
    pm.iconimg[6].highsrc = '../images/dotred_big.gif';
    pm.iconimg[6].tooltip = 'Red again';

    pm.iconimg[7] = new Image(20, 20);
    pm.iconimg[7].src = '../images/dotgreen.gif';
    pm.iconimg[7].highsrc = '../images/dotgreen_big.gif';
    pm.iconimg[7].tooltip = 'Green again';

}

// Functions
// --------------------------------------------------------
function pm_activate_pie(e) {

    var mouseX, mouseY;
    var iconX, iconY;

    // Prevent IE events propogating into here when a menu is active.
    if (pm.pie_active) {
        return false;
    }

    // Normalise the event amd target element for IE or W3C DOM
    // Then chain up parents to node/element that is the container
    e = (e) ? e : ((window.event) ? event : null);
    if (!(e)) {
        return;
    }
    var el = (e.target) ? e.target : ((e.srcElement) ? e.srcElement : null);
    while (el.tagName != 'DIV') {
        el = (el.parentElement) ? el.parentElement : el.parentNode;
    }
    pm.clickedelement = el;

    // If we activated on mousedown, we are move type, else its click, move, click
    if (e.type == "mousedown") {
        pm.type = "mouseup";
    } else {
        pm.type = "click";
    }

    // Load the images and get info on the window
    var windowWidth = (window.innerWidth) ? window.innerWidth : document.body.clientWidth;
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
    pm.pieorigin = [Math.max(mouseX, pm.iconradius + 10), Math.max(mouseY, pm.iconradius + 10)];
    // Adjust XY away from right/bottom scroll edges
    pm.pieorigin[0] = Math.min(pm.pieorigin[0], windowWidth - document.body.scrollLeft - pm.iconradius - 30);
    pm.pieorigin[1] = Math.min(pm.pieorigin[1], windowHeight - document.body.scrollTop - pm.iconradius - 30);
    
    // Build the pie contents
    var theta = (2 * Math.PI) / pm.iconcount; // Angle between icons in radians
    var angle = 0;
    var newHTML = '';
    pm.iconrange = [];
    for (i = 0; i < pm.iconcount; i++) {
        iconX = parseInt(pm.pieorigin[0] - (pm.iconimg[i].width/2) + (pm.iconradius * Math.sin(angle)));
        iconY = parseInt(pm.pieorigin[1] - (pm.iconimg[i].height/2) - (pm.iconradius * Math.cos(angle)));
        newHTML += '<img src="' + pm.iconimg[i].src + '" class="pieicon" id="pieicon' + i + '" ';
        newHTML += 'align="middle" height="' + pm.iconimg[i].height + '" width="' + pm.iconimg[i].width + '" ';
        newHTML += 'style="left:' + iconX + 'px;top:' + iconY + 'px;">';

        // Set angle ranges where this icon is selected
        pm.iconrange[i] = [angle - (theta / 2), angle, angle, angle + (theta / 2)];
        if (pm.iconrange[i][0] < -Math.PI) {
            pm.iconrange[i][0] += 2 * Math.PI;
            pm.iconrange[i][1] += 2 * Math.PI;
        }
        angle += theta;
        if (angle >= Math.PI) {
            angle = angle - (2 * Math.PI);
        }
    }

    // Position the div at event mouse position and activate the menu
    var menudiv = document.getElementById('piemenu');
    menudiv.innerHTML = '<span id="pietooltip"></span><span id="pieicons"></span>';

    var menudiv = document.getElementById('pieicons');
    menudiv.innerHTML = newHTML;
    menudiv.style.zIndex = 2;
    menudiv.style.visibility = 'visible';
    menudiv.style.left = pm.pieorigin[0];
    menudiv.style.top = pm.pieorigin[1];
    menudiv.style.visibility = 'visible';

    // Locate the tooltip somewhere sensible
    var tooltip = document.getElementById('pietooltip');
    tooltip.style.zIndex = 3;

    // Is there space on the right
    if ((pm.pieorigin[0] + pm.iconradius + tooltip.offsetWidth) < windowWidth) { //Put it on right
        tooltip.style.left = pm.pieorigin[0] + pm.iconradius + 30;
        tooltip.style.top = pm.pieorigin[1] - tooltip.offsetHeight / 2;
    } else if ((pm.pieorigin[1] - tooltip.offsetHeight) > 0) { //Put it on top
        tooltip.style.left = pm.pieorigin[0] + pm.iconradius - tooltip.offsetWidth;
        tooltip.style.top = pm.pieorigin[1] - pm.iconradius - 20 - tooltip.offsetHeight;
    } else { // Bung it underneath  
        tooltip.style.left = pm.pieorigin[0] - tooltip.offsetWidth / 2;
        tooltip.style.top = pm.pieorigin[1] + pm.iconradius + 15;
    }

    if (document.addEventListener) {
        document.addEventListener(pm.type, pm_select_action, true);
        document.addEventListener("mousemove", pm_mouse_move, false);
    } else if (document.attachEvent) {
        document.attachEvent("on" + pm.type, pm_select_action);
        document.attachEvent("onmousemove", pm_mouse_move);
    } else {
        alert("Your browser does not support any useful event models.");
        return false;
    }

    //Prevent propogation to other elements and the browser default action.
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelbubble = true;
    }

    // IE appears to get the mouse events that occured before we registered listeners, so we
    // have to maintain our own state to deal with IE being confused.
    pm.pie_active = true;
    pm.prevent_select = true;

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
    if (!(e)) {
        return;
    }

    // Get mouse position
    if (e.pageX || e.pageY) {
        posX = e.pageX - pm.pieorigin[0];
        posY = e.pageY - pm.pieorigin[1];
    } else if (typeof e.clientX != "undefined") {
        posX = e.clientX - pm.pieorigin[0];
        posY = e.clientY - pm.pieorigin[1];
    }

    var tooltip = document.getElementById('pietooltip');

    // Small radius => turn off active select
    var radius = Math.sqrt(Math.pow(posY, 2) + Math.pow(posX, 2));
    if (radius < pm.iconradius) {
        if (pm.oldimg != null) { // Set the old icon back
            pm.oldimg.src = pm.oldimg.oldsrc;
            pm.oldimg = null;
        }
        if (tooltip != null) {
            tooltip.style.visibility = 'hidden';
        }
        pm.activesector = null;
        return false;
    }

    // Get angle in radians. 0=N -pi=S -pi/2=W pi/2=E
    var angle = Math.atan2(posX, -posY);
    var sector = null;
    for (i = 0; i < pm.iconcount && sector == null; i++) {
        if ((angle >= pm.iconrange[i][0] && angle <= pm.iconrange[i][1]) || (angle >= pm.iconrange[i][2] && angle <= pm.iconrange[i][3])) {
            sector = i;
        }
    }

    // Identify the img associated with this sector and activate focus if we are new here
    var img = document.getElementById('pieicon' + sector);
    if (pm.oldimg != img) {
        if (pm.oldimg != null) { // Set the old icon back
            pm.oldimg.src = pm.oldimg.oldsrc;
        }
        pm.oldimg = img;
        pm.oldimg.oldsrc = img.src;
        img.src = pm.iconimg[sector].highsrc;
        tooltip.innerHTML = pm.iconimg[sector].tooltip;
        tooltip.style.visibility = 'visible';
        pm.activesector = sector;
    }

    pm.prevent_select = false;
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
    if (!(e)) {
        return;
    }

    // Suppress the IE follow through.
    if (pm.prevent_select) {
        prevent_select = false;
        e.cancelbubble = true;
        e.returnValue = false;
        return false;
    }

    var menudiv = document.getElementById('piemenu');

    // Close the menu
    menudiv.style.visibility = 'hidden';
    menudiv.innerHTML = '';

    // Execute the action
    if (pm.activesector != null) {
        alert(pm.iconimg[pm.activesector].tooltip + ' activated.');
    } else {
        alert('cancelled menu');
    }

    if (document.removeEventListener) {
        document.removeEventListener(pm.type, pm_select_action, true);
        document.removeEventListener("mousemove", pm_mouse_move, false);
    } else if (document.detachEvent) {
        document.detachEvent("on" + pm.type, pm_select_action);
        document.detachEvent("onmousemove", pm_mouse_move);
    } else {
        alert("Your browser does not support any useful event models.");
        return false;
    }
    
    // Reset the pm object
    pm.oldimg = null;
    pm.pie_active = false;
    pm.activesector = null;

    //Prevent propogation
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelbubble = true;
    }

    return false;
}
