#human eye sensor (lux) opt3001
import mraa
import binascii
import time

i2C = mraa.I2c(1);
i2C.address(0x45); 


i2C.write(bytearray(b'\x01\xc4\x10')); #write config
#0x01 - config adr
#0xc4 - full scale, 100ms conv. time, contiue measuring 
#0x10 - latch 

i2C.write(bytearray(b'\x00')); #light value register 
d = i2C.read(2);
print "RAW LUX %s" % binascii.hexlify(d); #print raw hex
