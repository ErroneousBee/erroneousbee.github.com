#!/usr/bin/rexx
/* rexx - Create/update a text file storing metadata for the jpeg */
/* Text files are just a load of XML-like attributes, stored one
   per line. Some special attribute names are group="group name
   when creating index pages" indextext="Some text that gets put
   onto index pages" */
parse arg jpegName, attributes

/* Make name of text file */
parse var jpegName fileName '.' fileType
textFile = fileName || '.txt'

/* Read in any existing file and extract the old attributes */
attrNames = ''
attrList  = ''
junk = STREAM(textFile,'C','OPEN READ')
do until LINES(textFile) = 0
   parse value LINEIN(textFile) ,
          with attributeName '="' attributeValue '"'
   attrNames = attrNames attributeName
   attributeName = '0' || STRIP(TRANSLATE(attributeName))
   attrList.attributeName = STRIP(attributeValue,,'"')

end

/* Overwrite old attributes with new ones */
do until attributes = ''
   parse var attributes ,
             attributeName '="' attributeValue '"' attributes
   attrNames = attrNames attributeName
   attributeName = '0' || STRIP(TRANSLATE(attributeName))
   attrList.attributeName = STRIP(attributeValue,,'"')
end

/* Create new text file with newest attributes */
junk = STREAM(textFile,'C','OPEN BOTH REPLACE')
do until attrNames = ''
   parse var attrNames attrName attrNames
   if WORDPOS(attrName,attrNames) \= 0 then iterate
   attrVar = '0' || STRIP(TRANSLATE(attrName))
   thisLine = attrName'="'attrList.attrVar'"'
   x = LINEOUT(textFile,thisLine)
end

exit

