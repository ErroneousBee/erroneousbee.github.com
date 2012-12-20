/*% NOCOMMENT REXX -------------------------------------------A-RCH*
   DTLCOMP - Compile the DTL sources in this library.
*------------------------------------------------------------------*
*
* Change Activity.
*
* CID   Level  When     Who  What
*
* D000  4.900  13/01/00 NWH  Created
*
*------------------------------------------------------------------*
*
* 1. Change var dtlProfLib to point to the correct DTL PROFILE you want.
* 2. Edit the DTLPROF member to point to the libraries you
*    are using.
* 3. Change var dtlSource to point to the panel name(s) you wish to
*    compile.
* 4. Run this EXEC. TSO EX 'hlq.thisLib.REXX(thismem)'
*
*------------------------------------------------------------------*/
address TSO
dtlProfLib = "'hlq.yourLib.REXX(DTLPROF)'"

/* Assorted lists of related DTL sources */
dtlMessages     = 'SAMPMSGS'
dtlTable1       = 'SAMPTB1 SAMPTB1H'
dtlMore         = 'SAMPP1 SAMPP2 SAMPP3 SAMPPH'

/* And the winners in the Source Files Most in Need of Compilation
   category are:                                                   */
dtlSource = dtlTable1

/* Compile each member we in dtlSource */
"CLEAR"
do i = 1 to Words(dtlsource)
   "ISPDTLC" Word(dtlsource,i) ,
         "(KEYLAPPL=ISR REPLACE",
         "MSGSUPP CUASUPP NOPANEL NOPREP LSTVIEW NOSCRIPT",
         "PROFILE="dtlProfLib")"
end

