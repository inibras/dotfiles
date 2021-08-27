#!/usr/bin/sh


selected=$( (echo . ; (find ~ \( ! -regex '.*/\..*' \)) ) | rofi -dmenu -p "Open")

if [[ "$selected" == "." ]]; 
then selected=$( find ~ \( -regex '.*/\..*' \) | rofi -dmenu -p "Open" )
fi
exo-open $selected