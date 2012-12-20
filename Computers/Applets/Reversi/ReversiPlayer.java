import java.awt.*;
import java.applet.*;
import java.awt.event.*;

/** Describes a Reversi player. Can be used for other board square conditions, like empty. */
public class ReversiPlayer {

	protected int       p_pieces          = 0;                // Number of peices captured.
	protected String    p_name            = "Empty";          // Name of the player.
	protected int       p_handle          = 0;                // Number as assigned by applet or board.
    protected int       p_maxmin          = 1;                // Maxmin maximiser = 1, minimiser = -1.
    protected boolean   p_compplayer      = false;            // true if computer has to make the moves.
    protected boolean   p_realplayer      = false;            // Time for a 100 meg download?.


/* ----------------------------------------------------------- */
/** Constructor for new player. This is the only place handle is set.
    You may want to add methods to set/get other vars if I havent already */
ReversiPlayer(  int     handle,
                String  player_name,
                boolean is_computer_player,
                int     maximiser_or_minimiser,
                boolean is_real_player) {
    p_handle        = handle;
    p_name          = player_name;
    p_compplayer    = is_computer_player;
    p_maxmin        = maximiser_or_minimiser;
    p_realplayer    = is_real_player;
}


/* ----------------------------------------------------------- */
/** Returns the name of the player */
public String getName() {
   return p_name;
}
/* ----------------------------------------------------------- */
/** Set the name of the player */
public void setName(String player_name) {
    p_name = player_name;
}

/* ----------------------------------------------------------- */
/** Return the number of peices a player has */
public int getPieces() {
    return p_pieces;
}
/* ----------------------------------------------------------- */
/** Set count of the number of peices a player has.
    The board should really be the arbiter of this, but you may want to save it here too.*/
public void setPieces(int pieces_held) {
    p_pieces = pieces_held;
}
/* ----------------------------------------------------------- */
/** Return int value of players maxmin value, usually 1, 0 or -1 */
public int getMaxMin() {
    return p_maxmin;
}

/* ----------------------------------------------------------- */
/** Return the number of peices a player has */
public void setComputerPlayer(boolean is_computer_player) {
    p_compplayer = is_computer_player;
}
/* ----------------------------------------------------------- */
/** Return true if this player is the computer */
public boolean isComputerPlayer() {
    return p_compplayer;
}

/* ----------------------------------------------------------- */
/** Return true if the player is a genuine player and not a utility like a blank square marker. */
public boolean isRealPlayer() {
    return p_realplayer;
}

}// End of class.