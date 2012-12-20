import java.util.*;
import java.awt.*;
import java.lang.*;

public class ReversiPositionAnalyser {
    private int pa_move;
    private int pa_vars[][][] = new int[CATEGORY_TYPES][8][8];
    private int pa_weight[][] = new int[CATEGORY_WEIGHTS][100];
    private int pa_search_depth;
    private static transient Random random = new java.util.Random();
    private final static int WINIT      = 0;        // pa_weights initial values
    private final static int WMODIFIER  = 1;        // pa_weights move modifiers
    private final static int CATEGORY_WEIGHTS = 4;  // How many pa_weights categories there are
    private final static int CATEGORY_TYPES   = 3;  // How many pa_weights categories there are
    private final static int LOCATION0  = 0;        // TYPES and WEIGHTS
    private final static int LOCATION1  = 1;        // TYPES and WEIGHTS
    private final static int GRIDTYPE0  = 2;        // TYPES only
    private final static int MOBILITY0  = 2;        // WEIGHTS only
    private final static int CAPTURED0  = 3;        // WEIGHTS only


    private final static String LOCATIONVALUES  =   "90888809"+
                                                    "00111100"+
                                                    "81766718"+
                                                    "81655618"+
                                                    "81655618"+
                                                    "81766718"+
                                                    "00111100"+
                                                    "90888809";


/* ----------------------------------------------------------- */
// Constructor. Select random values for the weights.
ReversiPositionAnalyser() {

    // Assume its the first move and set a default search depth.
    pa_move = 1;
    pa_search_depth = 4;

    // Assign sensible values to the intrinsic value of each square
    int index = 0;
    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
             int suggestedvalue = Character.digit(LOCATIONVALUES.charAt(index++),10);
             switch (suggestedvalue) {
                case 9:
                    pa_vars[LOCATION0][i][j] = 400;
                    pa_vars[LOCATION1][i][j] = 400;
                    break;
                case 1:
                    pa_vars[LOCATION0][i][j] = -10;
                    pa_vars[LOCATION1][i][j] = 10;
                    break;
                case 0:
                    pa_vars[LOCATION0][i][j] = -100;
                    pa_vars[LOCATION1][i][j] = 80;
                    break;
                default:
                    pa_vars[LOCATION0][i][j] = suggestedvalue*10;
                    pa_vars[LOCATION1][i][j] = suggestedvalue*10;
                    break;
             }
             pa_vars[GRIDTYPE0][i][j] = suggestedvalue;

        }
    }

    // Precalcualte the weights for each move
    for (int i = 0; i < 100; i++) {
        pa_weight[LOCATION0][i] = i;            // Gets more important as game progresses
        pa_weight[LOCATION1][i] = 50 - i;       // Gets less important as game progresses
        pa_weight[MOBILITY0][i] = 200 -(4*i);   // Mobility really important at the start
        pa_weight[CAPTURED0][i] = (i*10) -100;  // Total captured really important in the end game
    }


}

