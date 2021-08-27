#!/bin/sh
while true;
do
    wal -i "$(find $HOME/Pictures/wp/ -type f -name '*.jpeg' -o -name '*.jpg' | shuf -n 1)"
    sleep 900s
done &