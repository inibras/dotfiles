#!/bin/sh

echo "$(curl -s --max-time 1 "https://corona-stats.online/uk?source=2&minimal=true" | sed 's/\x1b\[[0-9]*m//g; s/[^0-9 ,]//g; s/  */;/g ; 2q; 1d' | awk -F ';' '{print ("cases: "$2) " | " ("deaths: "$3) " | " ("recovered: " $6)}')"
