#!/bin/sh
while true;
do
    wal -i "$(find /home/inibras/Pictures/Wallpapers -type f -name '*.jpeg' -o -name '*.jpg' | shuf -n 1)"
    sleep 240s
done &