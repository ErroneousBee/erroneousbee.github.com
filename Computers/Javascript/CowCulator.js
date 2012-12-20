var buffer = 0;
var oldbuffer = 0;
var resetBuffer = false;
var currentoperator = "";

/* ------------------------------------------------------------ */
/** Event handler when a number has been pressed */
function pressedNumber(num) {

if (resetBuffer == true) {
   resetBuffer = false;
   buffer = 0;
   /*resetOutField();*/
   }

buffer = (buffer * 10) + num;
setOutfield(buffer);
}

/* ------------------------------------------------------------ */
/** Event handler when an operator +-/x=,etc has been pressed */
function pressedOperator(operator) {
resetBuffer = true;

switch (operator) {
   case "=":
      buffer = evaluate(oldbuffer,buffer,currentoperator);
      setOutfield(buffer);
   break;

   case "+":
   case "-":
   case "*":
   case "/":
      oldbuffer = buffer;
      resetBuffer = true;
      currentoperator = operator;
   break;

   default:
      alert("To Do" + operator);
   break;

} /* switch */
}

/* ------------------------------------------------------------ */
/** Event handler when a number has been pressed */
function pressedThing(what) {

switch (what) {
        case 'undo':
                alert('Undo not yet available');
        break;
        case 'clear':
                buffer = 0;
                oldbuffer = 0;
                resetOutField();
        break;
        default:
                alert(' ' + what + 'is not yet available');
        break;
        }
}


/* ------------------------------------------------------------ */
/** Evaluate this operation */
function evaluate(num1,num2,oper) {
switch (oper) {
 case "+": eval = num1 + num2; break;
 case "-": eval = num1 - num2; break;
 case "*": eval = num1 * num2; break;
 case "/": eval = num1 / num2; break;
 default: eval = "0"; break;
}
return eval
}

/* ------------------------------------------------------------ */
/** Event handler when mouse travels over something */
function mouseOver(symbol) {
window.status=symbol;
}

/* ------------------------------------------------------------ */
/** clears the number buffer */
function clearBuffer() {
buffer= 0;
}

/* ------------------------------------------------------------ */
/** set the output field to nulls */
function resetOutField() {
document.getElementById('out1').src = 'numNull.png'
for (i=1;i<8;i++) {
   j = i + 1;
   id1 = "out" + j;
   id2 = "out" + i;
   document.getElementById(id1).src=document.getElementById(id2).src;
   }
}

/* ------------------------------------------------------------ */
/** move the numbers accross in the output field */
function shiftOutFieldLeft() {
j = 1;
for (i=2;i<=8;i++) {
   id1 = "out" + j;
   id2 = "out" + i;
   document.getElementById(id1).src=document.getElementById(id2).src;
   j++;
   }
}

/* ------------------------------------------------------------ */
/** move the numbers accross in the output field */
function setOutfield(num) {

text = num + ' ';

/* how big is the number */
for (i=1;i<=8;i++) {
   id = "out" + i;
   digit = text.charAt(i-1);
   switch (digit) {
        case "0": document.getElementById(id).src = "num0.png"; break;
        case "1": document.getElementById(id).src = "num1.png"; break;
        case "2": document.getElementById(id).src = "num2.png"; break;
        case "3": document.getElementById(id).src = "num3.png"; break;
        case "4": document.getElementById(id).src = "num4.png"; break;
        case "5": document.getElementById(id).src = "num5.png"; break;
        case "6": document.getElementById(id).src = "num6.png"; break;
        case "7": document.getElementById(id).src = "num7.png"; break;
        case "8": document.getElementById(id).src = "num8.png"; break;
        case "9": document.getElementById(id).src = "num9.png"; break;
        case ".": document.getElementById(id).src = "numPoint.png"; break;
        case "-": document.getElementById(id).src = "numMinus.png"; break;
        default:  document.getElementById(id).src = "numNull.png"; break;
        }
   }
}
