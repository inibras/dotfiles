#!/usr/bin/env bash
source $HOME/.owl4ce_var

rofi_command="rofi -theme themes/sidebar/five-$CHK_ROFI_MOD.rasi"

# Options
shutdown=""
reboot=""
lock=""
suspend=""
logout=""

# Variable passed to rofi
options="$shutdown\n$reboot\n$lock\n$suspend\n$logout"

chosen="$(echo -e "$options" | $rofi_command -dmenu -selected-row 2)"
case $chosen in
    $shutdown)  $ROFI_DIR/scripts/promptmenu.sh --yes-command "poweroff" --query "     Poweroff?"
    ;;
    $reboot)    $ROFI_DIR/scripts/promptmenu.sh --yes-command "reboot" --query "      Reboot?"
    ;;
    $lock)      $DEFAPPS_EXEC lockscreen
    ;;
    $suspend)   [[ "$($MUSIC_CONTROLLER status)" = *"laying"* ]] && $MUSIC_CONTROLLER toggle || :
                if type -p "systemctl" &> /dev/null; then
                    systemctl suspend
                elif type -p "loginctl" &> /dev/null; then
                    loginctl suspend
                fi
    ;;
    $logout)    $ROFI_DIR/scripts/promptmenu.sh --yes-command "pkill -KILL -u $(whoami)" --query "      Logout?"
    ;;
esac
