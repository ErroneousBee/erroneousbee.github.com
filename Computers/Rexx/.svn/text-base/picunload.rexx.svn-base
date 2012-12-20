#!/usr/bin/rexx
/* Rexx - Grab Files from sandisk into NaturePics
          and launch konquerer in the right dir */

cfCard     = '/mnt/sandisk'
nikonDir   = '/dcim/100nikon'
filesDir   = '/mnt/windows/My Documents/Nature Pictures/unsorted'
dirDate    = TRANSLATE('abcd-ef-gh',DATE('S'),'abcdefgh')
cardDir    = cfCard || nikonDir
photoDir   = filesDir || '/' || dirDate

/* Check lock file, in case shes gone clickitty mad again. */
lockFile = '/tmp/'USERID()'_'UNAME('N')'_copyPics.lock'
if STREAM(lockFile,'C','QUERY EXISTS') \= '' then do
   say 'You stupid tart! This isnt Windoze, just click ONCE!'
   call SLEEP 5
   exit
   end
call LINEOUT(lockFile,GETPID())
call STREAM(lockFile,'C','CLOSE')


/* Verify the photodir is unique */
c = 0
do until STREAM(photoDir,'C','QUERY EXISTS') = ''
   c = c + 1
   photoDir = filesDir || '/' || dirDate || '_'c
end

/* Create and copy the files into it */
say 'Creating' photoDir
address SYSTEM 'mkdir "'photoDir'"'
say 'Copying files from 'cardDir' to 'photoDir
address SYSTEM 'cp -rfv "'cardDir'/"* "'photoDir'"'

/* remove lockfile */
address SYSTEM "rm -f" lockFile

/* Launch the preparation scripts */
say 'Preparing pictures'
call "picprepare.rexx" photoDir
say 'Creating index page'
call "picmkwebpage.rexx" photoDir 

/* Launch a browser */
say 'Launching konqi'
address SYSTEM "konqueror" '"'photoDir || '/index.html"'


exit
