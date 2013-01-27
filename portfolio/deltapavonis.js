function getPeriod(mass1,mass2,radius) {
var G = 6.673e-11;
var GM = G*(mass1+mass2);
var a3 = Math.pow(radius,3);
var period = 2*Math.PI* Math.sqrt((a3/GM));
return period;
}

function secsToYears(time) {
return (time/(60*60*24*365.4));
}

function secsToDays(time) {
return (time/(60*60*24));
}

function metersTo(length) {
this.AU = length/1.5E12;
this.KM = length/1000;
this.LightYear = length/9460730472580800;
}

function onload() {

   var html = 'Mass 1<select name="mass1">';
   for (body in mass) {
        var sel = (defaults.mass1 == body)?' selected':'';   
       html += '<option value="'+mass[body]+'"'+sel+'>'+body+'</option>';
   }
   html += '</select>';
   document.getElementById('mass1').innerHTML = html;

   var html = 'Mass 2<select name="mass2">';
   for (body in mass) {
	var sel = (defaults.mass2 == body)?' selected':'';   
       html += '<option value="'+mass[body]+'"'+sel+'>'+body+'</option>';
   }
   html += '</select>';
   document.getElementById('mass2').innerHTML = html;

   var html = 'Orbit radius (or semi major axis)<select name="radius">';
   for (dist in oradius) {
        var sel = (defaults.radius == dist)?' selected':'';   
       html += '<option value="'+oradius[dist]+'"'+sel+'>'+dist+'</option>';
   }
   html += '</select>';
   document.getElementById('radius').innerHTML = html;
   
   // Distance given redshift
//   var html = 'Z value<input name="mass1">';
//   for (body in mass) {
//       html += '<option value="'+mass[body]+'">'+body+'</option>';
//   }
//   html += '</select>';
//   document.getElementById('mass1').innerHTML = html;


}

// Masses in kilogrammes
var mass = {'Red Giant':2e+31,
            'Sun':1.9891e+30,
            'Earth':5.976e+24,
            'Moon':7.36e+22,
            'Jupiter':1.9e+27,
            'Pluto':1e+22,
            'Racing Snake':55
           };

// Mean orbital radius (actually semi major axis) in meters
var oradius = {
              '1 Meter':1,
              'Low Earth Orbit':7000000,
              'Earth GeoStationary Orbit':42300000,
              'Moon':4000000000,
              'Mercury':57909175000,
              'Earth':149597870000,
              'Jupiter':778412010000,
              'Pluto':5906376200000,
              '1000 AU':1.5e+14,
              '10000 AU':1.5e+15,
              'One Parsec':3.08568025e+16, 
              '1 Light Year':9.5e+15
             };

var defaults = {'mass1':'Sun','mass2':'Earth','radius':'Earth'}


function calcPeriod_submit(f) {
   var stuff = [];

   // Grab the selected values for each SELECT element in form
   for (var i = 0; i < f.elements.length; i++) {
       var el = f.elements[i];
  
       if (el.tagName == 'SELECT') {
          stuff[el.name] = Number(el.value);
       }
   }
   
   // Calculate orbital period
   var period = getPeriod(stuff['mass1'],stuff['mass2'],stuff['radius']);
   

   if (period > 5000000) {
      period = ''+ secsToYears(period).toFixed(2) +' years.';
   } else {
      period = ''+ secsToDays(period).toFixed(2) +' days.';
   }

   var html = '<br/>Period ='+ period;

   document.getElementById('bleh').innerHTML = html;
}