#!/bin/sh

icon=""
get_temp_cpu0=$(cat /sys/class/thermal/thermal_zone0/temp)
temp_cpu0=$(($get_temp_cpu0/1000))
if [ $temp_cpu0 -ge 90 ]; then
    printf "$icon $temp_cpu0°C!"
else
    printf "$icon $temp_cpu0°C"
fi
