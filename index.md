---
layout: page
title: Neil Hancock
tagline: We don't need no shtinking taglines!
---
{% include JB/setup %}

## Welcome

This is the Web site of Neil Hancock.

I am currently a Web Application developer in Crawley, prior to that I was a mainframe application developer mostly using Rexx and ISPF. 

## Recent Posts

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

    
## Portfolio

All of my professional work is for intranets, and I do not have copyright to rehost it. So here are a few snippets by way of a portfolio:

A simple [orbital period calculator](portfolio/deltapavonis.html).

A [pie menu](portfolio/piemenu/piemenu_click.html) in JavaScript, click to open, move mouse to select, click to activate selection.

A [pie menu](portfolio/piemenu/piemenu_move.html) in JavaScript. In this version: click, hold mouse down, drag to select, release to activate selection. (under development)

A frames based [reaction game](portfolio/reactiongame/index.html) I created years ago to test inter-frame communication.

## Curriculum Vitae

Download my full [CV in pdf format](cv/NHancock_CV.pdf).

Also avilable in [rich text](cv/NHancock_CV.rtf),  [plain text](cv/NHancock_CV.txt),  [Microsoft Word](cv/NHancock_CV.docx) and [OpenOffice](cv/NHancock_CV.odt) formats.

## Rexx

I was a Mainframe System Programmer, then an application developer using Rexx and ISPF.

Rexx is a scripting language used heavily on OS/390 Mainframes under TSO, ISPF, and sometimes batch work. It also exits in various forms on Unix, and PC.

Based on questions seen in the TSO/Rexx mailing list, I created a [FAQ for Rexx on OS/390 Mainframes](Computers/rexxfaq.html), and a [Style Guide for Rexx](Computers/RexxStyleGuide.html). I have hosted them on my website ever since.

There are also some [Rexx Examples](Computers/index.html) I collected many years ago.

The FAQ attempts to cover questions specific to Rexx on z/OS, other FAQs for other implementations of Rexx exist.


