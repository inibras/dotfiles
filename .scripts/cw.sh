#!/bin/bash

for file in ~/.wallpaper.jpeg; do
    mv -- "$file" "home/mustbean/Pictures/WP/$RANDOM.jpeg"
done