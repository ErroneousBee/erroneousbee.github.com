/* REXX ----------------------------------------------------------
   SYNOPSIS : Rework JCL DISPS to be better
   LIBRARY  : NWH.GENERAL.EXEC(REDISP)
   VERSION  : 1.0
   CREATED  : 23 Jul 1998 10:09am NWH
   NOTES    :
------------------------------------------------------------------ */
address ISREDIT
"MACRO"

"EXCLUDE ALL"
"FIND ',DISP=SHR' ALL"
"CHANGE ',DISP=SHR' '' ALL NX"
"CHANGE 'DSN=' 'DISP=SHR,DSN=' ALL NX"
"RESET"
exit
