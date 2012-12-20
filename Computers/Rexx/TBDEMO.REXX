/*% NOCOMMENT REXX -------------------------------------------A-RCH*
   TBDEMO   - Demo the use of TBDISP for a simple table
*------------------------------------------------------------------*
* Change Activity.
*
* CID   When     Who  What
*
* D000  26/05/00 NWH  Created
*
* ToDo 
* 1. Add scroll amount code and DTL CSR= prompt
* 2. Add sort code
*------------------------------------------------------------------*/
address ISPEXEC

/* Create global variables and LIBDEF the libraries needed */
global = 'gl.'
if Initialise() \= 0 then exit 8

/* Create the new table member, and populate it with junk.
   We are allocating NOSHARE here cos we may be REPLACing an
   existing table. Normally SHARE is considered groovy, cos
   you can then open the table in another screen */
"TBCREATE" gl.TB_Name "REPLACE",
                   "LIBRARY("gl.TB_DDn")",
                   "KEYS("gl.TB_Keys")",
                   "NAMES("gl.TB_Fields")"
if rc \=0 then say 'RC='rc 'from TBCREATE of' gl.TB_Name
do i = 1 to 100
   KEY1 = i
   FLD1 = RANDOM(1000)
   FLD2 = WORD('HADDOCK KIPPER GUPPY CHEESE',RANDOM(1,4))
   FLD3 = TIME('N')
   FLD4 = DATE('N')
   "TBADD" gl.TB_Name
end

/* Prepare some variables we use to control the display */
BoutLoop   = 0          /* True when END pressed                      */
tbdispRc   = 0          /* Return code from TBDISPL                   */
tbdispCsr  = ''         /* Field name where cursor is to be placed    */
tbdispRow  = 1          /* The top row currently displayed            */
tbPos      = 0          /* The CRP of the row selected                */
tbSel      = ''         /* The select  field in the TBDISPL panel     */
tbSelChars = '+-EUD'    /* Valid tbSel values in popup menu order     */
tbSelLast  = ''         /* The last tbSel used                        */
command    = ''         /* The command field in the TBDISPL panel     */
TBDDN      = gl.TB_DDn  /* To be shown on the panel                   */
TBDSN      = gl.TB_DSN  /* To be shown on the panel                   */

/* Set the scan arguments */
"TBTOP    "gl.TB_Name
"TBVCLEAR "gl.TB_Name
KEY1 = '*'
"TBSARG   "gl.TB_Name" NAMECOND(KEY1)"

/* Enter into panel, and stay in until END or CANCEL pressed */
do until BoutLoop
   tbsel = ''
   if tbdispRc = 0 then do
        "TBDISPL "gl.TB_Name "PANEL("gl.Pan_Main")" tbdispCsr ,
                             "POSITION(tbPos)"
        tbdispRow = ztdtop
        end
   else "TBDISPL "gl.TB_Name "POSITION(tbPos)"
   tbdispRc  = rc
   tbdispCsr = ''
   if tbdispRc = 8 then Boutloop = 1
   if tbdispRc > 8 then do
      say 'Bad ISPF table error = 'tbdispRc' from TBDISPL'
      exit 8
      end

   /* Deal with stuff from the command line */
   select
      when STRIP(command) = ''  then nop
      when command = 'HELLO'    then say 'Hello yourself!'
      otherwise                      say 'Watchew talkin bout, Willis?'
   end

    /* Deal with the user pressing enter or END with the cursor
     * in assortedplaces in the panel */
    select

       /* User has pressed enter or END and there are outstanding
        * explicit tbSel selections to be processed */
       when ztdsels > 0 then nop

       /* User pressed END, with no outstanding explicit tbSel
        * selections to be processed */
       when ztdsels = 0 & Boutloop then iterate

       /* Enter pressed enter with the cursor in a table row */
       when ztdsels = 0 & zcurinx > 0 then do
         tbsel     = TB_defaultTbSel
         tbdispRow = zcurinx
         "TBTOP  "gl.TB_Name
         "TBSKIP "gl.TB_Name" NUMBER("zcurinx")"
         end

       /* Enter pressed, cursor in uninteresting place */
       otherwise iterate
    end

   /* User supplied the generic / selection. Present a popup menu
      and convert this into a real tbSelection letter */
   if POS(tbSel,tbSelChars) = 0 then do
      tbSel = 2
      "ADDPOP ROW(4) COLUMN(10)"
      "DISPLAY PANEL("gl.Pan_PopUp")"
      rcode = rc
      "REMPOP"
      if rcode \= 0 then iterate
      tbSel = SUBSTR(tbSelChars,tbSel,1)
      end

   /* Deal with the tbsel for this particular entry */
   select
      when tbsel = 'E' then do
           FLD2   = ''
           status = WORD('Yum Burp Munch',RANDOM(1,3))
           "TBPUT "gl.TB_Name" SAVE(status) ORDER"
           end
      when tbsel = '+' then do
           FLD1   = FLD1 + 1
           say 'FLD1 ='fld1  'Key1='key1
           "TBPUT "gl.TB_Name
           end
      when tbsel = '-' then do
           FLD1   = FLD1 - 1
           "TBPUT "gl.TB_Name
           end
      when tbsel = 'U' then do
           call Update_Record gl.TB_Name,gl.Pan_Update
           end
      otherwise say 'tbSel = 'tbsel'? Watchew talkin bout, Willis?'
   end

   /* Control where the cursor is placed
      and where in the table we are scrolled to */
   tbSelLast = tbSel
   tbdispCsr  = ''
   "TBTOP  "gl.TB_Name
   "TBSKIP "gl.TB_Name" NUMBER("tbdispRow") NOREAD"

