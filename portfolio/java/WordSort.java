package uk.co.neilhancock.java.portfolio;
 
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
 
public class WordSort {
    public static void main(String[] args) {
        
        
        List<String> list = new ArrayList<String>();
        list.add("DOG");   
        list.add("cat");    
        list.add("a");
        list.add("pineapple");

        Collections.sort(list, new SringComparator());
        for (String word : list) {
            System.out.println(word);
        }
    }
}
