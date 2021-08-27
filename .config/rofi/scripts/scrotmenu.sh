#!/bin/bash

rofi_command="rofi -theme themes/scrotmenu.rasi"

### Options ###
screen=""
area=""
window=""
# Variable passed to rofi
options="$screen\n$area\n$window"

chosen="$(echo -e "$options" | $rofi_command -dmenu -selected-row 1)"
case $chosen in
    $screen)
        sleep 1s ; scrot -e 'mv $f ~/Pictures/'
        ;;
    $area)
        scrot -s -e 'mv $f ~/Pictures/'
        ;;
    $window)
        sleep 1s ; scrot -u -e 'mv $f ~/Pictures/'
        ;;
esac

