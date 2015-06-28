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
    store.put('temp_refresh', 1000)
    while(True):
        if DEV_PLATFORM:
            store.put('temp', random.randint(0,40))
            store.put('humidity', random.randint(0,100))
        else:
            temp, hum = get_reading()
            store.put('temp', temp)
            store.put('humidity', hum)
        time.sleep(float(store.read('temp_refresh')) / 1000.00)

def get_reading():
    i2C = mraa.I2c(1)
    i2C.address(0x43) #hdc1000 address

    i2C.write(bytearray(b'\x02\x30\00')) #write config
    #0x02 - config adr
    #0x30 - Heater on, Mode of acquisition on, temperature 14bit, humudity 14bit
    #see register and memory map on HDC1000.pdf

    i2C.write(bytearray(b'\x02')) #read config
    d = i2C.read(2)
    #print "CONFIG:%s" % binascii.hexlify(d);

    i2C.write(bytearray(b'\x00')) #temperature adr from register
    time.sleep(0.015) #delay for get data
    d = i2C.read(2)
    temp = int(binascii.hexlify(d),16)/65536.0*165.0-40.0

    i2C.write(bytearray(b'\x01')) #humidity adr from register
    time.sleep(0.015)
    d = i2C.read(2)
    hum = int(binascii.hexlify(d),16)/65536.0*100.0
    #print "HEX HUMIDITY: %s" % binascii.hexlify(d); #print raw hex

    return (temp, hum)
