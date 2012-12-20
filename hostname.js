// If the top page location is the registry frame
// replace the domain registry frame url with the page url

var newURL = "";
function replaceHostUrl() {
	newURL = location.protocol + "//www.neilhancock.co.uk";
	if (location.pathname != "") { newURL = newURL + location.pathname}
	if (location.search != "")   { newURL = newURL + location.search }
	if (location.hash != "")     { newURL = newURL + location.hash }
	try {
        	// If theres no bannerframe framing us, then exception is thrown and we dont replace,
		test = parent.bannerframe.location.href;
                parent.location.replace(newURL);
	}
	catch (e){}
}

function showInfo() {

document.write("<P> about this Frame" );
//document.write("<br> location.href:" + location.href);
document.write("<br> newURL:" + newURL);
}

function showMoreInfo() {
document.write("<P> Other Stuff" );
//document.write("<br> top.location.href:" + top.location.href);
//document.write("<br> window.location.href:" + window.location.href);
}
