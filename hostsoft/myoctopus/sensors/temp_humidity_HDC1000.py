import binascii
import time
import myoctopus.datastore.store_redis as store


try:
    import mraa
    DEV_PLATFORM = False
except:
    import random
    DEV_PLATFORM = True


class HDC1000(object):

    i2C = None

    def __init__(self):
        self.i2C = mraa.I2c(1)
        self.i2C.address(0x43) #hdc1000 address

        self.i2C.write(bytearray(b'\x02\x30\00')) #write config
        #0x02 - config adr
        #0x30 - Heater on, Mode of acquisition on, temperature 14bit, humudity 14bit
        #see register and memory map on HDC1000.pdf

        self.i2C.write(bytearray(b'\x02')) #read config
        d = self.i2C.read(2)
        #print "CONFIG:%s" % binascii.hexlify(d);

    def getTemp(self):
        self.i2C.write(bytearray(b'\x00')) #temperature adr from register
        time.sleep(0.015) #delay for get data
        d = self.i2C.read(2)
        if not d: return 0
        temp = int(binascii.hexlify(d),16)/65536.0*165.0-40.0
        return temp

    def getHum(self):
        self.i2C.write(bytearray(b'\x01')) #humidity adr from register
        time.sleep(0.015)
        d = self.i2C.read(2)
        if not d: return 0
        hum = int(binascii.hexlify(d),16)/65536.0*100.0
        #print "HEX HUMIDITY: %s" % binascii.hexlify(d); #print raw hex
        return hum


def main():
    store.put('temp_refresh', 500)
    while(True):
        if DEV_PLATFORM:
            store.put('temp', random.randint(0,40))
            store.put('humidity', random.randint(0,100))
        else:
            temp, hum = get_reading()
            store.put('temp', temp)
            store.put('humidity', hum)
        time.sleep(float(store.read('temp_refresh')) / 1000.00)

hdc1000 = HDC1000()

def get_reading():
    return (hdc1000.getTemp(), hdc1000.getHum())
