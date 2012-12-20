import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class Reversi extends java.applet.Applet
    implements MouseListener, Runnable {
	int i;				// counter, and yes, Ive just worked out that putting loop controls as class vars is dumb.
	int j;				// counter
	ReversiBoard board;
    Button resetbutton, passbutton; // Two buttons
    Label label20, label30;         // Count and simple message labels
    Label label01;                  // Long message
    Canvas canvas02;                // Space reserved for board
    int canvastop;                  // Verticle offset from 0 to top of board canvas
	Image counter0Image;
	Image counter1Image;
	Image counter2Image;
	Graphics g;
	final Color BACKGCOLOR = new Color(0,128,0);
	Thread runner;
	String label01text;                     // Text to go in long message area
    final int BOARDY = 100;                 // How far down the top of the board is
    final int BOARDH = 400;                 // How high the board is



// Unused mouselistener methods
public void mouseMoved(MouseEvent e) {}
public void mousePressed(MouseEvent e) {}
public void mouseEntered(MouseEvent e) {}
public void mouseExited(MouseEvent e) {}
public void mouseReleased(MouseEvent e) {}
public void mouseDrag(MouseEvent e) {}

/* ----------------------------------------------------------- */
// React to mouse presses.
public synchronized void mouseClicked(MouseEvent e) {

	// Dont do it if game is already won
	if (board.gameIsWon() == true) {
        setLabels("Game is over. No more moves available.");
        return;
    }

	// Get the xy co-ords of the click
	int x = e.getX();
	int y = e.getY();

	// Convert xy click point into grid values
	int thisx = x/50;
	int thisy = (y-BOARDY)/50;

    // This is the main logic for controling the board.
	try {
	    int gridvalue = board.getGridValue(thisx,thisy);
	    if (board.isItLegal(board.nextplayer,thisx,thisy)) {

		    // Make the move, then see what moves the next player can make.
		    board.makeMove(thisx,thisy);

	    } // if legal move
	    else {
	        label01text = board.getPlayerName(board.nextplayer) + " cannot move at " + board.gridName(thisx,thisy);
	    }

	} // try
	catch (ArrayIndexOutOfBoundsException eeek) {
	    label01text = board.getPlayerName(board.nextplayer) + " clicked off of board area.";
	}

	postMoveStuff(label01text);
    label01text = "";

}

/* ----------------------------------------------------------- */
public void init() {

	ReversiButtons he = new ReversiButtons(this);           // Button handler created

    // Create gridbag layout and constraints objects.
	GridBagLayout gridbag = new GridBagLayout();
	GridBagConstraints constraints = new GridBagConstraints();
	setLayout(gridbag);

	// Initialise Buttons and their listner class.
	buildConstraints(constraints,2,0,1,1,1,1);              // Reset button
	resetbutton = new Button("Reset");                      // Button object created
	resetbutton.addActionListener(he);                      // Tell button handler to listen for reset button
	gridbag.setConstraints(resetbutton,constraints);
	add(resetbutton);                                       // Tell layout manager to manage this button

	buildConstraints(constraints,1,0,1,1,1,1);              // Pass button.
	passbutton = new Button("Pass");
	passbutton.addActionListener(he);
	gridbag.setConstraints(passbutton,constraints);
	add(passbutton);

	buildConstraints(constraints,0,0,1,1,1,1);              // Text lable for counts
    label20 = new Label("");
	gridbag.setConstraints(label20,constraints);
	add(label20);

	buildConstraints(constraints,3,0,1,1,1,1);              // Text lable for mover
    label30 = new Label("Red to move");
	gridbag.setConstraints(label30,constraints);
	add(label30);

	buildConstraints(constraints,0,1,6,1,1,1);              // Text lable for message area
    constraints.fill = GridBagConstraints.HORIZONTAL;
    label01 = new Label(" ");
	gridbag.setConstraints(label01,constraints);
	add(label01);
	label01text = " ";

	buildConstraints(constraints,0,2,1,1,1,18);             // Null label for the board
	canvas02 = new Canvas();
	gridbag.setConstraints(canvas02,constraints);
	add(canvas02);
	canvastop = canvas02.getBounds().y;
	canvastop = canvas02.getBounds().height;

	// Get the images.
	counter0Image = getImage(getCodeBase(), "counter0.gif");
	counter1Image = getImage(getCodeBase(), "counter1.gif");
	counter2Image = getImage(getCodeBase(), "counter2.gif");

    // Set the board background colour
    setBackground(BACKGCOLOR);

    // Construct the board object, and use the reset do do more init stuff.
    board = new ReversiBoard();

    // Set up the players
    board.setPlayerName(board.PLAYER1,"Black");
    board.setPlayerName(board.PLAYER2,"White");
    board.p[board.PLAYER2].setComputerPlayer(true);

	// Reset the label text to something better
	label30.setText(moveMessage());
    label20.setText(countMessage());

}

/* ----------------------------------------------------------- */
/** Reset the board for new game. */
public void reset() {
	board.clearBoard();
    setLabels("Game Reset.");
    repaint();
}
/* ----------------------------------------------------------- */
/** Player hit pass button, react accordingly by passing move, or rejecting pass. */
public void pass() {

    // If the player can actually make a move, then say so.
    if (board.isMoveAvailable() == true) {
        setLabels(board.getPlayerName(board.nextplayer) + " cannot pass.");
        return;
    }

    // pass the player
    board.passMove();
    postMoveStuff(board.getPlayerName(board.lastplayer) + " passed.");

}
/* ----------------------------------------------------------- */
/** Things to do when weve just made/passed a move */
public void postMoveStuff(String text) {

    // Write message to label, and clear text for next click
    setLabels(text);

    // if the game is won , stop here.
    if (board.gameIsWon() == true) {
        board.countPieces();
        setLabels("Game is over. No more moves available.");
        repaint();
        return;
    }

	// Calculate and make the computers move.
	if (board.p[board.nextplayer].isComputerPlayer() == true) {makeComputerMove();}
	repaint();
}

/* ----------------------------------------------------------- */
/** called if the player is marked as a computer player. */
public void makeComputerMove() {

    // Pass if we must
    if (board.isMoveAvailable() == false) {
        board.passMove();
        setLabels("Computer has passed");
        paint(this.getGraphics());
        return;
    }

    // Start the timer so that the folks can see what they done
    long stopTime = waitSet((long) 2000);
    setLabels("Computer is thunking....");


    // Show the last move by calling paint explicitly.
    paint(this.getGraphics());

    // Calculate the best move and make it
    Point computermove = board.calcMove(board.nextplayer);
    waitTill(stopTime);
    board.printGrid();
    board.makeMove(board.nextplayer,computermove);

    // Update the labels to reflect the latest positions
    setLabels("Computer moves at " + board.gridName(computermove));
    repaint();

}
/* ----------------------------------------------------------- */
public synchronized void paint(Graphics g) {

    int x1,y1,x2,y2;  // Canvas co-ords created from board points

	// Draw Board
    for (i=0; i<8; i++) {
	    // Draw grid lines
	    g.setColor(Color.black);
	    g.drawLine(0,(i*50)+BOARDY,400,(i*50)+BOARDY);    // Horizontal
	    g.drawLine(i*50,BOARDY,i*50,BOARDY+BOARDH);   // Vertical
        g.setColor(BACKGCOLOR);

	    // Draw counters
		for (j=0; j<8; j++) {
			switch (board.getGridValue(i,j)) {
			case board.PLAYER1:
				g.drawImage(counter1Image, 3+(50*i), 3+(50*j)+BOARDY,45,45,BACKGCOLOR,this);
				break;
			case board.PLAYER2:
				g.drawImage(counter2Image, 3+(50*i), 3+(50*j)+BOARDY,45,45,BACKGCOLOR,this);
				break;
			case board.PLAYER0:
				g.fillRect(3+(50*i),3+(50*j)+BOARDY,45,45);
				break;
			case board.LEGALMOVE:
			    g.drawImage(counter0Image, 3+(50*i), 3+(50*j)+BOARDY,45,45,BACKGCOLOR,this);
			    break;
			}
		}

	}

    // Draw final grid lines.
	g.setColor(Color.black);
	g.drawLine(0,BOARDY+BOARDH,400,BOARDY+BOARDH);    // Horizontal
	g.drawLine(400,BOARDY,400,BOARDY+BOARDH);   // Vertical

    // Could do something fancy with board.getIsWon() here

}
/* ----------------------------------------------------------- */
/** Set the text for all the labels and paint to show them. */
public void setLabels(String longtext) {

    // Write long message to label.
    label01.setText(longtext);

    // Set the move and count text labels to reflect new positions.
	label30.setText(moveMessage());
    label20.setText(countMessage());

}
/* ----------------------------------------------------------- */
/** returns the 'Red to move' string */
String moveMessage() {
    if (board.gameIsWon() == true) { return "Game Over"; }
    else { return board.getPlayerName(board.nextplayer) + " to move."; }
}
/* ----------------------------------------------------------- */
/** returns the string that says 'Red: 10 / Black: 16 */
String countMessage() {
    return board.getPlayerName(board.PLAYER1) + ":" + board.howManyPieces(board.PLAYER1) + " / " + board.getPlayerName(board.PLAYER2)+ ":" + board.howManyPieces(board.PLAYER2);
}

/* ----------------------------------------------------------- */
/** Do wait for specified number of milliseconds */
public void waitTill(long stopTime) {
    long timeDiff = stopTime - System.currentTimeMillis();
	if (timeDiff > 0) {
	    try {runner.sleep(timeDiff);}
	    catch (InterruptedException junk) {/* Weve been woken up, but we dont complain */}
	}
}
/** Set wait for specified number of milliseconds */
public long waitSet(long duration) {
    return (long) System.currentTimeMillis() + duration;
}

/* ----------------------------------------------------------- */
/** Set the constaints for a gridbag thing. From the book. */
void buildConstraints(GridBagConstraints gbc, int gx, int gy, int gw, int gh, int wx, int wy) {
    gbc.gridx       = gx;
    gbc.gridy       = gy;
    gbc.gridwidth   = gw;
    gbc.gridheight  = gh;
    gbc.weightx     = wx;
    gbc.weighty     = wy;
    gbc.fill        = GridBagConstraints.NONE;
    gbc.anchor      = GridBagConstraints.CENTER;
}

/* ----------------------------------------------------------- */
// Start and stop Threads
public void start() {
	if (runner == null) {
		runner = new Thread(this);
		runner.start();
	}
}
public void run () {
	addMouseListener(this);
}

} // End of class Reversi