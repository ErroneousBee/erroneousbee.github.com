import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class TicTacToeBoard {
	protected int grid[][] = new int[3][3];     // Grid of xs and os
	protected int i;			    	        // counter
	protected int j;				            // counter
	protected int xcoord;                       // Move co-ordinate
	protected int ycoord;                       // Move co-ordinate
	public int nextplayer;			                    // Next player to make a move
	public int computerplayer;                         // The player that is the computer
	protected boolean won = false;              // True when a line is made
	Point wonline[] = new Point[2];               // Two points of the winning line

/* ----------------------------------------------------------- */
// Constructor. Clear Board.
TicTacToeBoard() {

    // Issue debug message
    System.out.println("Constructing board");

	// Initialise the matrix.
	clearBoard();

	// Set the next player to make a move and the computer player.
	nextplayer = 1;
	computerplayer = 2;
}

/* ----------------------------------------------------------- */
// Clear Board.
public void clearBoard() {

    // Issue debug message
    System.out.println("Clearing board");

	// Initialise the matrix.
	for (i=0; i<3; i++) {
		for (j=0; j<3; j++) {
			grid[i][j] = 0;
		}
	}

	won = false;
	nextplayer = 1;
}
/* ----------------------------------------------------------- */
// Ponder the next move.
public void calcMove(int player) {
    int gridstats[][] = new int[3][3];      // Place where count of good points goes.
    int x1,x2,y1,y2;                        // Other co-ords to make line calcualtions.
    int otherplayer;                        // The number of the other player.
    int maxpoints = 0;                      // max points for a move found so far

    otherplayer = (player % 2) + 1;

    // For each gridpoint, assign a score of how useful going here is.
    for (i=0; i<3; i++) {
		for (j=0; j<3; j++) {

		    gridstats[i][j] = 0;

			// Is this point already filled.
			if (grid[i][j] !=  0) {
			    continue;
			}

			// Make the triplet of grid points that make lines.
			x1 = (i + 1) % 3;
			x2 = (i + 2) % 3;
			y1 = (j + 1) % 3;
			y2 = (j + 2) % 3;

		   	if ((player == grid[x1][j]) & (player == grid[x2][j])) {
		   	   gridstats[i][j] = gridstats[i][j] + 100;
			}
		   	if ((player == grid[i][y1]) & (player == grid[i][y2])) {
		   	   gridstats[i][j] = gridstats[i][j] + 100;
			}
		   	if ((otherplayer == grid[x1][j]) & (otherplayer == grid[x2][j])) {
		   	   gridstats[i][j] = gridstats[i][j] + 25;
			}
		   	if ((otherplayer == grid[i][y1]) & (otherplayer == grid[i][y2])) {
		   	   gridstats[i][j] = gridstats[i][j] + 25;
			}
			if (i == j) {
			    if ((player == grid[x1][y1]) & (player == grid[x2][y2])) {
			        gridstats[i][j] = gridstats[i][j] + 100;
			    }
			    if ((otherplayer == grid[x1][y1]) & (otherplayer == grid[x2][y2])) {
			        gridstats[i][j] = gridstats[i][j] + 25;
			    }
			}
            if (i + j == 2) {
			    if ((player == grid[x1][y2]) & (player == grid[x2][y1])) {
			        gridstats[i][j] = gridstats[i][j] + 100;
			    }
			    if ((otherplayer == grid[x1][y2]) & (otherplayer == grid[x2][y1])) {
			        gridstats[i][j] = gridstats[i][j] + 25;
			    }
			}

    		// Does it create a fork
    		// xxxx Not done, gives the other player a chance

			// Is it a corner
			switch (i + j) {
			    case 0:
			    case 2:
			    case 4:
			        gridstats[i][j] = gridstats[i][j] + 3;
			        // Is it the center
			        if ((i ==1) & (j == 1)) {
			            gridstats[i][j] = gridstats[i][j] - 1;
			        }
			        // Is it opposite another counter
			        else {
			            x1 = (i + 2) % 3;
			            y1 = (j + 2) % 3;
			            if (grid[x1][y1] != 0) {
			                gridstats[i][j] = gridstats[i][j] + 1;
			            }
			        }
			        break;
			}

			// Add 1 to make different from illegal grid points
			gridstats[i][j] = gridstats[i][j] + 1;

			// Now select the highest grid stats as the best move.
			if (gridstats[i][j] > maxpoints) {
			    maxpoints = gridstats[i][j];
			    xcoord = i;
			    ycoord = j;
			}

		} // j loop
	} // i loop

	// Throw exception if no valid moves found.
	// xxxx yet to do. need to cover it in mouseClicked()

}
/* ----------------------------------------------------------- */
// Return the X co-ordinate of the calcMove result
public int getMoveX() {
    return xcoord;
}
/* ----------------------------------------------------------- */
// Return the Y co-ordinate of the calcMove result
public int getMoveY() {
    return ycoord;
}
/* ----------------------------------------------------------- */
// Return the grid value for a given grid point.
public int getGridValue(int x, int y) {
    return grid[x][y];
}
/* ----------------------------------------------------------- */
// Return the true if the game is won.
public boolean getIsWon() {
    return won;
}
/* ----------------------------------------------------------- */
// Return a Point from the wonline array .
public Point getWonLine(int vector) {
    return wonline[vector];
}
/* ----------------------------------------------------------- */
// Hey you, The Rock Steady Crew...
public void makeMove(int player,int thisx, int thisy) {

    grid[thisx][thisy] = player;
	System.out.println("Player "+ player +" takes square "+ thisx +" "+ thisy);

    // Does this perturbation win the game.
    if ((grid[0][thisy] == grid[1][thisy]) & (grid[1][thisy] == grid[2][thisy])) {
        System.out.println("Player "+ player +" completes | line");
		won = true;
		wonline[0] = new Point(0,thisy);
		wonline[1] = new Point(2,thisy);
		}
	if ((grid[thisx][0] == grid[thisx][1]) & (grid[thisx][1] == grid[thisx][2])) {
		won = true;
		System.out.println("Player "+ player +" completes - line");
		wonline[0] = new Point(thisx,0);
		wonline[1] = new Point(thisx,2);
		}
	if ((grid[1][1] != 0) & (grid[0][0] == grid[1][1]) & (grid[1][1] == grid[2][2])) {
		System.out.println("Player "+ player +" completes / line");
		won = true;
		wonline[0] = new Point(0,0);
		wonline[1] = new Point(2,2);
		}
	if ((grid[1][1] != 0) & (grid[0][2] == grid[1][1]) & (grid[1][1] == grid[2][0])) {
	    System.out.println("Player "+ player +" completes \\ line");
		won = true;
		wonline[0] = new Point(2,0);
		wonline[1] = new Point(0,2);
		}

	// Change players number
	nextplayer = (nextplayer % 2) + 1;
 }
}// End of class.