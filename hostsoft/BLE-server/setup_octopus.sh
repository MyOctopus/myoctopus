#!/bin/sh

read -rsp $'Enabling bluetooth...\n' -n 1 -t 0;
rfkill unblock bluetooth
read -rsp $'Stopping bluetooth daemon...\n' -n 1 -t 3;
killall bluetoothd
read -rsp $'Manually starting HCI0 device...\n' -n 1 -t 3;
hciconfig hci0 up
read -rsp $'Configuring HCI0 device...\n' -n 1 -t 3;
hciconfig hci0 noscan
read -rsp $'Reading HCI0 device...\n' -n 1 -t 1;
hciconfig hci0
