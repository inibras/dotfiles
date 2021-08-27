#!/bin/sh
while true;
do
    wal -i "$(find ~/Pictures/wp/ -type f -name '*.jpg' -o -name '*.png' | shuf -n 1)"
    sleep 900s
done &
