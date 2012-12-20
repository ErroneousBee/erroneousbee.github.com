#!/usr/bin/rexx
/* rexx - Generic Imagemagick convert, copying original into /tmp
   call is something like picconvert.rexx '"-rotate 90"' mypic.jpg */
parse arg '"' convertOpts '"' fullFileName

/* Get opts from 2nd arg if we are an internal callee */
if convertOpts = '' then convertOpts = ARG(2)

filePos = LASTPOS('/',fullFileName) + 1
parse var fullFileName jpegDir =(filePos) jpegName
jpegDir = STRIP(STRIP(jpegDir,,'"'))
jpegName = STRIP(STRIP(jpegName,,'"'))

/* Copy into tmp, user must clean this up occasionally */
tempFile ='/tmp/piccopy' ,
        || '_'USERID()'_'DATE('S')'_'TIME('L')'_'GETPID() ,
        || '_'jpegName
address SYSTEM "cp -f " '"'jpegName'"' '"'tempFile'"'

/* Change into the jpeg's directory */
if jpegDir \= '' then x = DIRECTORY(jpegDir)

/* run Imagemagick convert with options as defined above. */
thisCommand = 'convert 'convertOpts ,
           || ' "'jpegName'" "'jpegName'"'
address SYSTEM thisCommand with OUTPUT STEM out. ERROR STEM err.
if err.0 \= 0 | out.0 \= 0 then do
   do j = 1 to err.0; say 'Err 'err.j; end;
   do j = 1 to out.0; say 'Out 'out.j; end;
   end


exit

