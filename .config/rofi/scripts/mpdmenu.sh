#!/bin/bash

rofi_command="rofi -theme themes/mpdmenu.rasi"

### Options ###
# Gets the current status of mpd (for us to parse it later on)
status="$(mpc status)"
# Defines the Play / Pause option content
if [[ $status == *"[playing]"* ]]; then
    play_pause=""
else
    play_pause=""
fi
active=""
urgent=""
# Display if single mode is on / off
tog_single="凌"
if [[ $status == *"single: on"* ]]; then
    active="-a 4"
elif [[ $status == *"single: off"* ]]; then
    urgent="-u 4"
else
    tog_single=" Parsing error"
fi
# Display if random mode is on / off
tog_random=""
if [[ $status == *"random: on"* ]]; then
    [ -n "$active" ] && active+=",5" || active="-a 5"
elif [[ $status == *"random: off"* ]]; then
    [ -n "$urgent" ] && urgent+=",5" || urgent="-u 5"
else
    tog_random=" Parsing error"
fi
stop=""
next=""
previous=""
# Variable passed to rofi
options="$previous\n$play_pause\n$stop\n$next\n$tog_single\n$tog_random"

# Get the current playing song
current=$(mpc current)
# If mpd isn't running it will return an empty string, we don't want to display that
if [[ -z "$current" ]]; then
    current="-"
fi

# Spawn the mpd menu with the "Play / Pause" entry selected by default
chosen="$(echo -e "$options" | $rofi_command -p "$current" -dmenu $active $urgent -selected-row 1)"
case $chosen in
    $previous)
        mpc -q prev
        ;;
    $play_pause)
        mpc -q toggle
        ;;
    $stop)
        mpc -q stop
        ;;
    $next)
        mpc -q next
        ;;
    $tog_single)
        mpc -q single
        ;;
    $tog_random)
        mpc -q random
        ;;
esac

