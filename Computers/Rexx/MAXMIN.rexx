/**------------------------------------------------------------------
   Max function with easier call and no number limit.
   parse value MAXMIN('1 5 8 4 2 8 4') with ,
      maxValue ',' maxWordPos ',' minValue ',' minWordPos
   ------------------------------------------------------------------ */
MaxMin: procedure

/* Make comma delimited lists space delimited */
numbers = TRANSLATE(ARG(1),' ',',')

/* Take the first number as the current max/min extremes */
maxnum = WORD(numbers,1)
maxpos = 1
minnum = WORD(numbers,1)
minpos = 1

/* Find max and min numbers and their word positions */
do i = 1 to words(numbers)
   thisNum = WORD(numbers,i)
   if thisNum > maxnum then do; maxnum = thisNum; maxPos = i; end;
   if thisNum < minnum then do; minnum = thisNum; minPos = i; end;
end

/* Return the max and min numbers and their positions */
return maxnum','maxPos','minnum','minPos
