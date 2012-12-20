import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class ReversiBoard {
    protected int grid[][][] = new int[8][8][100];   // Grid of conter positions
    protected int gridshadow[][] = new int[8][8];    // A spare grid for next move operations.
    private int gridline[] = new int[8];             // A line fom the grid.
    private int gridcaptures[] = new int[8];         // Captures in each compass direction.
    public int capturetotal = 0;                     // Total gridpoints captured by a move
    protected int xcoord;                            // Move co-ordinate
    protected int ycoord;                            // Move co-ordinate
    public int nextplayer;                           // Next player to make a move.
    public int lastplayer;                           // Last player to make a move.
    public int movenumber;                           // What move are we at.
    public boolean legalMoveAvail = false;           // True if nextplayer can make a legal move.
    protected boolean won = false;                   // True when its over
    protected ReversiPositionAnalyser analyser;      // Object that analyses computers best move
    public ReversiPlayer p[] = new ReversiPlayer[4]; // All players, real and utility.
    final public int PLAYERS     = 4;                // How many players we have (real and utility)
    final public int PLAYER0     = 0;                // Handle for Null player (unused squares)
    final public int PLAYER1     = 1;                // "      "   Player 1
    final public int PLAYER2     = 2;                // "      "   Player 2
    final public int LEGALMOVE   = 3;                // "      "   legal moves
    final public int NORTH       = 0;                // Board directions
    final public int NORTHEAST   = 1;                // "
    final public int EAST        = 2;                // "
    final public int SOUTHEAST   = 3;                // "
    final public int SOUTH       = 4;                // "
    final public int SOUTHWEST   = 5;                // "
    final public int WEST        = 6;                // "
    final public int NORTHWEST   = 7;                // "
    final public int INCNORTH    = -1;               // Increments for each direction
    final public int INCSOUTH    =  1;               // "
    final public int INCEAST     =  1;               // "
    final public int INCWEST     = -1;               // "
    final public int INCNULL     =  0;               // "


/* ----------------------------------------------------------- */
// Constructor. Completely new board.
ReversiBoard() {

    // Issue debug message
    System.out.println("Constructing board");

    // Set the next players handles to make a move and the computer player.
    nextplayer = PLAYER1;
    lastplayer = PLAYER2;

    // Create the analyser.
    analyser = new ReversiPositionAnalyser();

    // Create the players
    p[PLAYER0]     = new ReversiPlayer(PLAYER0,"Empty",false,0,false);
    p[PLAYER1]     = new ReversiPlayer(PLAYER1,"Player 1",false,-1,true);
    p[PLAYER2]     = new ReversiPlayer(PLAYER2,"Player 2",false,1,true);
    p[LEGALMOVE]   = new ReversiPlayer(LEGALMOVE,"Legal Move",false,0,false);

    // Initialise the matrix.
    clearBoard();

}
/* ----------------------------------------------------------- */
// Constructor for new board based on current board
ReversiBoard(ReversiBoard board) {

    // Issue debug message
    //System.out.println("Constructing board from original board");

    // Get the next/last player over from previous board.
    nextplayer = board.nextplayer;
    lastplayer = board.lastplayer;
    movenumber = board.movenumber;

    // Populate the board, including history.
    for (int i=0; i<8; i++) {
        for (int j=0; j<8; j++) {
            for (int k=0; k<=movenumber; k++) {
                grid[i][j][k] = board.getGridValue(i,j,k);
            }
        }
    }

    // Get the players.
    for (int i=0; i <= LEGALMOVE; i++) {
        p[i] = board.p[i];
    }

    // Get its analyser
    analyser = board.getAnalyser();

    // Set the ghost points for the next move.
    calcLegalMoves(nextplayer);

    // Set the counts of peices for each player.
    countPieces();

}

/* ----------------------------------------------------------- */
// Clear Board.
public void clearBoard() {

    // Issue debug message
    System.out.println("Clearing board");

    // Reset players and move.
    won = false;
    nextplayer = PLAYER1;
    lastplayer = PLAYER2;
    movenumber = 0;

    // Clear all the player from the grid. Dont bother about future moves.
    for (int i=0; i<8; i++) {
        for (int j=0; j<8; j++) {
            grid[i][j][0] = 0;
        }
    }

    // Set up the initial positions
    grid[3][3][0] = PLAYER2;
    grid[4][4][0] = PLAYER2;
    grid[3][4][0] = PLAYER1;
    grid[4][3][0] = PLAYER1;


    // Set the ghost points for the next move.
    calcLegalMoves(nextplayer);

    // Set the counts of peices for each player.
    countPieces();
}
/* ----------------------------------------------------------- */
// Ponder the next move.
public Point calcMove(int player) {

    System.out.println("Calling analyser for player "+ player );
    System.out.println("Player "+player+" has minmax value "+ p[player].getMaxMin() );
    Point bestmove = analyser.showBestMove(this);
    return bestmove;

}

/* ----------------------------------------------------------- */
/** Count pieces each player has. */
public void countPieces() {

    // Populate pc[handle] with each players count
    int pc[] = new int[4];
    for (int i=0; i<8; i++) {
        for (int j=0; j<8; j++) {
            pc[grid[i][j][movenumber]]++;
        }
    }

    // Plyaer 0 gets all empty moves recorded
    p[PLAYER0].setPieces(pc[PLAYER0] + pc[LEGALMOVE]);
    p[PLAYER1].setPieces(pc[PLAYER1]);
    p[PLAYER2].setPieces(pc[PLAYER2]);

}
/* ----------------------------------------------------------- */
/** Return the number of peices a player has */
public int howManyPieces(int player) {
    return p[player].getPieces();
}
/* ----------------------------------------------------------- */
// Swap nextplayer and last player. Ie pass a move.
public void passMove() {

    // This grid position is now history.
    copyGridToNextSlot();

    // Swap active player and increment movenumber
    int spare = nextplayer;
    nextplayer = lastplayer;
    lastplayer = spare;
    movenumber++;

    // See if either player can make a legal move
    if (calcLegalMoves(lastplayer) == false & calcLegalMoves(nextplayer) == false) {
        won = true;
    }

    // Set the ghost points for the next move.
    calcLegalMoves(nextplayer);

    // Set the counts of pieces for each player.
    countPieces();
}
/* ---------------------------------------------------------- */
/** Hey you, The Rock Steady Crew... */
public void makeMove(int player, Point move) {
    makeMove(player,move.x,move.y);
}
public void makeMove(int gridx, int gridy) {
    makeMove(nextplayer,gridx,gridy);
}
public void makeMove(int player, int gridx, int gridy) {

    // This grid position is now history.
    copyGridToNextSlot();

    // Set start grid coords that will move out in each direction, and increment move number.
    int movew   = gridx + INCWEST;
    int movee   = gridx + INCEAST;
    int moven   = gridy + INCNORTH;
    int moves   = gridy + INCSOUTH;
    movenumber++;

    // Make sure that te gridlines are set
    isItLegal(player,gridx,gridy);

    // System.out.println("Player "+ p[player].getName() +" makes move " + movenumber + " on square "+ gridName(gridx,gridy));

    // Go along gridcapture lines flipping pieces.
    grid[gridx][gridy][movenumber] = player;
    for (int i=0; i<8; i++) {
        if (gridcaptures[NORTH]     > i) { grid[gridx][moven][movenumber]    = player; }
        if (gridcaptures[NORTHEAST] > i) { grid[movee][moven][movenumber]    = player; }
        if (gridcaptures[EAST]      > i) { grid[movee][gridy][movenumber]    = player; }
        if (gridcaptures[SOUTHEAST] > i) { grid[movee][moves][movenumber]    = player; }
        if (gridcaptures[SOUTH]     > i) { grid[gridx][moves][movenumber]    = player; }
        if (gridcaptures[SOUTHWEST] > i) { grid[movew][moves][movenumber]    = player; }
        if (gridcaptures[WEST]      > i) { grid[movew][gridy][movenumber]    = player; }
        if (gridcaptures[NORTHWEST] > i) { grid[movew][moven][movenumber]    = player; }
        movew += INCWEST;
        movee += INCEAST;
        moven += INCNORTH;
        moves += INCSOUTH;
    }

    // Change players number
    nextplayer = lastplayer;
    lastplayer = player;

    // See if either player can make a legal move
    if (calcLegalMoves(lastplayer) == false & calcLegalMoves(nextplayer) == false) {
        won = true;
    }
    else {
        // Set the ghost points for the next move.
        calcLegalMoves(nextplayer);
    }

    // Set the counts of peices for each player.
    countPieces();

}
/* ---------------------------------------------------------- */
public void undoMove() {

    // Change players number
    int spare = nextplayer;
    nextplayer = lastplayer;
    lastplayer = spare;
    movenumber--;

    // See if either player can make a legal move
    if (calcLegalMoves(lastplayer) == false & calcLegalMoves(nextplayer) == false) {
        won = true;
    }
    else {
        // Set the ghost points for the next move.
        calcLegalMoves(nextplayer);
    }

    // Set the counts of peices for each player.
    countPieces();

}

/* ----------------------------------------------------------- */
private void copyGridToNextSlot() {
    copyGridToSlot(movenumber,movenumber+1);
}
/* ----------------------------------------------------------- */
private void copyGridToSlot(int from, int to) {
    for (int i = 0; i < 8; i++) {
        for (int j = 0 ; j < 8; j++) {
            grid[i][j][to] = grid[i][j][from];
        }
    }
}
/* ----------------------------------------------------------- */
// Clear and populate gridline[] in a particular direction.
protected void populateGridline(int gridx, int gridy, int incrementx, int incrementy) {

    int loopx = gridx + incrementx;
    int loopy = gridy + incrementy;
    int gridcount = 0;

    // Clear gridline
    for (int i=0; i!=7; i++) { gridline[i] = 0; }

    // Populate the gridline until its a unused square, or we're off the board.
    while (loopx < 8 & loopx > -1 & loopy < 8 & loopy > -1) {
        gridline[gridcount] = grid[loopx][loopy][movenumber];
        if (gridline[gridcount] == 0) {break;}
        loopx = loopx + incrementx;
        loopy = loopy + incrementy;
        gridcount++;
    }

}
/* ----------------------------------------------------------- */
/** get how many pieces are captured in a particular direction */
protected int analyseGridline(int gridx, int gridy, int incrementx, int incrementy, int player, int compassdir) {

    int otherplayer = otherPlayer(player);
    gridcaptures[compassdir] = 0;
    int index = 0;

    populateGridline(gridx, gridy, incrementx, incrementy);

    // count the number of other players counters till we meet a non otherplayer square.
    while (gridline[index] == otherplayer) {
        gridcaptures[compassdir]++;
        index++;
    }

    // If the end square wasnt the players, then nothing was captured.
    if (gridline[index] != player) { gridcaptures[compassdir] = 0; }

    return gridcaptures[compassdir];
}

/* ----------------------------------------------------------- */
/** Is this a legal move */
public boolean isItLegal(int player, int gridx, int gridy) {

    capturetotal = 0;

    // If theres something already there, then its not a legal move.
    if (p[grid[gridx][gridy][movenumber]].isRealPlayer() == true) { return false; }

    // In each direction, populate gridline[] and then count the number of captured peiced in the line into gridCaptures[direction].
    // This used to be really clunky, but then I took a sneaky peek at other reversi implementations.
    capturetotal += analyseGridline(gridx,gridy, INCNULL, INCNORTH ,player,NORTH);
    capturetotal += analyseGridline(gridx,gridy, INCNULL, INCSOUTH ,player,SOUTH);
    capturetotal += analyseGridline(gridx,gridy, INCEAST, INCNULL  ,player,EAST);
    capturetotal += analyseGridline(gridx,gridy, INCWEST, INCNULL  ,player,WEST);
    capturetotal += analyseGridline(gridx,gridy, INCEAST, INCNORTH ,player,NORTHEAST);
    capturetotal += analyseGridline(gridx,gridy, INCWEST, INCNORTH ,player,NORTHWEST);
    capturetotal += analyseGridline(gridx,gridy, INCEAST, INCSOUTH ,player,SOUTHEAST);
    capturetotal += analyseGridline(gridx,gridy, INCWEST, INCSOUTH ,player,SOUTHWEST);

    if (capturetotal > 0) {return true;}
    else {return false;}

 } // End isItLegal
/* ----------------------------------------------------------- */
/** set all legal move grid[][][] squares to LEGALMOVE */
protected boolean calcLegalMoves(int player) {

    legalMoveAvail = false;

    // Look at each unset gridpoint on the board, and ask isItLegal()
    // before setting the gridpoint as a possible move.
    for (int i = 0; i < 8; i++) {
        for (int j = 0 ; j < 8; j++) {
            if (grid[i][j][movenumber] == LEGALMOVE) { grid[i][j][movenumber] = PLAYER0; }  // Clear old legal moves
            if ( (grid[i][j][movenumber] == PLAYER0) & isItLegal(player,i,j) ) {
                grid[i][j][movenumber] = LEGALMOVE;
                legalMoveAvail = true;
            }
        }
    }

    return legalMoveAvail;
}
/* ----------------------------------------------------------- */
/** True if nextplayer has a legal move avaiable. */
public boolean isMoveAvailable() {
    return legalMoveAvail;
}
/* ----------------------------------------------------------- */
// get and set the move number
public void setMoveNumber(int m) {
    movenumber = m;
}
public int getMoveNumber() {
    return movenumber;
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
    return getGridValue(x,y,movenumber);
}
public int getGridValue(int x, int y, int m) {
    return grid[x][y][m];
}
/* ----------------------------------------------------------- */
/** Return the analyser for this board. */
public ReversiPositionAnalyser getAnalyser() {
    return analyser;
}
/* ----------------------------------------------------------- */
/** Returns the true if the game is won. */
public boolean gameIsWon() {
    return won;
}
/* ----------------------------------------------------------- */
/** Returns the name of the player  */
public String getPlayerName(int player) {
    return p[player].getName();
}
/* ----------------------------------------------------------- */
/** Set the name of the numberered player */
public void setPlayerName(int player, String playername) {
    p[player].setName(playername);
}
/* ----------------------------------------------------------- */
/** get the handle of the opponent to player */
public int otherPlayer(int player) {
    switch (player) {
        case (PLAYER1): return PLAYER2;
        case (PLAYER2): return PLAYER1;
        default: return PLAYER0;
    }
}
/* ----------------------------------------------------------- */
/** Returns the human name for the gridpoint such as 'a1' for grid[0][0][] */
public String gridName(Point xy) {
    return gridName(xy.x,xy.y);
}
/** Returns the human name for the gridpoint such as 'a1' for grid[0][0][] */
public String gridName(int x, int y) {
    final String XCHARS = "abcdefgh";
    final String YCHARS = "87654321";
    return new Character(XCHARS.charAt(x)).toString() + new Character(YCHARS.charAt(y)).toString();
}
/* ----------------------------------------------------------- */
/** Prints a text picture of the board to stdout/DOS/console/SYSPRINT/whatever */
public void printGrid() {

    StringBuffer buff = new StringBuffer("");

    for (int i=0; i<8; i++) {
        buff.setLength(0);
        for (int j=0; j<8; j++) {
            buff.append(grid[j][i][movenumber]); // Note the reversal to get it to look right
        }
        System.out.println(buff);
    }

}
}// End of class.