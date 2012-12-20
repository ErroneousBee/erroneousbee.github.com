/* REXX : RXGDGV() ------------------------------------------------
SYNOPSIS : Returns all GDG dataset suffixes for a given GDG base.
VERSION : 1.1 
CREATED : 03/03/94 John McDonald <jmac@tsb.weschke.com>
UPDATED : 15/01/96 Neil Hancock. Rewrite for local use.
UPDATED : 06/06/96 Neil Hancock. Revisit for FAQ example.
UPDATED : 06/07/99 Neil Hancock. Bugs spotted!
NOTES : See end of function for syntax notes
------------------------------------------------------------------- */
if ARG() = 0 then return '8,No arguments given'

/* Trap output from TSO LISTCAT */
x = OUTTRAP(listc.)
address TSO "LISTC ENT("ARG(1)")"
x = OUTTRAP('OFF')

/* Parse and pack LISTCAT output into return result */
if SPACE(SUBWORD(listc.1,1,2)) \= "GDG BASE" then return '8,Not a GDG base'
return_rcode = (listc.0 - 2)/2
return_data = ''
do i = 3 to listc.0 by 2
   return_data = ','SUBSTR(listc.i,LASTPOS("G",listc.i))||return_data
end

return return_rcode||return_data
/* RXGDGV() Syntax Notes -------------------------------------------------
Syntax : data = RXGDGV(gdg_base)
where data = rc,count,gdgv.1,gdgv.2,...,gdgv.count
rc - Return code.
count - Count of returned GDG qualifiers,
or an error message if rc > 0
gdgv. - Returned GDG qualifier. Most recent generation first.

Example:
say RXGDGV("'SYS1.DUFF.DATASET'")
==> 8,Not a GDG base

say RXGDGV("'SYS1.GDGBASE'")
==> 0,3,G0003V00,G0002V00,G0001V00

parse value RXGDGV("'SYS1.GDGBASE'") with rc','count','gdgvs
=> rc = 0 count = 3 gdgvs = G0003V00,G0002V00,G0001V00
-- End of RXGDGV Syntax notes --------------------------------------- */