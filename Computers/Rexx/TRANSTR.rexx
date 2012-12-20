/* REXX ----------------------------------------------------------
SYNOPSIS : Translate strings in _string_ into other strings.
LIBRARY : ****.*****.****(****)
VERSION : 1.1
CREATED : 4 Dec 1996 4:59pm Hancock N
UPDATED : 25 Feb 1997 1:30pm V1.1 Hancock N
        : Redo to stop looping and add depth parm.
NOTES : String based version of character based Translate()
------------------------------------------------------------------ */
/*TranStr: procedure;*/
parse arg instring,tabout,tabin,depth;
if Datatype(depth,'NUM') = 0 then depth = 1

/* Loop across depth of replacement, usually only one pass */
do k = 1 to depth
   outstring = ''

   /* Loop along the string trying matches for all stings */
   do i = 1 to Length(instring);
      Bfound = 0;

      /* Try to match all the words in tabin and replace first match with tabout
         version, then move i counter to look beyond the replaced chars */
      do j = 1 to Words(tabin);
         Wordin = Word(tabin,j);
         if Pos(Wordin,instring,i) = i then do;
            outstring = outstring||Word(tabout,j);
            i = i + Length(Wordin) -1 ;
            Bfound = 1;
            leave;
            end;
      end; /* do j */
      if \Bfound then outstring = outstring||Substr(instring,i,1)

   end;/* do i */

   /* reset newly built intstring for next pass at depth */ 
   instring = outstring
end; /* do k */

return outstring;
/* Syntax.
stringo = Transtr(stringi,tableo,tablei,depth)
stringi - The string of characters to be converted.
tablei - Blank delimited strings to be found in stringi.
tableo - Corresponding strings to be written to stringo.
depth - Depth of translation to occur. (optional parm).
depth defaults to 1
if stringi or stringo are blank, I don't care what happens to your program.
*/