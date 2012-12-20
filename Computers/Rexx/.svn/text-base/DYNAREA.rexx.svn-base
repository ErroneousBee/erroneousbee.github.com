/* Rexx */
/* Dynamic area demo driver */

/* What we can know about the dynamic area */
address ISPEXEC "PQUERY PANEL(DEMODYNA) AREANAME(INSTEXT)",
                "AREATYPE(atypname)",
                "WIDTH(awidname) DEPTH(adepname)",
                "ROW(arowname) COLUMN(acolname)"
say 'Info about dynarea:'
say ' AREATYPE='atypname
say ' WIDTH='awidname
say ' DEPTH='adepname
say ' ROW='arowname
say ' COLUMN='acolname

/* Build the dynamic text, no shadow cos thats for poseurs */
line.1 = '30'x || 'Column Header'
line.2 = '31'x || 'Field Prompt.....:' || '32'x || ' '
line.3 = '31'x || 'Field Prompt.....:' || '32'x || ' '
instext = ''
do i = 1 to 3
   instext = instext || LEFT(line.i,awidname)
end

/* Show the panel, get the data back in instext */
address ISPEXEC "ADDPOP"
address ISPEXEC "DISPLAY PANEL(DEMODYNA)"
rCode = rc
address ISPEXEC "REMPOP"
if rCode \= 0 then exit

/* Extract the data from instext */
do until instext = ''
   parse var instext line +(awidname) instext
   say '>>'TRANSLATE(line,,'30313233343536'x)
end

exit
