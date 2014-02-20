---
layout: post
title: "Using Flexget on Tonido"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Installing is easy:

    sudo pacman -Su flexget

Configuration is a little hairy, as the YAML is very fussy about whitespace.

    mkdir .flexget
    vi .flexget/config.yml
    
And transliterate everything from podracer to config.yml:

    tasks:                                                                                                                                                                                                                                                                         
      nakedscientists:                                                                                                                                                                                                                                                             
        accept_all: yes                                                                                                                                                                                                                                                            
        rss: http://www.thenakedscientists.com/naked_scientists_podcast.xml                                                                                                                                                                                                        
        download: /home/neil/PodCasts/Naked_Scientists/                                                                                                                                                                                                                            
      nature:                                                                                                                                                                                                                                                                      
        accept_all: yes                                                                                                                                                                                                                                                            
        rss: http://www.nature.com/nature/podcast/rss/nature.xml                                                                                                                                                                                                                   
        download: /home/neil/PodCasts/Nature_Magazine/                                                                                                                                                                                                                             
      iot:                                                                                                                                                                                                                                                                         
        accept_all: yes                                                                                                                                                                                                                                                            
        rss: http://downloads.bbc.co.uk/podcasts/radio4/iot/rss.xml                                                                                                                                                                                                                
        download: /home/neil/PodCasts/BBC/In_Our_Time/
      scia:    
        accept_all: yes
        rss: http://downloads.bbc.co.uk/podcasts/worldservice/scia/rss.xml
        download: /home/neil/PodCasts/BBC/ScienceInAction/
      moreorless:
        accept_all: yes
        rss: http://downloads.bbc.co.uk/podcasts/radio4/moreorless/rss.xml
        download: /home/neil/PodCasts/BBC/MoreorLess/
      astronomycast:
        accept_all: yes
        rss: http://www.astronomycast.com/feed/
        download: /home/neil/PodCasts/Astronomy_Cast/
      jodcast:
        accept_all: yes
        rss: http://www.jodcast.net/rss.xml
        download: /home/neil/PodCasts/jodcast/
      medicalmatters:
        accept_all: yes
        rss: http://downloads.bbc.co.uk/podcasts/radio4/medmatters/rss.xml
        download: /home/neil/PodCasts/BBC/MedicalMatters/
      planetmoney:
        accept_all: yes
        rss: http://www.npr.org/rss/podcast.php?id=510289
        download: /home/neil/PodCasts/npr/PlanetMoney/
      discovery:
        accept_all: yes
        rss: http://downloads.bbc.co.uk/podcasts/worldservice/discovery/rss.xml
        download: /home/neil/PodCasts/BBC/Discovery/
      insidescience:
        accept_all: yes
        rss: http://downloads.bbc.co.uk/podcasts/radio4/inscience/rss.xml
        download: /home/neil/PodCasts/BBC/InsideScience/
        
And we test the configuration:

    flexget check
    
Flexget does not create directories for you by default:

    cat .flexget/config.yml | grep "download:" | sed -e "s/download:/mkdir -p/"

and run the commands generated (being careful about spaces in directory names).

We don't want to load old podcasts so we teach it about existing podcasts.

    flexget execute --learn
    
We now can schedule this to run overnight:
    
    crontab -e
    
And add the flexget entry
    
    30 0 * * *   /usr/bin/flexget -c /home/neil/.flexget/config.yml execute --cron

After a few days we look in our PodCasts directory and we find ...

    [nothing]
    [zip]
    [nada]
    
We footle around for an hour trying to work out why flexget says it is downloading, when nothing arrives in our PodCasts directory. 
We notice that flexget is very slow. Frustratingly slow.


This slow:

    [neil@tonido ~]$ time flexget check
    2014-02-20 03:13 INFO     check                         Config passed check.
    
    real    0m21.465s
    user    0m20.190s
    sys     0m0.790s
    
And yes, those times are typical of flexget, so we run:

    sudo pacman -Rs flexget
    rm -rf .flexget
    crontab -e      # and remove the flexget entry
    rm -rf PodCasts
    
and we go back to running good old podracer with its install script hacked to remove the bittorrent dependancy.


