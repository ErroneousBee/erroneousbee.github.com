import java.awt.*;
import java.awt.event.*;

public class HandleButton implements ActionListener {

	TicTacToe theApplet;
	String callKey;

// Constructor
HandleButton(TicTacToe a , String c) {
	theApplet = a;
	callKey = c;
}

// Called when any button pressed
public void actionPerformed(ActionEvent e) {
	theApplet.reset();
}
}