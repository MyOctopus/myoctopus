#humidity & temp HDC1000
import mraa
import binascii
import time

i2C = mraa.I2c(1);
i2C.address(0x43); #hdc1000 address

i2C.write(bytearray(b'\x02\x30\00')); #write config
#0x02 - config adr
#0x30 - Heater on, Mode of acquisition on, temperature 14bit, humudity 14bit
#see register and memory map on HDC1000.pdf

i2C.write(bytearray(b'\x02')); #read config
d = i2C.read(2);
print "CONFIG:%s" % binascii.hexlify(d);

i2C.write(bytearray(b'\x00')); #temperature adr from register
time.sleep(0.015); #delay for get data
d = i2C.read(2);
temp = int(binascii.hexlify(d),16)/65536.0*165.0-40.0;
#print "HEX TEMP:%s" % binascii.hexlify(d); #print raw hex
print "TEMPERATURE(-40:+125): %iC" % temp;


i2C.write(bytearray(b'\x01')); #humidity adr from register    
time.sleep(0.015);
d = i2C.read(2);
hum = int(binascii.hexlify(d),16)/65536.0*100.0;
#print "HEX HUMIDITY: %s" % binascii.hexlify(d); #print raw hex
print "HUMIDITY(0-100%%): %i %%rH" % hum;



