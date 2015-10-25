#!/usr/bin/python

#from ops_i2cbase import I2CBase

import binascii
import time
import myoctopus.datastore.store_redis as store

try:
    import mraa
    DEV_PLATFORM = False
except:
    import random
    DEV_PLATFORM = True


# ===========================================================================
# TMP007 Class
# TMP007 Infrared Thermopile Sensor
# Ported from github.com/adafruit/Adafruit_TMP007_Library/
# ===========================================================================

class TMP007:
	i2c = None

	# TMP007 Address
	address = 0x45

	# Commands
	TMP007_VOBJ         = 0x00
	TMP007_TDIE         = 0x01
	TMP007_CONFIG       = 0x02
	TMP007_TOBJ         = 0x03
	TMP007_STATUS       = 0x04
	TMP007_STATMASK     = 0x05

	TMP007_CFG_RESET    = 0x8000
	TMP007_CFG_MODEON   = 0x1000
	TMP007_CFG_1SAMPLE  = 0x0000
	TMP007_CFG_2SAMPLE  = 0x0200
	TMP007_CFG_4SAMPLE  = 0x0400
	TMP007_CFG_8SAMPLE  = 0x0600
	TMP007_CFG_16SAMPLE = 0x0800
	TMP007_CFG_ALERTEN  = 0x0100
	TMP007_CFG_ALERTF   = 0x0080
	TMP007_CFG_TRANSC   = 0x0040

	TMP007_STAT_ALERTEN = 0x8000
	TMP007_STAT_CRTEN   = 0x4000

	TMP007_I2CADDR      = 0x40
	TMP007_DEVID        = 0x1F


	def reverseByteOrder(self, data):
		"Reverses the byte order of an int (16-bit) or long (32-bit) value"
		if data is None:
			print "ERROR: Invlid data"
			return 0
		# Courtesy Vishal Sapre
		byteCount = len(hex(data)[2:].replace('L','')[::2])
		val = 0
		for i in range(byteCount):
			val    = (val << 8) | (data & 0xff)
			data >>= 8
		return val


	# Constructor
	def __init__(self):

		# I2C
		self.i2c = mraa.I2c(1)
		self.i2c.address(self.address)

		config = self.TMP007_CFG_MODEON | self.TMP007_CFG_ALERTEN | self.TMP007_CFG_TRANSC | self.TMP007_CFG_1SAMPLE
		config = self.reverseByteOrder(config)
		self.i2c.writeWordReg(self.TMP007_CONFIG, config)

		statmask = self.TMP007_STAT_ALERTEN | self.TMP007_STAT_CRTEN
		statmask = self.reverseByteOrder(statmask)
		self.i2c.writeWordReg(self.TMP007_STATMASK, statmask)

		id = self.i2c.readWordReg(self.TMP007_DEVID)
		if (id != 0x7800):
			print "TMP007 is not found"

	def readObjTemp(self):
		"Read object temperature data from sensor"

		rawData = self.i2c.readWordReg(self.TMP007_TOBJ)
		rawData = self.reverseByteOrder(rawData)

		if ( rawData & 0x1 ):
			return 0

		# Celsium
		objTemp = float(rawData >> 2) * 0.03125

		return objTemp

	def readDieTemp(self):
		"Read die temperature data from sensor"

		rawData = self.i2c.readWordReg(self.TMP007_TDIE)
		rawData = self.reverseByteOrder(rawData)

		if ( rawData & 0x1 ):
			return 0

		# Celsium
		objTemp = float(rawData >> 2) * 0.03125

		return objTemp

	def readSensorVoltage(self):
		"Read IR sensor voltage data from sensor"

		rawData = self.i2c.readWordReg(self.TMP007_VOBJ)
		rawData = self.reverseByteOrder(rawData)

		# IR Voltage in uV
		irVoltage = float(rawData) * 156.25 / 1000000

		return irVoltage

def main():
    store.put('irtemp_refresh', 300)
    while(True):
        if DEV_PLATFORM:
            store.put('irtemp', random.randint(0,40))
            store.put('irtemp_die', random.randint(0,100))
            store.put('irtemp_voltage', random.randint(0,10))
        else:
            temp, temp_die, voltage = get_reading()
            if not (temp, temp_die, voltage): continue
            store.put('irtemp', temp)
            store.put('irtemp_die', temp_die)
            store.put('irtemp_voltage', voltage)
        time.sleep(float(store.read('irtemp_refresh')) / 1000.00)

tmp = TMP007()

def get_reading():
    objTemp = tmp.readObjTemp()
    dieTemp = tmp.readDieTemp()
    irVoltage = tmp.readSensorVoltage()
    return (objTemp, dieTemp, irVoltage)
