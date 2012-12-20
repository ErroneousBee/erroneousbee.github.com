/* REXX -----------------------------------------------------------*
   TBFLATEN - Convert input table into a flat file
*------------------------------------------------------------------*
|        All trademarks and registered names acknowledged          |
|     Copyright Macro 4 plc 1999,2000 - all rights reserved        |
*------------------------------------------------------------------*
*
* Change Activity.
*
* CID   Level  When     Who  What
*
* D000  1.000A 09/04/99 NWH  Created
*
*------------------------------------------------------------------*
*
*------------------------------------------------------------------*/
TB_Members = 'TDMBA01'
TB_dsn     = 'NWH.DMODEV.INSTALL'
TB_ddn     = 'TEMPTLIB'
address ISPEXEC

/* STACK the LIBDEF for the table DD */
"LIBDEF" TB_ddn "DATASET ID('"TB_dsn"') STACK"

/* Report on each member in the list of members */
do i = 1 to WORDS(TB_Members)

   /* Start slapping out the report for this table */
   TB_Member = WORD(TB_Members,i)
   say ' '
   say '--------------------------------------------------------'
   say 'Table: 'TB_Member

   /* Get open the table */
   "TBOPEN" TB_Member "NOWRITE LIBRARY("TB_ddn")"
   if rc \= 0 then do
      say 'Open rc = 'rc
      iterate
      end

   /* Get the field names of the table and report them */
   "TBQUERY" TB_Member "KEYS(TBkeys) NAMES(TBnames)"
   TB_Keys  = STRIP(TRANSLATE(TBkeys,,'()'))
   TB_Names = STRIP(TRANSLATE(TBnames,,'()'))
   TB_Vars  = STRIP(TB_Keys TB_names)
   say 'Keys:  'TB_Keys
   say 'Names: 'TB_Names

   /* Loop through the table getting each record and reporting its
      contents */
   "TBTOP" TB_Member
   do j = 1
      "TBVCLEAR" TB_Member
      call Set_TB_Vars '*'
      "TBSCAN" TB_Member "ARGLIST("TB_Keys TB_Names")"
      if rc \= 0 then leave
      say '------------ Record 'j' -------------'
      call Say_TB_Vars
   end

   /* CLOSE the table */
   "TBCLOSE" TB_Member

end

/* Free the libdef */
"LIBDEF" TB_ddn
exit

/**-------------------------------------------------------------
   Set all field names in a table to the ARG1() value
   ------------------------------------------------------------- */
Set_TB_Vars:

do count = 1 to WORDS(TB_Vars)
   junk = VALUE(WORD(TB_Vars,count),ARG(1))
end

return
/* -------------------------------------------------------------
   Report all table fields and their contents
   ------------------------------------------------------------- */
Say_TB_Vars:

do count = 1 to WORDS(TB_Vars)
   TB_var = WORD(TB_Vars,count)
   say ' 'TB_Var'=' VALUE(TB_Var)
end

return
