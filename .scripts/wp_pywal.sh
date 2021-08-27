#!/bin/sh

wal -i "$(find $HOME/Pictures/wp/ -type f -name '*.jpeg' -o -name '*.jpg' | shuf -n 1)" 

