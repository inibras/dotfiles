#!/bin/bash

#RESOLUTION="2560x1440"
RESOLUTION="1600x900"
URL="https://source.unsplash.com/1600x900/?oldschool"
WALLPAPER=~/Pictures/dl_wp/$(date +WP-%Y%m%d-%H%M%S.jpg)

if test -f "$WALLPAPER"; then
    feh --bg-scale "$(find ~/Pictures/dl_wp/ -type f -name '*.jpeg' -o -name '*.jpg' | shuf -n 1)"
    #sleep 240s
fi

RES=$(curl -L "$URL" -o "$WALLPAPER")
if [ -z "$RES" ]; then
    sleep 0.5s && notify-send -i ~/.scripts/AI.png "Download Wallpaper Complete and saved in /.wallpaper"
fi