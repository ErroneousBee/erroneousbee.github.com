---
layout: post
title: "Installing and Setting up Arch Linux on a Tonido2plug"
tagline: 
description: "First steps in setting up a tonido2plug"
category: tonido2plug
tags: [tonido2plug,arch]
---
{% include JB/setup %}

# The Hardware

* Tonido2plug.
* Seagate Momentud SDD/HDD Hybrid 500Gb.
* USB stick 1GB will be enough, I used a 16Gb stick for overkill.
* Ethernet connection to Ye Bigge Olde Internet.

# Installing Arch Installer on a USB stick.
We will be installing by creating a bootable USB stick with Arch Arm on it, and then booting the tonido2plug from the USB stick, then installing Arch onto the SDD.

From your Linux desktop, install Arch on a USB stick. I use Kubuntu, but anything will work.

Its pretty straightforward:
1. (un)partition the USB drive
1. reformat it as a Ext2 filesystem
1. mount it
1. copy the installer files onto it
1  and unpack them.

Get the latest [Arch Arm install](http://archlinuxarm.org/os/ArchLinuxARM-armv5te-latest.tar.gz).
Read the [Arch instuctions for USB creation](http://archlinuxarm.org/support/reinstallation).

To find where your USB stick will be mounted from, run `dmesg` and look for lines similar to:

    [20868.977072] sd 16:0:0:0: [sdd] Attached SCSI removable disk
    
My USB stick appeared as /dev/sdd.

Plug your USB drive into your desktop, open a terminal. `dmesg` will show the latest USB drive inserted, my USB stick appeared as /dev/sdd.

Use parted to undo any previous adventures on the USB drive, just delete any existing partitions, add a new single partition. Make the Partition Table be __msdos__ as the tonido firmware does not understand GPT.

    root@desktop:/home/beel# parted /dev/sdd
    GNU Parted 2.3
    Using /dev/sdd
    Welcome to GNU Parted! Type 'help' to view a list of commands.
    (parted) print
    Model: Corsair Voyager Mini (scsi)
    Disk /dev/sdd: 16.2GB
    Sector size (logical/physical): 512B/512B
    Partition Table: msdos
    Number  Start   End     Size    Type     File system  Flags
    1      1049kB  16.2GB  16.2GB  primary  ext2         boot


Create the filesystem on it with mkfs.

    mkfs -t ext2 /dev/sdd1


Now just mount the USB drive, and unpack the arch system onto it:

    mkdir /mnt/tmp
    mount /dev/sdd1 /mnt/tmp
    cd /mnt/tmp
    wget http://archlinuxarm.org/os/ArchLinuxARM-armv5te-latest.tar.gz
    tar -xvzf ArchLinuxARM-armv5te-latest.tar.gz
    rm ArchLinuxARM-armv5te-latest.tar.gz
    sync


And that is it, you now have a USB stick that will boot when used on your tonido2plug (and most other ARM v5 plugs too).

# Installing Arch on the Tonido2plug.

Summary:
1. Remove SSD/HDD
1. plug in USB
1. boot from USB
1. Insert SSD/HDD
1. ssh into tonido2plug
1. do much the same as for setting up the USB stick.

Get the hardware prepared.

* Connect the ethernet to your router (we will be connecting with ssh from the desktop).
* Remove the SSD/HDD if you have inserted it.
* Plug the USB stick in.
* Power it up. Blue lights start flashing.
* Go make a cup of tea.

When it is finished booting off of the USB stick, the blue light will flash red, then go solid blue.

From your desktop, ssh into the tonido2plug. The Arch you installed on the USB should try dhcp to get an IP address, so have a guess at 192.168.2.1, or ask your router what is connected to it.

    bee@desktop$  ssh root@192.168.2.1

Now insert the SSD (we do this now so the plug doesnt try and boot off of it).

`dmesg` will show the device file the SSD is on /dev/sdb.

Use parted to create filesystems. It doesn't necessarily come with the Arch system you unpacked onto the USB drive. Use pacman to install any tools you need.

    root@tonido# pacman -Syu parted

Use parted to partition your drive. Tonido2plug will always try to boot from the first sector "/dev/sda1", so make sure that the boot partition is the first one. I went with a simple split, 20Gb for the fist partition "/", everything else  in what will be "/home". The partition table MUST be msdos, the tonido2plug firmware doesnt understand the GID table format.

    [root@tonido bee]# parted /dev/sdb
    GNU Parted 3.1
    Using /dev/sdb
    Welcome to GNU Parted! Type 'help' to view a list of commands.
    (parted) print
    Model: ATA ST95005620AS (scsi)
    Disk /dev/sdb: 500GB
    Sector size (logical/physical): 512B/512B
    Partition Table: msdos
    Disk Flags:

    Number  Start   End     Size    Type    File system  Flags
    1      1049kB  21.5GB  21.5GB  primary  ext3
    2      21.5GB  500GB   479GB   primary  ext3

And unpack the Arch OS much as we did to create the bootable USB stick:

    mkdir /mnt/tmp
    mount /dev/sdb1 /mnt/tmp
    cd /mnt/tmp
    wget http://archlinuxarm.org/os/ArchLinuxARM-armv5te-latest.tar.gz
    tar -xvzf ArchLinuxARM-armv5te-latest.tar.gz
    rm -rf *.tar.gz

Shut down the tonido2plug `shutdown -h now`. Remove USB, cycle the power, the blue flashing light is just the plug thinking its a Tardis.

ssh into the system. You may have to get clever to find the network address again, try `ssh root@192.168.2.1`.

You should now be logged into the tonido2plug running Arch Linux. Congratulations! 
