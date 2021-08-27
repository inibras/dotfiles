#!/bin/sh

state=$(cat /sys/devices/platform/smapi/BAT1/state)
if [ $state = "charging" ]; then
    echo " " # charging
elif [ $state = "discharging" ]; then
    echo " " # discharging
elif [ $state = "idle" ]; then
    echo " " # idle
else
    echo " " # unknown
fi
