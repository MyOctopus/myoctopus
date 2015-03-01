import datetime
import os
import time
import pprint

sensors = [id for id in os.listdir('/sys/bus/w1/devices/') if id.startswith('28-')]

def get_temps(sensors):
    out = []
    for s in sensors:
        tf = open('/sys/bus/w1/devices/%s/w1_slave' % (s,))
        txt = tf.read()
        tf.close()
        data = int(txt.split('\n')[1].split('t=')[-1])
        out = out + [(datetime.datetime.now(), s, data)]  
    return out

while(True):
    temps = get_temps(sensors)
    print [t[-1] for t in temps]
    with open(str(datetime.date.today()) + '.txt', "a") as fl:
        fl.write(str(temps))
    time.sleep(1)


