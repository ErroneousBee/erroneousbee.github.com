#!/usr/bin/rexx
/* rexx - Drive ImageMagick to make
   thumbnail in thumbs directory */
parse arg jpegName, iconGeometry, copyRight

/* Make up stuff if data isnt supplied */
if copyRight    = '' then copyRight    = '(c)'
if iconGeometry = '' then iconGeometry = '200x200'
thumbName = 'thumbs/'jpegName

/* Decide some stuff */
fontSize     = 18
fontName     = 'lucida'
copyRight    = '"'copyRight'"'
copyText1    = "'text 2,"fontSize+1 copyRight"'"
copyText2    = "'text 1,"fontSize+2 copyRight"'"

thisCommand = 'convert -colors 256 -crop 20% -quality 30' ,
              || ' -geometry 'iconGeometry ,
              || ' -pointsize 'fontSize' -font 'fontName' -fill white' ,
              || ' -gravity SouthEast -draw 'copyText1 ,
              || ' -pointsize 'fontSize' -font 'fontName' -fill red' ,
              || ' -gravity SouthEast -draw 'copyText2 ,
              || ' "'jpegName'" "'thumbName'"'
address SYSTEM thisCommand with OUTPUT STEM out. ERROR STEM err.
if err.0 \= 0 | out.0 \= 0 then do
   say 'Unexpected output from 'thisCommand
   do j = 1 to err.0; say 'Err 'err.j; end;
   do j = 1 to out.0; say 'Out 'out.j; end;
   return 0
   end

return 1
