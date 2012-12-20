#!/usr/bin/rexx
/* Rexx - Extract data from info.txt for a particular jpeg */
parse arg jpegName, infoFile
if infoFile = '' then infoFile = 'info.txt'

/* Construct a filename that will match the original dscnxxxx.jpg format
*/
jpegNameU = TRANSLATE(jpegName)
if LEFT(jpegNameU,4) \= 'DSCN' then do
   parse var jpegName date '_' time '_' number '.' fileType
   jpegNameU = 'DSCN'RIGHT(number,4,'0')'.'TRANSLATE(fileType)
   end

/* Open the info.txt file and get a match */
junk = STREAM(infoFile,'C','OPEN READ')
currentLine = 0
do while LINES(infoFile) > 0

   /* These arnt the robots you're looking for, move along */
   if TRANSLATE(LINEIN(infoFile)) \= jpegNameU then do
      currentLine = currentLine + 15
      x= LINEIN(infoFile,currentLine,1)
      iterate
      end

   camera    = SUBWORD(LINEIN(infoFile),3)
   metering  = SUBWORD(LINEIN(infoFile),3)
   mode      = SUBWORD(LINEIN(infoFile),3)
   shutter   = SUBWORD(LINEIN(infoFile),3)
   aperture  = SUBWORD(LINEIN(infoFile),3)
   junk      = LINEIN(infoFile)
   focLen    = SUBWORD(LINEIN(infoFile),4)
   junk      = LINEIN(infoFile)
   junk      = LINEIN(infoFile)
   junk      = LINEIN(infoFile)
   junk      = LINEIN(infoFile)
   datim     = SUBWORD(LINEIN(infoFile),3)
   junk      = LINEIN(infoFile)
   junk      = LINEIN(infoFile)

   /* Convert date to ISO format */
   parse var datim  year '.' month '.' day time
   date = year'-'month'-'day
   attributes = 'date="'date'" time="'time'"'

   /* Make more attributes */
   attributes = attributes 'shutter="'shutter'"',
                           'aperture="'aperture'"',
                           'focal_length="'focLen'"',
                           'camera="'camera'"',
                           'mode="'mode'"',
                           'metering="'metering'"'
   exit '1 'attributes

end
exit 0
