/* REXX -------------------------------------------------------
SYNOPSIS : Push MVS dataset contents to sysout
LIBRARY : /usr/lpp/internet/cgi-bin/DSBROWSE.REXX
VERSION : 1.1
CREATED : 22 Nov 1996 P Nelson
UPDATED : 15/01/97 N Hancock. Add translate option.
NOTES :
------------------------------------------------------------ */
/* Create the MIME header */
address SH "cgiutils -status 200 -ct text/x-ssi-html"

/* Get QUERY_string from environment and translate escaped chars in it */
tablein = '%23 %25 %27 %28 %29'
tableout = "# % ' ( )"
do i = 1 to __environment.0
   if substr(__environment.i,1,13)='QUERY_STRING=' then
   do
      query_string = Transtr(substr(__environment.i,14),tableout,tablein)
      leave
   end
end
parse var query_string 1 'DSN=' Xdsn '&' . ,
1 'TRANS=' Xtran '&' . ;

/* Parse input vars for use in code */
Xdsn = "'"Strip(Xdsn,,"'")"'"
if Translate(Xtran) = 'NO' then Xtran = 0
else Xtran = 1

/* Generate PAGE header section */
say '<HTML>'
say '<HEAD>'
say '<TITLE>Contents of 'Xdsn'</TITLE>'
say '</HEAD>'
say '<BODY>'

/* cat dataset to sysout. stem. Note that cat may not work in the future */
tablei = '< > &'
tableo = '&lt; &gt; &amp;'
cmd = 'cat "//'Xdsn'"'
say '<pre>'
if shcmd(cmd,,sysout.,syserr.) = 0 then do i = 1 to sysout.0
   if Xtran then outline = TranStr(sysout.i,tableo,tablei)||esc_n
   else outline = sysout.i||esc_n
   address syscall 'write 1 outline' length(outline)
   /* say sysout.i - say wraps output until os/390 r3 */
   end
else do i = 1 to syserr.0
   say syserr.i
   end
say '</pre>'

say '</BODY>'
say '</HTML>'

exit