end

/* Close the table without saving it, unstack the LIBDEF, exit */
"TBEND"  gl.TB_Name
call LIBDEF_Libraries(gl.AllDDNs)

exit

/** -------------------------------------------------------------
    Initialise global vars, LIBDEF panel and table libraries.
    ------------------------------------------------------------- */
Initialise: procedure expose (global)

/* Table details */
gl.TB_DSN      = 'NWH.GENERAL.TABLES'
gl.TB_DDn      = 'TEMPTLIB'
gl.TB_Name     = 'TBDEMO'
gl.TB_Keys     = 'KEY1'
gl.TB_Fields   = 'FLD1 FLD2 FLD3 FLD4'

/* Names and whereabouts of ISPF panels */
gl.Pan_DSN     = 'NWH.GENERAL.PANELS'
gl.Pan_DDn     = 'ISRPLIB'
gl.Pan_Main    = 'TBDEMOT'
gl.Pan_PopUp   = 'TBDEMOP'
gl.Pan_Update  = 'TBDEMOU'
gl.Pan_Confirm = 'TBDEMOC'

/* All things LIBDEF */
gl.AllDDNs     = gl.TB_DDn gl.Pan_DDn
gl.AllDSNs     = gl.TB_DSN gl.Pan_DSN
if LIBDEF_Libraries(gl.AllDDNs,gl.AllDSNs) \= 0 then return 8

return 0
/** -------------------------------------------------------------
    LIBDEF libraries, report any alloc errors, unLIBDEF too.
    ------------------------------------------------------------- */
LIBDEF_Libraries: procedure
parse arg DDNames,DSNames

/* LIBDEF many things, rollback and barf if one is a bit duff */
do i = 1 to WORDS(DDNames)
   if DSNames = '' then
      "LIBDEF" WORD(DDNames,i)
   else do
      "LIBDEF" WORD(DDNames,i) "DATASET ID('"WORD(DSNames,i)"') STACK"
      if rc \=0 then do
         say 'RC='rc 'from LIBDEF of' WORD(DSNames,i) ,
                                 'to' WORD(DDNames,i)
         call LIBDEF_Libraries SUBWORD(DDNames,i)
         return 8
         end
      end
end

return 0
/** -------------------------------------------------------------
    Say table stats to screen, with an explanation.
    ------------------------------------------------------------- */
Report_Table_Stats: procedure
parse arg tableName,library

"TBSTATS" tableName,
         "LIBRARY("TB_DDn")",
         "STATUS1(status1) STATUS2(status2) STATUS3(status3)"

select
 when status1 = 1 then
  say 'table exists in the table input library chain'
 when status1 = 2 then
  say 'table does not exist in the table input library chain'
 when status1 = 3 then
  say 'table input library is not allocated'
 otherwise
  say 'status1 = 'status1' is unknown'
end

select
 when status2 = 1 then
  say 'table is not open in this logical screen'
 when status2 = 2 then
  say 'table is open in NOWRITE mode in this logical screen'
 when status2 = 3 then
  say 'table is open in WRITE mode in this logical screen'
 when status2 = 4 then
  say 'table is open in SHARED NOWRITE mode in this logical screen'
 when status2 = 5 then
  say 'table is open in SHARED WRITE mode in this logical screen'
 otherwise
  say 'status2 = 'status2' is unknown'
end

select
 when status3 = 1 then
  say 'table is available for WRITE mode'
 when status3 = 2 then
  say 'table is not available for WRITE mode'
 otherwise
  say 'status3 = 'status3' is unknown'
end

return
/** -------------------------------------------------------------
    Display update panel, and update record
    ------------------------------------------------------------- */
Update_Record: procedure expose (global)(gl.TB_Keys)(gl.TB_Fields)
parse arg tableName, updatePanel

/* Remember old keyfield, in case it changes */
oldKey = KEY1

/* Display panel */
"ADDPOP ROW(10) COLUMN(10)"
"DISPLAY PANEL("updatePanel")"
rcode = rc
"REMPOP"

/* Replace keyfield, in case key has changed */
newKey = KEY1
KEY1 = oldKey
"TBDELETE" tableName
KEY1 = newKey
"TBADD   "tableName" ORDER"

return
