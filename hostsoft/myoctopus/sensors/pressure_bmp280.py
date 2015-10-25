#!/usr/bin/python
import binascii
import time, math, struct
import myoctopus.datastore.store_redis as store


try:
	import mraa
	DEV_PLATFORM = False
except:
	import random
	DEV_PLATFORM = True

class BMP280:
	i2c = None
	address = 0x77
	BMP280_REGISTER_CHIPID = 0xD0
	BMP280_REGISTER_VERSION = 0xD1
	BMP280_REGISTER_SOFTRESET = 0xE0
	BMP280_REGISTER_CAL26 = 0xE1
	BMP280_REGISTER_CONTROL = 0xF4
	BMP280_REGISTER_CONFIG = 0xF5
	BMP280_REGISTER_PRESSUREDATA = 0xF7
	BMP280_REGISTER_TEMPDATA = 0xFA

	def __init__(self):
		self.i2c = mraa.I2c(1)
		self.i2c.address(self.address)
		id = self.i2c.readReg(self.BMP280_REGISTER_CHIPID)
		if id != 0x58:
			print "WARNING!!!! INCOMPATBLE CHIPID!"
		self.i2c.writeReg(self.BMP280_REGISTER_CONTROL, 0x3F)
		time.sleep(1)
		self.dig_T1 = self.readU16(0x88)
		self.dig_T2 = self.readS16(0x8A)
		self.dig_T3 = self.readS16(0x8C)
		self.dig_P1 = self.readU16(0x8E)
		self.dig_P2 = self.readS16(0x90)
		self.dig_P3 = self.readS16(0x92)
		self.dig_P4 = self.readS16(0x94)
		self.dig_P5 = self.readS16(0x96)
		self.dig_P6 = self.readS16(0x98)
		self.dig_P7 = self.readS16(0x9A)
		self.dig_P8 = self.readS16(0x9C)
		self.dig_P9 = self.readS16(0x9E)

	def readU8(self, reg):
		result = self.i2c.readReg(reg)
		return result

	def readS16(self, reg):
		lo = self.readU8(reg)
		hi = self.readU8(reg+1)
		a = (hi << 8) + lo
		return struct.unpack('h', struct.pack('H', a))[0]

	def readU16(self, reg):
		lo = self.readU8(reg)
		hi = self.readU8(reg+1)
		return (hi << 8) + lo


	def readTemperatureData(self):
		v1 = self.i2c.readReg(self.BMP280_REGISTER_TEMPDATA)
		v2 = self.i2c.readReg(self.BMP280_REGISTER_TEMPDATA+1)
		v3 = self.i2c.readReg(self.BMP280_REGISTER_TEMPDATA+2)
		adc_T = ((v1 << 16) | (v2<< 8) | v1) >> 4 #+ v3
		dig_T1, dig_T2, dig_T3 = self.dig_T1, self.dig_T2, self.dig_T3
		var1 = ((((adc_T>>3) - (dig_T1<<1))) * (dig_T2)) >> 11;
		var2 = (((((adc_T>>4) - (dig_T1)) * ((adc_T>>4) - (dig_T1))) >> 12) *(dig_T3)) >> 14;
		t_f = var1 + var2
		T = (t_f * 5 + 128) >> 8;
		return (T/100.00, t_f)

	def readPressureData(self, t_fine):
		v1 = self.i2c.readReg(self.BMP280_REGISTER_PRESSUREDATA)
		v2 = self.i2c.readReg(self.BMP280_REGISTER_PRESSUREDATA+1)
		v3 = self.i2c.readReg(self.BMP280_REGISTER_PRESSUREDATA+2)
		adc_P = ((v1 << 16) | (v2<< 8) | v1) >> 4 #+ v3
		var1 = (t_fine/2.0) - 64000.0;
		var2 = var1 * (var1 * (self.dig_P6)/32768.0);	#not overflow
		var2 = var2 + (var1 * (self.dig_P5)*2.0);	#overflow
		var2 = (var2/4.0)+((self.dig_P4)*65536.0);
		var1 = ((self.dig_P3) * var1 * var1/524288.0 + (self.dig_P2) * var1) / 524288.0;
		t_var = (32768.0 + var1)/32768.0;
		tt_var = t_var * self.dig_P1;
		var1 = ((32768.0 + var1)/32768.0)*(self.dig_P1);
		p = 1048576.0- adc_P;
		p = (p-(var2/4096.0))*6250.0/var1 ;	#overflow
		var1 = (self.dig_P9)*p*p/2147483648.0;	#overflow
		var2 = p*(self.dig_P8)/32768.0;
		p = p + (var1+var2+(self.dig_P7))/16.0;
		actualPressure = p/100.0 ;
		return actualPressure

	def readAltitude(self, pressure, baseline=1013.2):
		return( 44330.0 * ( 1 - pow( pressure / baseline, 1 / 5.255 ) ) )

def main():
	store.put('pressure_refresh', 500)
	while(True):
		if DEV_PLATFORM:
			store.put('pressure_temp', random.randint(0,100))
			store.put('pressure', random.randint(0,1000))
		else:
			temp, pressure = get_reading()
			store.put('pressure_temp', temp)
			store.put('pressure', pressure)
		time.sleep(float(store.read('pressure_refresh')) / 1000.00)

bmp = BMP280()

def get_reading():
	temp, temp_fine = bmp.readTemperatureData()
	pre = bmp.readPressureData(temp_fine)
	return temp, pre
