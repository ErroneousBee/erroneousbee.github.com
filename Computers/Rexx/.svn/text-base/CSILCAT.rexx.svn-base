/* REXX     : CSILCAT Function
   SYNOPSIS : REXX shell around Catalog Search Interface.
   VERSION  : 1.3
   CREATED  : 10 Sep 1996 12:38pm Hancock N
   UPDATED  : 23 May 1996 12:00pm V1.1 Hancock N
            : Include more translation of fields.
   UPDATED  : 10 Sep 1996 12:41pm V1.2 Hancock N
            : Do not report on catalogs with no entries.
   UPDATED  : 11 Sep 1996 5:07am V1.3 Hancock N
            : Add Bdebug for easy viewing of work area fields.
   NOTES    : See end of function for syntax notes.
   ====================================================================
*/
parse arg Xdsn,Xdetail,Xmatch,Xexclude
Bdebug = 0      /* Boolean debug. Must = 0 (off) or 1 (on) */
datasets = ''
dscount = 0
types = 'NONVSAM GDG CLUSTER DATA_COMPONENT ALTERNATE_INDEX GDS ',
        'INDEX_COMPONENT PATH ALIAS USER_CAT_CONNECT ATL_LIB ATL_VOL'
typeskey = 'ABCDGHIRXULW'
if Xmatch = '' then Xmatch = typeskey
if WordPos('DSTYPE',Xdetail) \= 0 then do
   Xdetail = DelWord(Xdetail,WordPos('DSTYPE',Xdetail),1)
   Bdstype = 1
   end
else Bdstype = 0
Xdetailnum = Words(Xdetail)

/* Initialize the static parm list */
MODRSNRC = '    '                   /*   CLEAR MODULE/RETURN/REASON  */
CSIFILTK = Substr(Xdsn,1,44)        /*   MOVE FILTER KEY INTO LIST   */
CSICATNM = Substr(' ',1,44)         /*   CLEAR CATALOG NAME          */
CSIRESNM = Substr(' ',1,44)         /*   CLEAR RESUME NAME           */
CSIDTYPS = Substr(' ',1,16)         /*   CLEAR ENTRY TYPES           */
CSICLDI  = 'Y'                      /*   INDICATE DATA AND INDEX     */
CSIRESUM = ' '                      /*   CLEAR RESUME FLAG           */
CSIS1CAT = ' '                      /*   INDICATE SEARCH > 1 CATALOGS*/
CSIRESRV = ' '                      /*   CLEAR RESERVE CHARACTER     */

/* Build the selection criteria fields part of parameter list  */
CSIOPTS  = CSICLDI || CSIRESUM || CSIS1CAT || CSIRESRV
CSIFIELD = CSIFILTK || CSICATNM || CSIRESNM || CSIDTYPS || CSIOPTS
CSIFIELD = CSIFIELD || X2C(Right(D2X(Xdetailnum),4,'0'))

/* Initialise the optional fields in directly into parm list */
do i = 1 to Xdetailnum
   CSIFIELD = CSIFIELD || Substr(Word(Xdetail,i),1,8,' ')
end

/* Initialize and build work are output part of parameter list     */
WORKLEN = 1024
dwork = '00000400'X || COPIES('00'X,WORKLEN-4)

/* Initialize work variables */
csiresum = 'Y' /* for looping, not parmlist */

