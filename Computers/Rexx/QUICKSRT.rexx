/* REXX ------------------------------------------------------A-RCH*
   QUICKSRT - Quicksort demo
*------------------------------------------------------------------*
* Change Activity.
*
* CID   Level  When     Who  What
*
* D000  v.rmmm 29/04/99 NWH  Created
*
*------------------------------------------------------------------*
*
*------------------------------------------------------------------*/

return Qsort(ARG(1),1,WORDS(ARG(1)))

exit
/** ---------------------------------------------------------------
    Swap two numbered words in a string
    --------------------------------------------------------------- */
Swap: procedure
parse arg string,pos1,pos2

select
 when pos1 < pos2 then do; lowPos = pos1; highPos = pos2; end;
 when pos1 > pos2 then do; lowPos = pos2; highPos = pos1; end;
 otherwise return string
end

return STRIP(SPACE( ,
       SUBWORD(string,1,lowPos-1) WORD(string,highPos) ,
       SUBWORD(string,lowPos+1,highPos-lowPos-1) WORD(string,lowPos) ,
       SUBWORD(string,highPos+1)))
/** ---------------------------------------------------------------
    Quicksort procedure for to be recursively called
    --------------------------------------------------------------- */
Qsort: procedure
parse arg numList,lowPointer,highPointer


if lowPointer < highPointer then do
   pivotPointer = Partition(lowPointer,highPointer)
   numList = Qsort(numList,lowPointer,pivotPointer)
   numList = Qsort(numList,pivotPointer+1,highPointer)
   end

return numList

/** ---------------------------------------------------------------
    Partition as used by Quicksort
    --------------------------------------------------------------- */
Partition: procedure expose numList
parse arg lowPointer,highPointer

pivot = WORD(numList,lowPointer)
leftwall = lowPointer
do i = (lowPointer+1) to highPointer
   if WORD(numList,i) < pivot then do
      leftwall = leftwall + 1
      numList  = Swap(numList,i,leftwall)
      end
   numList  = Swap(numList,lowPointer,leftwall)
end

return leftwall

