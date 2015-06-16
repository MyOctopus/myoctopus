#human eye sensor (lux) opt3001
import mraa
import binascii
import time

i2C = mraa.I2c(1);
i2C.address(0x45); 


i2C.write(bytearray(b'\x01\xc4\x10')); #write config
#0x01 - config adr
#0xc4 - full scale, 100ms conv. time, contiue mesuring 
#0x10 - latch 
i2C.write(bytearray(b'\x00')); #read light value 16bit
d = i2C.read(2);
lraw = int(binascii.hexlify(d),16);

res = lraw & 0x0FFF; #extracted fractional result mantissa 11:0 
exp = (lraw>>12) & 0x000F; #extracted exponent 3:0 

print 0.01*(2**(int(exp)))*int(res); #lux
