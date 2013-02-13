package uk.co.neilhancock;
 
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
 
public class WordSort {
    public static void main(String[] args) {
    	String prevword = "";
	String commasep = "";        
        // Check args
    	if (args.length == 0) {
    		System.out.println("No arguments!");
    		return;
    	}

    	// Pull args into a list    	
        List<String> list = new ArrayList<String>();       
        for (String arg : args) {
        	// System.out.println(arg);
        	list.add(arg);   
        }

        // Sort list
        Collections.sort(list, new WordSortComparator());

        // Output results, skipping over dupes as we go
        for (String word : list) {

        	if (!word.toLowerCase().equals(prevword)) {
        		// Finish last word with a comma       			
        		System.out.print(commasep+word);
        		prevword = word.toLowerCase();
        		commasep = ", ";
        	}
        }
        System.out.print("\n");

    }
}
