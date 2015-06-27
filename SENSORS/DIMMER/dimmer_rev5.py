from time import sleep
import serial
import mraa
import curses

x = mraa.Uart(0) #ini uart port
ser = serial.Serial('/dev/ttyMFD1', 115200)
ser.write(b'\x21\x12') #write hex value to uC
sleep(.1) #wait to apply
ser.write('\r') #gets() waiting for CR
print ser.readline() #read from uC 'echo'
