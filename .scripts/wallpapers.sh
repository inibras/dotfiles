#!/bin/bash

RESOLUTION="2560x1440"
URL="https://source.unsplash.com/featured/${RESOLUTION}/?cyberpunk"
WALLPAPER=/home/inibras/.wallpaper/$RANDOM.wallpaper.jpg

if test -f "$WALLPAPER"; then
    feh --bg-scale "$WALLPAPER"
fi

RES=$(curl -L "$URL" -o "$WALLPAPER")
if [ -z "$RES" ]; then
    feh --bg-scale "$WALLPAPER"
fi
