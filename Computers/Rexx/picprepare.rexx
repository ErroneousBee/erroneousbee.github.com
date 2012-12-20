#!/usr/bin/rexx
/* Rexx - Rename jpegs and make text and thumbs and jpeg comments. */
parse arg photoDir
if photoDir \= '' then x = DIRECTORY(photoDir)

group      = 'Pictures'

/* Rename and prep each photo in turn */
address SYSTEM "ls -1sh *.jpg" with OUTPUT STEM lsout.
do i = 1 to lsout.0
   parse var lsout.i thisSize thisJpeg
   say '....'thisJpeg
   maxRc=0

   /* Get the text info */
   parse value "picgetinfo"(thisJpeg) with rCode thisInfo
   if rCode = 0 then do
      say 'No info.txt match for 'thisJpeg
      maxRc=4
      thisInfo=''
      end

   attributes = thisInfo
   do while thisInfo \= ''
      parse var thisInfo ,
            attributeName '="' attributeValue '"' thisInfo
      attrNames = attrNames attributeName
      attributeName = '0' || STRIP(TRANSLATE(attributeName))
      attrList.attributeName = attributeValue
   end

   /* Make new name for the jpeg if necessary */
   if maxRc = 0 & TRANSLATE(LEFT(thisJpeg,4)) = 'DSCN' then do
      thisJpegNum = SPACE( ,
          TRANSLATE(thisJpeg,,XRANGE('a','z')||XRANGE('A','Z')'._-') ,
          ,0)
      newJpegName = attrList.0DATE ,
                 || '_'TRANSLATE(attrList.0TIME,'-',':') ,
                 || '_'thisJpegNum'.jpg'
      address SYSTEM "mv " '"'thisJpeg'"' '"'newJpegName'"'
      end
   else newJpegName = thisJpeg

   /* Create the text file */
   title = 'untitled'
   call "picmktext" newJpegName,                  ,   
                   'group="'group'"'              ,
                   'title="'title'"'              ,
                   'number="'thisJpegNum'"'       ,
		   attributes

   /* Create the thumbnail */
   /* x = "picmkthumb"(newJpegName,'200x200','(c)NWH') */

   /* Create the comment text */
   /*commentText = '(c)NWH' date time indextext
   call "picconvert" '""' newJpegName, '-comment "'commentText'"' */

end

exit
