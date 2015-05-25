  import mraa
  i2C = mraa.I2c(1); #i2c bus choice
  i2C.address(0x28); #NFC address 0x28 on i2c

  i2C.write(bytearray(b'\xFF\xFE\x02\x00')); #16bit register address FFFE and put values 0x02, 0x01 (turn on NFC module)
  d = i2C.read(200); #read memory started from 0x0000 follow by 0x00
  print d;