/* Set up loop for resume (if a resume is necessary) */
do while csiresum = 'Y'
   /* Issue link to catalog generic filter interface  */
   address LINKPGM "IGGCSI00  MODRSNRC  CSIFIELD  DWORK"
   if rc >= 20 then exit rc',CATALOG SEARCH INTERFACE HAS EXPIRED'

   csiresum = Substr(CSIFIELD,150,1) /* GET RESUME FLAG FOR NEXT LOOP */
   csiusdln = C2D(Substr(dwork,9,4)) /* GET AMOUNT OF WORK AREA USED  */
   pos1=15                           /* STARTING POSITION             */

   /* Process data returned in work area  */
   do while pos1 < csiusdln /* Repeat until all data is processed */

      /* Check csictype, if catalog, get its name from csicname */
      if Substr(dwork,pos1+1,1) = '0' then do
         csicname = Substr(dwork,pos1+2,44)
         if Bdebug then do
            say 'CSICNAME =' csicname
            say 'CSICFLG  =' X2B(C2X(Substr(dwork,pos1,1)))
            say 'CSICRETN =' C2D(Substr(dwork,pos1+46,2))
            say 'CSICRETR =' C2D(Substr(dwork,pos1+48,2))
            end
         pos1 = pos1 + 50
         /* Iterate do loop if no entries for this catalog */
         if C2D(BITAND(Substr(dwork,pos1-50,1),'40'x)) = 64 then iterate
         end

      /* Check Entries exist for this catalog using csieflag */
      if Bdebug then do
         say 'CSIEFLAG =' X2B(C2X(Substr(dwork,pos1,1)))
         say 'CSIETYPE =' Substr(dwork,pos1+1,1)
         say 'CSIENAME =' Substr(dwork,pos1+2,44)
         end
      if C2D(BITAND(Substr(dwork,pos1,1),'32'X)) = '0' then do
         pos1 = pos1 + C2D(Substr(dwork,pos1+46,2))
         iterate
         end

      /* Assign entry type and name */
      csietype= Substr(dwork,pos1+1,1);
      if Pos(csietype,Xmatch) = 0 | Pos(csietype,Xexclude) > 0 then do;
         pos1 = pos1 + 46;
         pos1 = pos1 + C2D(Substr(dwork,pos1,2));
         iterate;
         end;
      csiename = Strip(Substr(dwork,pos1+2,44));
      /* Convert csietype to full DS type in words for output */
      if Bdstype then
         csiename = csiename';'Word(types,Pos(csietype,typeskey));

      /* Have name and type, go to field data, get lengths  */
      pos1 = pos1 + 46;
      flentot = C2D(Substr(dwork,pos1,2));
      posf = pos1 + 4;
      do i = 1 to Xdetailnum;
         flen.i =  C2D(Substr(dwork,posf,2));
         posf = posf + 2;
      end;

      /* Have field lengths, get data from fields */
      if old_csiename = csiename then iterate
      old_csiename = csiename
      dataset = csiename
      do i = 1 to Xdetailnum
         field.i = Strip(Substr(dwork,posf,flen.i))
         Thisdetail = Word(Xdetail,i)
         select; /* convert fields into text */
         when Thisdetail = 'DEVTYP' then do;
              devnum = Wordpos(Right(C2X(field.i),2),'80 81 03') + 1;
              field.i = Word('DISK CART CARTE TAPE',devnum);
              end;
         when Thisdetail = 'VOLSER' then do j = 1 to Length(field.i)/6;
              field.i = Insert(' ',field.i,j*7-1);
              end;
         when Thisdetail = 'FILESEQ' then
              field.i = C2D(Substr(field.i,1,2));
         when Thisdetail = 'MGMTCLAS' then field.i = Substr(field.i,3);
         when Thisdetail = 'STORCLAS' then field.i = Substr(field.i,3);
         when Thisdetail = 'DATACLAS' then field.i = Substr(field.i,3);
         when Thisdetail = 'LRECL' then field.i = C2X(field.i);
         when Thisdetail = 'GDGLIMIT' then field.i = C2X(field.i);
         when Thisdetail = 'DSCRDT2' then field.i = C2X(field.i);
         when Thisdetail = 'DSEXDT2' then field.i = C2X(field.i);
         when Thisdetail = 'BUFSIZE' then field.i = C2X(field.i);
         when Thisdetail = 'PRIMSPAC' then field.i = C2X(field.i);
         when Thisdetail = 'SCONSPAC' then field.i = C2X(field.i);
         when Thisdetail = 'HURBADS' then field.i = C2X(field.i);
         when Thisdetail = 'HARBADS' then field.i = C2X(field.i);
         when Thisdetail = 'LBACKDT' then field.i = C2X(field.i);
         when Thisdetail = 'AMDKEY' then field.i = C2X(field.i);
         when Thisdetail = 'AMDCIREC' then field.i = C2X(field.i);
         otherwise nop;
         end;
         dataset = dataset';'field.i;
         posf = posf + flen.i;
      end;
      datasets = datasets','dataset;
      dscount = dscount + 1;

      /* Get position of next entry */
      pos1 = pos1 + C2D(Substr(dwork,pos1,2));
   end; /* do while pos1 < csiusdln */
   if Bdebug then say 'CSIRESUM = 'csiresum
end; /* do while csiresum = 'Y' */

if dscount = 0 then exit '0,0,No datasets found';
exit 0','dscount||datasets;
/* -------------------------------------------------------------------
                     Syntax Notes for Users
   -------------------------------------------------------------------
Syntax :
   fields = CSILCAT(dataset_pattern,returned_data_fields,types_required,
            types_not_required)
 dataset_pattern - e.g. HLQ.PP*.*
 returned_data_fields - data fields required e.g. VOLSER. See CSI manual
(Field
           Name Directory) for a list of valid data types. Also allowed
is
           DSTYPE, which will return you the dataset type. Field data is
           returned in the order specified, exept for DSTYPE which
appears
           as the first entry in the return string.
 types_required - Only report datasets of type matching DStype letter
indicator.
           Matched dataset types are:  (C)luster (D)ata (I)ndex
           nonvs(A)m (H)gds (B)gdg (R)path (G)aix (X)alias (U)cat
 types_not_required - See types_required.

Returned Data Format:

rc,count,dsn;detail1;detail2;...;detailN,dsn;detail1,detail2;...;detailN
 rc - return code
 count - number of datasets found
 dsn - dataset name
 detailN - requested fields e.g. Volser, creation date, etc.

Example:
  say CSILCAT('SYS2.*.*','VOLSER','CAB') returns all dsns and volsers
for
            Clusters, Nonvsam and GDG datasets.

Example:
 Report device fsn and creation date for all nonvsam datasets of mine.
 dsn = 'SYS2.NHDAT*.*.*'
 details = 'VOLSER DEVTYP FILESEQ DSCRDT2'
 parse value csilcat(dsn,details,'A') with rc ',' dsn.0 ',' datasets
 do i = 1 to dsn.0
    parse var datasets dsn ';' volser ';' dev ';' fsn ';' dscrdt2 ','
datasets
    say dsn dev fsn dscrdt2
 end
  ====================================================================*/

