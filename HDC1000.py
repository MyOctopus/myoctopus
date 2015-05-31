#humidity & temp HDC1000
import mraa
import binascii
import time

i2C = mraa.I2c(1);
i2C.address(0x43); #hdc1000 address


i2C.write(bytearray(b'\x00')); #mark temp from register
time.sleep(0.02); #delay for get data
d = i2C.read(4);
print "HEX TEMP:%s" % binascii.hexlify(d); #print raw hex

i2C.write(bytearray(b'\x01')); #mark humidity from register    
time.sleep(0.02);
d = i2C.read(2);
print "HEX HUMIDITY:%s" % binascii.hexlify(d); #print raw hex
