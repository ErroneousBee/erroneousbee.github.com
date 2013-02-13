package uk.co.neilhancock;
 
import java.util.Comparator;
 
public class WordSortComparator implements Comparator<String>{
 
    @Override
    public int compare(String o1, String o2) {
    
        // Shortest first
        if (o1.length() < o2.length()) {
            return -1;
        }
        else if (o1.length() > o2.length()) {
            return 1;
        }  
        
        // Last resort of standard java string compare
        return (o1.compareToIgnoreCase(o2));
        
    }
}
