import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class TicTacToe extends java.applet.Applet
    implements MouseListener, Runnable {
	int i;				// counter
	int j;				// counter
	Color gridColor = Color.black;
	TicTacToeBoard board;
	Button resetButton;
	Label label;
	Image crossImage;
	Image noughtImage;
	Graphics g;
	Thread runner;

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
	// Get the xy co-ords of the click
	int x = e.getX();
	int y = e.getY();

	//if its range x / 50 = 1-3 then set the marker
	int thisx = x/50;
	int thisy = (y/50)-1;

	try {
	    int gridvalue = board.getGridValue(thisx,thisy);
	    if ((board.getGridValue(thisx,thisy) == 0) & (board.getIsWon() == false)) {
	        System.out.println("Player "+ board.nextplayer +" hit grid point "+ thisx +" "+ thisy);
		    board.makeMove(board.nextplayer,thisx,thisy);
	    }
	}
	catch (ArrayIndexOutOfBoundsException eeek) {
	    System.out.println("Player "+ board.nextplayer +" clicked off of board area");
	}


	// Calculate and make the computers move
	if ((board.nextplayer == board.computerplayer) & (board.getIsWon() == false)) {
	    board.calcMove(board.nextplayer);
	    board.makeMove(board.nextplayer,board.getMoveX(),board.getMoveY());
    	}
	repaint();
}

/* ----------------------------------------------------------- */
public void init() {


	// Initialise Buttons and their listner class.
	setLayout(new FlowLayout());
	resetButton = new Button("Reset");
	HandleButton he = new HandleButton(this,"Reset");
	resetButton.addActionListener(he);
	add(resetButton);

	label = new Label("Computer plays: ?");
	add(label);

	// Get the images.
	noughtImage = getImage(getCodeBase(), "nought.bmp");
	crossImage = getImage(getCodeBase(), "cross.bmp");

    // Set the board background colour
    setBackground(Color.yellow);

    // Construct the board object, and use the reset do do more init stuff.
    board = new TicTacToeBoard();

    // Reset the label text to something better
    if (board.computerplayer == 1) {
        label.setText("Computer plays: X");
    }
    else {
        label.setText("Computer plays: O");
    }
}

/* ----------------------------------------------------------- */
// Reset for new game.
public void reset() {

	// Set players and stuff.
	board.clearBoard();
	board.computerplayer = (board.computerplayer % 2) + 1;

	// Reset the label text to something better
    if (board.computerplayer == 1) {
        label.setText("Computer plays: X");
    }
    else {
        label.setText("Computer plays: O");
    }

	// If its the computer turn ,then make a move.
	if ((board.nextplayer == board.computerplayer) & (board.getIsWon() == false)) {
	    board.calcMove(board.nextplayer);
	    board.makeMove(board.nextplayer,board.xcoord,board.ycoord);
    	}

	repaint();
}

/* ----------------------------------------------------------- */
public synchronized void paint(Graphics g) {

    int x1,y1,x2,y2;  // Canvas co-ords ccrated from board points

	// Draw Grid
	g.setColor(gridColor);
	g.drawLine(50,50,50,200);
	g.drawLine(100,50,100,200);
	g.drawLine(0,100,150,100);
	g.drawLine(0,150,150,150);

	// Draw Bits
	for (i=0; i<3; i++) {
		for (j=0; j<3; j++) {
			switch (board.getGridValue(i,j)) {
			case 2:
				g.drawImage(noughtImage, 5+(50*i), 55+(50*j),40,40,Color.blue,this);
				break;
			case 1:
				g.drawImage(crossImage, 5+(50*i), 55+(50*j),40,40,Color.red,this);
				break;
			case 0:
				g.setColor(Color.white);
				g.fillRect(5+(50*i),55+(50*j),40,40);
				break;
			}
		}
	}

	if (board.getIsWon() == true) {
	    // Draw win line
	    g.setColor(Color.red);
	    x1 = (board.getWonLine(0).x * 50) + 25;
	    x2 = (board.getWonLine(1).x * 50) + 25;
	    y1 = (board.getWonLine(0).y * 50) + 75;
	    y2 = (board.getWonLine(1).y * 50) + 75;
	    g.drawLine(x1,y1,x2,y2);
	    g.drawLine(x1+1,y1,x2+1,y2);
	    g.drawLine(x1,y1+1,x2,y2+1);
        }

}

/* ----------------------------------------------------------- */
// Start and stop Threads
public void start() {
	if (runner == null) {
		runner = new Thread(this);
		runner.start();
	}
}
public void stop() {
	if (runner != null) {
		runner.stop();
		runner = null;
	}
}
public void run () {
	addMouseListener(this);
}



} // End of class TicTacToe