#!/bin/bash

RESOLUTION="2560x1440"
URL="https://source.unsplash.com/featured/${RESOLUTION}/?cyberpunk"
WALLPAPER=~/Pictures/dl_wp/$(date +WP-%Y%m%d-%H%M%S.jpg)

if test -f "$WALLPAPER"; then
    wal -i "$(find ~/Pictures/dl_wp/ -type f -name '*.jpeg' -o -name '*.jpg' | shuf -n 1)"
    #sleep 900s
fi

RES=$(curl -L "$URL" -o "$WALLPAPER")
if [ -z "$RES" ]; then
    sleep 0.5s && notify-send -i ~/.scripts/AI.png "Download Wallpaper Complete"
fi
