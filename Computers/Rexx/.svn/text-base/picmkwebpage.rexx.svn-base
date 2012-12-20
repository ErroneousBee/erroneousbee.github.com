#!/usr/bin/rexx
/* rexx - Make web page in web directory for cutting into
   web site or something. */
parse arg dirName
if dirName = '' then dirName = '.'
say 'Making index page for 'dirName

/* Change into the directory */
junk = DIRECTORY(dirName)
say '...'junk

/* Make a thumbs directory if required */
if STREAM(dirName'/thumbs','C','QUERY EXISTS') = '' then
   address SYSTEM "mkdir" '"'dirName'/thumbs"'
group. = ''
group.0 = 0

/* List the Piccies and gather into groups
by reading the textfiles that go with each picture */
address SYSTEM "ls -1sh *.jpg" with OUTPUT STEM lsout.
do i = 1 to lsout.0
   parse var lsout.i size.i piccy.i
   say '....'piccy.i

   /* create the thumbnail in thumbs dir. */
   mkthumb = 0
   thumb.i = 'thumbs/'piccy.i
   thumbModify = STREAM(thumb.i,'C','QUERY TIMESTAMP')
   piccyModify = STREAM(piccy.i,'C','QUERY TIMESTAMP')
   if STREAM(thumb.i,'C','QUERY EXISTS') = '' , 
    | thumbModify < piccyModify then 
      call "picmkthumb" piccy.i,'200x200','(c)NWH' 

   /* Read info about the file from ImageMagick */
   thisCommand = 'identify -format "%b %wx%h" "'piccy.i'"'
   address SYSTEM thisCommand with OUTPUT STEM out. ERROR STEM err.
   parse var out.1 sizeText.i
   sizeText  = sizeText.i

   /* Read group and indextext info from the file*/
   descText  = ''
   groupName = ''
   parse value "picgettext"(piccy.i,'group title shutter aperture date time') ,
          with 1 'group="'     thisGroup  '"' ,
               1 'title="'     thisTitle  '"' ,
	       1 'shutter="'   thisShutt  '"' ,
	       1 'aperture="'  thisAper   '"' ,
	       1 'number="'    thisNumber '"' ,
	       1 'date="'      thisDate   '"' ,
	       1 'time="'      thisTime   '"'
   if thisGroup = '' then thisGroup = 'Pictures'
   if thisShutt = '' | thisAppr = '' then thisExpInfo = ''
   else thisExpInfo = thisShutt'@'thisAper
   if thisNumber = '' then parse var piccy.i . '_' . '_' thisNumber '.' .
   if thisNumber \= '' then thisNumber = '#'thisNumber

   /* Generate the html code for this Icon */
   code.i = '<td align="center"><a href="'piccy.i'">' ,
         || '<img src="'thumb.i'">' ,
         || '<br>'thisTitle'</a>',
	 || '<font size="-2">', 
	 || '<br>'sizeText, 
	 || '<br>'thisNumber thisDate thisTime,
	 || '<br>'thisExpInfo,
	 || '</font> </td>'

   /* If the group is new, create a table for it */
   if group.thisGroup = '' then do
      groupNum = group.0 + 1
      group.0 = groupNum
      group.groupNum = thisGroup
      group.thisGroup = i
      group.thisGroup.#CODE = '<hr> <h3> 'thisGroup': </h3>' ,
                           || '<table border="0" align="center"> <tr>'
      end
   else do
      group.thisGroup = group.thisGroup i
      end

end
piccy.0 = lsout.0

/* Create the html output */
outFile = 'index.html'
say 'Creating' outFile
call LINEOUT outFile, '<html><head>' ,1
call LINEOUT outFile, '<title> Index of 'dirName' </title>'
call LINEOUT outFile, '</head>'
call LINEOUT outfile, '<body>'
do i = 1 to group.0
   thisGroup = group.i
   call LINEOUT outFile, group.thisGroup.#CODE

   do j = 1 to WORDS(group.thisGroup)
      thisPiccy = WORD(group.thisGroup,j)
      call LINEOUT outFile, code.thisPiccy
      if j // 4 = 0 then call LINEOUT outFile, '</tr> <tr>'
   end
   call LINEOUT outFile, '</tr> </table>'
end
call LINEOUT(outfile,'</body>')
exit


