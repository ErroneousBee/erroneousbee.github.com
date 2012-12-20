import java.awt.*;
import java.awt.event.*;

public class ReversiButtons implements ActionListener {

    Reversi  applet;

// Constructor
ReversiButtons(Reversi a) {
	applet = a;
}

// Called when any button pressed
public void actionPerformed(ActionEvent e) {
    if (e.getSource() instanceof Button) {

        if (e.getSource() == applet.resetbutton) {
            applet.reset();
        }

        if (e.getSource() == applet.passbutton) {
            applet.pass();
        }
    }

}
} // end of class ReversiButtons