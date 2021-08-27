#!/bin/bash

TODAY=$(expr `date +'%d'` + 0)

(
echo "^fg(#322F3A)^fn(Inconsolata:pixelsize=14:antialias=false:hinting=True) Date"; echo
\
cal | sed -re "s/^(.*[A-Za-z][A-Za-z]*.*)$/^fg(#c9665e)^bg(#FFFFFF)\1/;s/(^|[ ])($TODAY)($|[ ])/\1^bg(#FFFF)^fg(#c9665e)\2^fg(#FFFFFF)^bg(#c9665e)\3/"
sleep 8
) | dzen2 -fg '#322F3A'  -bg '#FFFFFF' -fn 'Inconsolata:pixelsize=15:antialias=True:hinting=True' -x 870 -y 50 -w 200 -l 10 -sa c -e 'onstart=uncollapse;button1=exit;button4=exit'
