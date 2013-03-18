---
layout: post
title: "Installing transmission on the Tonido2plug"
description: Installing the transmission bittorrent client
category: tonido2plug
tags: [tonido2plug,arch,systemd]
---
{% include JB/setup %}

 
# Install transmission

   sudo pacman -Sy transmission-cli
    
# Start the service

   neil@tonido]$ sudo systemctl start transmission.service
 
# Configure the basics

You have to stop the service else it may not pick up the changed config.

    [neil@tonido]$ sudo systemctl stop transmission.service
    [neil@tonido]$ sudo vi /var/lib/transmission/.config/transmission-daemon/settings.json
    
- Turn on rpc-whitelist for 168.192.*.*
- Set rpc user and password to whatever you are going to use when connecting to the webserver.

# Configure the rest

You can do most of the config from the web service after this. 
Point a browser at [http://tonido:9091/transmission](http://tonido:9091/transmission)
and use the web config tool.
    
Set message-level to 1 after a while to cut down on Info logging.
 
# Allow the daemon to be stopped from desktop

Allow all users in admin group to issue specific commands without any passwords:

I set up a sudoers file to allow admin group to issue some restricted commands without any passwords:

    [root@tonido]# more /etc/sudoers.d/admin 
    Cmnd_Alias PACMAN  = /usr/bin/pacman -Sy
    Cmnd_Alias TRANSM  = /usr/bin/systemctl stop transmissiond.service,/usr/bin/systemctl start transmission.service
    %admin ALL=(ALL)NOPASSWD:PACMAN,TRANSM

Now the service can be stopped/started from afar:

    [neil@desktop]$ ssh tonido "sudo /usr/bin/systemctl stop transmission.service"
      

# Automate service startup overnight

Setup transmission start/stop as root:

    crontab -e
    
Add start/stop commands: (to run it overnight).

    30 0 * * * /usr/bin/systemctl start transmission.service
    30 6 * * * /usr/bin/systemctl stop transmission.service





 
