---
layout: post
title: "TiddyWiki: Mobile Stylesheet"
description: ""
category: 
tags: [tiddlywiki, CSS, mobile]
---
{% include JB/setup %}

To improve a tiddlywiki when using it on an android device, edit the *StyleSheet* tiddler, and add the following: 

    @media screen and (max-width: 480px){
    
        #sidebar { display:block; position: relative; width: 100%; padding: 0 1em; margin: 0;}
        #sidebarTabs { display: none; }
        #sidebarSearch { right: 8px;margin: 1em 2 0 0; }
        #sidebarOptions { display: block; width: 100%; text-align: left; }
        #sidebarOptions a { display: inline; margin: 1em 0 0 0; }
        
        #mainMenu { display: block; position: relative; width: 100%; text-align: left; background-color: lightgrey; padding: 0 1em; margin: 0;}
        #mainMenu br { display: none; }
        #mainMenu a { margin-right: 2em; }
        
        #displayArea { margin: 1em 0 0 0; }
    }
    
This should move the left and right bars to the top of the page, and collapse down as much as possible. Whitespace wrapping in the mainMenu can be a little off, but its better than nothing.

You can also add a standard meta element to the head by adding:

    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=no; target-densityDpi=device-dpi" />
    
to the MarkdownPreHead tiddler.
