#!/usr/bin/env bash

# Stop lirc
sudo /etc/init.d/lirc stop

echo Press button in front of the ir receiver
echo it should write something like
echo space xxxxx
echo pulse xx

mode2 -d /dev/lirc0