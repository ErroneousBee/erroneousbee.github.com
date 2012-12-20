/* REXX ----------------------------------------------------------
   SYNOPSIS : Trap output from tso command and copy it to file
   VERSION  : 1.0
   CREATED  : 23 Jul 1998 9:55am NWH
   NOTES    :
------------------------------------------------------------------ */

/* Gen dsn prefix bades upon profile prefix */
if Sysvar('SYSPREF') = Userid() then prefix = Userid()'.FILE'
else prefix = Sysvar('SYSPREF')'.'Userid()'.FILE'

/* Gen DSN, and test it for uniquness */
theTime = Time(s)
count = 0
listcrc = 0
x = Msg('OFF')
x = OutTrap('junk.')
do until listcrc > 0 | count > 999
   count = count + 1
   outdsn = prefix || Right(count,4,'0')
   address TSO "LISTC ENT('"outdsn"')"
   listcrc = rc
end
x = OutTrap('OFF')
x = Msg('ON')
drop junk

/* Allocate the dataset */
address TSO "ALLOC FI(T"theTime") DA('"outdsn"') NEW CATALOG",
            "LRECL(80) BLKSIZE(8000) DSORG(PS) RECFM(F,B)",
            "SPACE(5,5) CYL RELEASE"

/* Trap the output of the TSO command into stem var out. */
x = OutTrap('out.')
address TSO Arg(1)
X = OutTrap('OFF')

/* Write output to dsn, and go home */
address MVS "EXECIO * DISKW T"theTime" (STEM out. FINIS)"
address TSO "FREE FI(T"theTime")"
say out.0 ' lines written to 'outdsn
exit