/* ----------------------------------------------------------- */
/** Return an integer that is the combinded score for the board positions */
public int getPositionValue(ReversiBoard board) {

    int player = board.nextplayer;
    int otherplayer = board.otherPlayer(player);
    int playerhandle;
    int sum[][] = new int[CATEGORY_WEIGHTS][board.PLAYERS];
    int finalsum = 0;
    int gridtype = 0;

    // Look at all grid points and sum them up. Ive kept as much processing out of this loop as possible.
    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
            playerhandle = board.getGridValue(i,j);

            // If its near a corner,(an X square) choose the most appropriate pa_vars grid.
            if (pa_vars[GRIDTYPE0][i][j] == 0) {
                // No, I dont know what this does either.
                if (board.p[board.getGridValue((i<4)?0:7,(j<4)?0:7)].isRealPlayer() == true) {
                    gridtype = LOCATION1;}
                else {gridtype = LOCATION0;}
            }
            else {gridtype = LOCATION0;}

            // Get as many good squares as possible.
            if (board.p[playerhandle].isRealPlayer() == true ) {
                sum[gridtype][playerhandle] += pa_vars[gridtype][i][j];
                sum[CAPTURED0][playerhandle]++;
            }

            // Mobility, sort of.
            if (playerhandle == board.LEGALMOVE) {
                sum[MOBILITY0][player] += pa_vars[gridtype][i][j];
            }

        }
    }

    // Tally the final score from the sums we had.
    int movenumber = board.movenumber;
    for (int i= 0; i<CATEGORY_WEIGHTS; i++) {

        //System.out.println("Weight: "+pa_weight[i][movenumber]+" P1: "+sum[i][board.PLAYER1]+" P2: "+sum[i][board.PLAYER2]);

        if (pa_weight[i][movenumber] > 0) {
            finalsum += pa_weight[i][movenumber]
                      * ( (sum[i][board.PLAYER1] * board.p[board.PLAYER1].getMaxMin())
                      +   (sum[i][board.PLAYER2] * board.p[board.PLAYER2].getMaxMin())
                         );
        }
    }

    //board.printGrid();
    //System.out.println("Move: "+movenumber+" Value: "+finalsum);

    return finalsum;
}
/* ----------------------------------------------------------- */
/** Return an integer result of the function */
public int climbTreeOfBoards (ReversiBoard board,int depth) {

    int movevalue, bestmovevalue;
    int bestx = 0 , besty = 0;
    boolean bestmoveislegal = false;

    // First we make the move, and then get details about this move
    int player = board.nextplayer;
    int playermaxmin = board.p[player].getMaxMin();
    bestmovevalue = 1000*-1*playermaxmin;

    // If weve climbed to the top, then tell the people at the bottom what we see and start climbing down again.
    if (depth == 0) {
        bestmovevalue = getPositionValue(board);
        return bestmovevalue;
    }

    // If weve got no legal moves to make, then pass the move and recurse.
    if (board.isMoveAvailable() == false) {
        board.passMove();
        bestmovevalue = climbTreeOfBoards(board,depth - 1);
        board.undoMove();
        return bestmovevalue;
    }

    // Else populate the grid with the results of postulated moves, and return the best one.
    for (int i = 0; i<8; i++) {
        for (int j = 0; j<8; j++) {

            // If its a legal move, take it and get the move value.
            if (board.getGridValue(i,j) == board.LEGALMOVE) {
                board.makeMove(i,j);
                movevalue = climbTreeOfBoards(board,depth - 1);
                board.undoMove();
                if (bestmoveislegal == false) { bestx = i; besty = j; bestmoveislegal = true; bestmovevalue = movevalue; }
                if (movevalue*playermaxmin > bestmovevalue*playermaxmin) {
                    bestx = i;
                    besty = j;
                    bestmovevalue = movevalue;
                }

            }
        }
    }

return bestmovevalue;
}
/* ----------------------------------------------------------- */
/** Return the most effective move available*/
public Point showBestMove(ReversiBoard board) {
    return showBestMove(board,pa_search_depth);
}
/* ----------------------------------------------------------- */
/** Return the most effective move available*/
public Point showBestMove(ReversiBoard b,int scandepth) {

    // Make a copy of the board
    ReversiBoard board = new ReversiBoard(b);


    int movevalue, bestmovevalue;
    int bestx = 0 , besty = 0;
    boolean bestmoveislegal = false;
    int player = board.nextplayer;
    int playermaxmin = board.p[player].getMaxMin();
    bestmovevalue = 0;

    // Else populate the grid with the results of postulated moves, and return the best one.
    for (int i = 0; i<8; i++) {
        for (int j = 0; j<8; j++) {

            // If its a legal move, take it and get the move value.
            if (board.getGridValue(i,j) == board.LEGALMOVE) {
                board.makeMove(i,j);
                movevalue = climbTreeOfBoards(board,scandepth - 1);
                board.undoMove();
                if (bestmoveislegal == false) { bestx = i; besty = j; bestmoveislegal = true; bestmovevalue = movevalue; }
                if (movevalue*playermaxmin > bestmovevalue*playermaxmin) {
                    bestx = i;
                    besty = j;
                    bestmovevalue = movevalue;
                }

            }
        }
    }
    return new Point(bestx,besty);


}

}// End of class
