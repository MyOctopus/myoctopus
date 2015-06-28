import binascii
import time
import myoctopus.datastore.store_sqlite as store

try:
    import mraa
    DEV_PLATFORM = False
except:
    import random
    DEV_PLATFORM = True

def main():
    store.put('lux_refresh', 1000)
    while(True):
        if DEV_PLATFORM:
            store.put('lux', random.randint(0,10000))
        else:
            store.put('lux', get_reading())
        time.sleep(float(store.read('lux_refresh')) / 1000.00)

def get_reading():
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

    return 0.01*(2**(int(exp)))*int(res); #lux
