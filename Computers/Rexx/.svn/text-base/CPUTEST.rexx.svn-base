/* rexx - Demonstrate use of SYSCPU and test the speed of 
          stem processing vs. string functions.             */

address TSO "CLEAR"
junk       = EndLabel('Make sure its all Interpreted')
string1    = '012345678901234567890'
string2    = 'A long string to make string search look better!'
loops      = 5000
longstring = ''

/* Create a stemmed var with random values */
do i = 1 to loops
   if RANDOM(10) = 1 then stem.i = string2
   else stem.i = string1
end
stem.0 = loops

/* Now create an eqivalent single var. Note that this takes
   *ages* and undoes any performance boost that the later
   nextPos = POS() method may give us */
longstring = ''
do i = 1 to stem.0
   longstring = longstring || stem.i
end

/* Find count of texts in longstring */
cpuS      = SYSVAR('SYSCPU')
stringLen = LENGTH(string2)
nextPos   = 1 - stringLen
do i = 0 until NextPos = 0
   nextPos = POS(string2,longstring,nextPos+stringLen)
end

/* Find count of texts in stem */
cpu1  = SYSVAR('SYSCPU')
count = 0
do i = 1 to stem.0
   if stem.i = string2 then count = count + 1
end

/* Report on how long it took (approx. 16% string, 84% stem) */
cpuE = SYSVAR('SYSCPU')
totalCPU = (cpuE-cpuS) / 100
say ReportCPU('String Search', cpuS, cpu1, totalCPU)
say ReportCPU('Stem   Search', cpu1, cpuE, totalCPU)

exit

/* ------------------ Procedures and Functions ----------------- */
/** Report the CPU cycles used */
ReportCPU: procedure
parse arg header, start, stop, total
return header 'CPU 'stop-start '(' (stop-start)%total 'percent )'

/** Calling this function forces the interpreter to process
    the whole exec there and then, rather than doing it in
    the middle of our CPU measurment loops */
Endlabel: return 0
