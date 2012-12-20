#!/usr/bin/rexx
/* rexx - Read attributes from text file for a jpeg. */
/* Text files are just a load of XML-like attributes, stored one
   per line. Some special attribute names are group="group name
   when creating index pages" indextext="Some text that gets put
   onto index pages" */
parse arg jpegName, attributeList

/* Make name of text file relative to where we are.*/
parse var jpegName fileName '.' fileType
textFile = fileName || '.txt'
select
 when STREAM(textFile,'C','QUERY EXISTS') \= '' then
   textFile = textFile 
 when STREAM('texts/' || textFile,'C','QUERY EXISTS') \= '' then
   textFile = 'texts/' || textFile
 otherwise do  
   say 'Cannot find text file for 'jpegName
   exit
   end
end   

/* Read in any existing file and extract the old attributes */
outputList = ''
junk = STREAM(textFile,'C','OPEN READ')
do until LINES(textFile) = 0
   thisLine = LINEIN(textFile)
   parse var thisLine attributeName '=' .
   if WORDPOS(attributeName,attributeList) \= 0 then ,
      outputList = outputList thisLine
end

exit outputList

