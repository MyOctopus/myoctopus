from flask import Flask, request, jsonify
import mraa
import binascii
import time
import datetime

app = Flask(__name__)
i2C = mraa.I2c(1);
store = {}

@app.route("/test")
def index():
	return "Edison OK " + datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

@app.route("/data/<key>", methods=['GET', 'PUT'])
def get_data(key):
	if key == 'sensors':
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
		val_light = 0.01*(2**(int(exp)))*int(res); #lux

		i2C.address(0x43); #hdc1000 address
		i2C.write(bytearray(b'\x02\x30\00')); #write config
		#0x02 - config adr
		#0x30 - Heater on, Mode of acquisition on, temperature 14bit, humudity 14bit
		#see register and memory map on HDC1000.pdf

		i2C.write(bytearray(b'\x02')); #read config
		d = i2C.read(2);
		x = binascii.hexlify(d);

		i2C.write(bytearray(b'\x00')); #temperature adr from register
		time.sleep(0.015); #delay for get data
		d = i2C.read(2);
		temp = int(binascii.hexlify(d),16)/65536.0*165.0-40.0;
		x = binascii.hexlify(d); #print raw hex
		print "TEMPERATURE(-40:+125): %iC" % temp;


		i2C.write(bytearray(b'\x01')); #humidity adr from register    
		time.sleep(0.015);
		d = i2C.read(2);
		hum = int(binascii.hexlify(d),16)/65536.0*100.0;
		#print "HEX HUMIDITY: %s" % binascii.hexlify(d); #print raw hex
		print "HUMIDITY(0-100%%): %i %%rH" % hum;

		return jsonify(
			timestamp=datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
			sensors=[
				dict(id=1, name="Light", unit="Lux", min=0, max=100),
				dict(id=2, name="Temperature", unit="C", min=-10, max=50),
				dict(id=3, name="Humidity", unit="%H", min=0, max=100)
			],
			data=[
				dict(sensor_id=1, value=val_light),
				dict(sensor_id=2, value=temp),
				dict(sensor_id=3, value=hum)
			]
		)
	else:
		if request.method == "GET":
			return store.get(key, '')
		else:
			store[key] = request.data
			return 'OK'

app.debug = True
app.run(host="0.0.0.0", port=8081)