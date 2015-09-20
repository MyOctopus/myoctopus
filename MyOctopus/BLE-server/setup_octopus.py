import imp
import sys
import time
import os

def checkNetwork():
    i = 60
    while True:
        time.sleep(1)
        address = os.popen("ifconfig | grep -A1 'wlan0' | grep 'inet'| awk -F' ' '{ print $2 }' | awk -F':' '{ print $2 }'").read().rstrip()
        if not address == "": return 0
        if i == 0: return -1
        i -= 1

edi_name = edi_ssid = edi_wpwd = ''
if len(sys.argv) > 1: edi_name = sys.argv[1]
if len(sys.argv) > 2: edi_rpwd = sys.argv[2]
if len(sys.argv) > 3: edi_ssid = sys.argv[3]
if len(sys.argv) > 4: edi_wpwd = sys.argv[4]

edi_cfg = imp.load_source('configure_edison', '/usr/bin/configure_edison')

# change the name if requested
if edi_name:
    edi_cfg.changeName(edi_name)

if edi_rpwd:
    if len(edi_rpwd) < 8 or len(edi_rpwd) > 63:
        sys.exit(1) # wrong device password length
    else:
        edi_cfg.changePassword(edi_rpwd)
if not edi_ssid:
    sys.exit(0)

# set up wifi
#   1. scan networks to get the network map
(ssid_keys, network_map) = edi_cfg.scanForNetworks()

# make sure we have the same casing in edi_ssid and in the data from the scan
try:
    index = [k.lower() for k in ssid_keys].index(edi_ssid.lower())
    edi_ssid = ssid_keys[index]
except ValueError:
    sys.exit(2)     # ssid not in the list

# check the password length for different options
if network_map[edi_ssid] == 'WEP' and len(edi_wpwd) != 5 and len(edi_wpwd) != 13:
    sys.exit(3)     # wrong wifi password length

if network_map[edi_ssid] == 'WPA-PSK' and len(edi_wpwd) < 8 or len(edi_wpwd) > 63:
    sys.exit(3)     # wrong wifi password length

# divert the getNetworkPassword method to return the edi_wpwd value
edi_cfg.getNetworkPassword = lambda: edi_wpwd
edi_cfg.getNetworkIdentity = lambda: ''     # TODO: option for network username (for WPA-EAP)
choice = network_map.keys().index(edi_ssid) + 3 # the configNetwork() method internally substracts 3 from the index

# configure the network
network_conf = edi_cfg.configureNetwork(choice, ssid_keys, network_map)
edi_cfg.setNetwork(network_conf, edi_ssid)

# check the network settings
if -1 == checkNetwork():
    sys.exit(4)     # network check error

sys.exit(0)         # all OK
