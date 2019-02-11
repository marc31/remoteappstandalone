#!/usr/bin/env bash

# Echo in Blue
function echoBlue () {
  echo -e "\x1B[0;34m\033[1m${1}\033[0m"
}

# Echo in Red
function echoRed () {
  echo -e "\x1B[0;31m\033[1m${1}\033[0m"
}

echoRed "For me PinIN=4 and PinOUT=26"

# Ask Pin Number
echoBlue "Pin In Number ?"
read pinIN
echoBlue "Pin OUT Number ?"
read pinOUT

# Install Lirc
echoBlue "Install Lirc"
sudo apt-get install lirc

# Load Module
# For raspberry instead use /boot/config.txt
#sudo cat >> /etc/modules <<EOF
#lirc_dev
#lirc_rpi gpio_out_pin=4 gpio_in_pin=26
#EOF

# Edit your /boot/config.txt by entering the command below
if ! grep -Fxq "dtoverlay=lirc-rpi,gpio_out_pin=$pinIN,gpio_in_pin=$pinOUT" /boot/config.txt; then
  echoBlue "Edit /boot/config.txt"
  cat >> /boot/config.txt <<EOF

dtoverlay=lirc-rpi,gpio_out_pin=$pinIN,gpio_in_pin=$pinOUT
EOF
else
  echoRed "Line already exist in /boot/config.txt"
fi

# Backup hardware.conf
echoBlue "Backup hardware.conf"
sudo cp /etc/lirc/hardware.conf /etc/lirc/hardware.bak.conf

# Add hardware
echoBlue "Create hardware.conf"
sudo cat > /etc/lirc/hardware.conf <<EOF
########################################################
# /etc/lirc/hardware.conf
#
# Arguments which will be used when launching lircd
LIRCD_ARGS="--uinput"
# Don't start lircmd even if there seems to be a good config file
# START_LIRCMD=false
# Don't start irexec, even if a good config file seems to exist.
# START_IREXEC=false
# Try to load appropriate kernel modules
LOAD_MODULES=true
# Run "lircd --driver=help" for a list of supported drivers.
DRIVER="default"
# usually /dev/lirc0 is the correct setting for systems using udev
DEVICE="/dev/lirc0"
MODULES="lirc_rpi"
# Default configuration files for your hardware if any
LIRCD_CONF=""
LIRCMD_CONF=""
########################################################
EOF

# Now use systemcl instead of init.d
echoBlue "Stop lirc.service"
sudo systemctl stop lirc.service
if $0; then
    sudo systemctl stop lircd.service
fi
echoBlue "Start lirc.service"
sudo systemctl start lirc.service
if $0; then
    sudo systemctl start lircd.service
fi
echoBlue "Status lirc.service"
sudo systemctl status lirc.service
if $0; then
    sudo systemctl status lircd.service
fi

# Launch it on startup
echoBlue "Launch it on startup"
echoBlue "o|O|y|Y ou n|N|*"
read repdrop
echo -e "\t"
case "$repdrop" in
  o|O|y|Y)
    sudo systemctl enable lirc.service
    if $0; then
        sudo systemctl enable lircd.service
    fi
  ;;
  n|N|*)
    echoBlue "If you want to add it latter just run sudo systemctl enable lirc.service"
  ;;
esac

echoRed "You need to reboot pi"
echoRed "You have to check that /etc/lirc/lircd.conf exist or dl one on http://lirc.sourceforge.net/remotes"