---
layout: post
title: "Initial Customization of Arch Linux on a Tonido2plug"
description: ""
category: 
tags: []
---
{% include JB/setup %}

You have just installed Arch on the Tonido2plug, now to do the initial setup.

ssh into the system (you may have to get clever to find the network address, try `ssh root@192.168.2.1`)



 
# Set root password

You should be logged in as root, so set the password now.

    passwd 
   

# Set up mount of the home directory
    
During the install, you partitioned your 500Gb drive to create a 20Gb root partition, and over 400Gb of home. The system hasnt been told about where to mount the second partition.

Edit fstab to mount /home.

    echo "/dev/sda2       /home   ext3    defaults,noatime      0      2" > /etc/fstab
    mount -a
 
The home directory is now mounted, and will mount at boot time. Check this with `df -h`

# Update the system and install some useful packages

    pacman -Syu
    pacman -S sudo rsync
    
# Set the hostname

Using hostnamectl requires all kinds of faffing, getting systemd running, etc etc. This work around was easier.

    pacman -S polkit
    shutdown -r now
	
ssh back into the system before running:

    hostnamectl set-hostname tonido

# Set clock

    ntpd -sd
    hwclock --systohc

# Make sure systemd runs rc.local during boot

The new ststemd appears not to include an rc.local service. This is 
probably fixed in later releases of Arch, but meanwhile, we can do it ourselves.

Create a new systemd entry for rc-local:

`vi /etc/systemd/system/rc-local.service`

This is the systemd config file:

    #  This file is part of systemd.
    #
    #  systemd is free software; you can redistribute it and/or modify it
    #  under the terms of the GNU General Public License as published by
    #  the Free Software Foundation; either version 2 of the License, or
    #  (at your option) any later version.
    
    [Unit]
    Description=/etc/rc.local Compatibility
    ConditionPathExists=/etc/rc.local
    
    [Service]
    Type=forking
    ExecStart=/etc/rc.local
    TimeoutSec=0
    StandardOutput=tty
    RemainAfterExit=yes
    SysVStartPriority=99
    
    [Install]
    WantedBy=multi-user.target

Start rc.local:

    chmod a+X /etc/systemd/system/rc-local.service
    systemctl --system daemon-reload
    systemctl enable rc-local.service
    systemctl start rc-local.service

If the start fails, use the systemctl status command to find out why:

    systemctl status rc-local.service
    
The output may tell you why it failed.
    
    rc-local.service - /etc/rc.local Compatibility
              Loaded: loaded (/etc/systemd/system/rc-local.service; enabled)
              Active: failed (Result: exit-code) since Wed, 2012-12-12 11:38:52 GMT; 8s ago
              Process: 336 ExecStart=/etc/rc.local (code=exited, status=127)
              CGroup: name=systemd:/system/rc-local.service

    Dec 12 11:38:52 tonido systemd[1]: Starting /etc/rc.local Compatibility...
    Dec 12 11:38:52 tonido systemd[1]: Failed to start /etc/rc.local Compatibility.
    Dec 12 11:38:52 tonido systemd[1]: Unit rc-local.service entered failed state

In this case is the script itself failed (exited with status-127) because me no type good.

# Calm the drive down a bit

Install hdparm tool, and add a command to rc.local to be quiet and spin down after it not been accessed for a while.

    pacman -S hdparm
    cat "/sbin/hdparm -q -B1 -q -S12 -q -M128 /dev/sda" /etc/rc.local

Unfortunately, theres lots of services poking at the drive, so it often spins up again.


# Shush syslog by cacheing stuff

One culprit, always spinning up the drive for no good reason is system logger.
Tell it to hold its horses by setting it to buffer in memory and flush when 
it gets to 10 lines or 10 hours:

`vi /etc/syslog-ng/syslog-ng.conf`
        
    options {
     stats_freq (0);
     flush_lines (10);
     flush_timeout (3600000);
     mark_freq(0); 
     time_reopen (10);
     log_fifo_size (10000);
     chain_hostnames (off);
     use_dns (no);
     use_fqdn (no);
     create_dirs (no);
     keep_hostname (yes);
     perm(0640);
     group("log");
    };
    
... You can leave the rest of syslog-ng.conf as it is.
 
# Set up the en_GB locale and timezone

Make sure these options are set in files:

`vi /etc/locale.conf`

    LANG=en_GB.UTF-8
    LC_TIME="en_GB.UTF-8"

`vi /etc/locale.gen`

    en_US.UTF-8 UTF-8
    en_GB.UTF-8 UTF-8
    en_US ISO-8859-1
    de_DE ISO-8859-1
    de_DE@euro ISO-8859-15


Update and check the locale with the commands

    timedatectl set-timezone Europe/London
    timedatectl status
    
Congratulations, you are now in the UK, have a cup of tea.


# Set up sudoers


Set up sudoers to allow group sudo to issue commands with the USER password.

`vi /etc/sudoers`

Add a line that allows anyone in group sudo to be root:

    %sudo   ALL=(ALL) ALL
    
    
Create group sudo and add trusted user 'freddy' to sudo group:

    addgroup sudo
    usermod -a -g sudo freddy
 
