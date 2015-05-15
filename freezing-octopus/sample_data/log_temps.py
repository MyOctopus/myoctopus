import datetime
import os
import time
import pprint

BUS_DIR = '/sys/bus/w1/devices'
sensors = [id for id in os.listdir(BUS_DIR) if id.startswith('28-')]

def get_temps(sensors):
    out = []
    for s in sensors:
        tf = open('%s/%s/w1_slave' % (BUS_DIR,s))
        txt = tf.read()
        tf.close()
        data = int(txt.split('\n')[1].split('t=')[-1])
        out = out + [(datetime.datetime.now(), s, data)]  
    return out

while(True):
    temps = get_temps(sensors)
    print [t[-1] for t in temps]
    with open(str(datetime.date.today()) + '.txt', "a") as fl:
        fl.write(str(temps) + '\n')
    time.sleep(1)


