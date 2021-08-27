#!/bin/sh

config="$(cat ~/.scripts/scripts.conf)"
ticks=0

while true
do
	i=0

	while [ $i != $(echo "$config" | wc -l) ]
	do
		line="$(echo "$config" | cut -d $'\n' -f $((i+1)))"
		delay="$(echo $line | cut -d ' ' -f 2)"

		eval var="x\${result${i}}"

		if [[ `expr $ticks % $delay` -eq 0 || "$var" = "x" ]]
		then
			file="$(echo $line | cut -d ' ' -f 1)"
			eval result${i}="\"$(sh ~/.scripts/./$file)"\"
		fi

		i=$((i+1))
	done


	output=" "
	while [ $i != -1 ]
		do
			if [ "$output" != " " ]
			then
				output="${output} | "
		fi

		eval output="\${output}\${result${i}}"
		i=$((i-1))
	done

	xsetroot -name "$output"
	sleep 1s
	ticks=$((ticks+1))
done
