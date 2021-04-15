# High level software design notes.

## Data collection
We will collect data tuples containing following data:
timestamp (4 bytes), use (tinyint 1 byte), temperature (small int 2 bytes to allow for decimal data)

use - determines whether warm water was used since last sample

full row size: 7 bytes

sample frequency: TBD

samples per MB: (approx) 100k

storage per day: ~90kb if sample is taken every second its 1MB every 11 days, so 24MB per year

## Additional Data
- external heating devices, probably lower sample rate will be sufficient, on/off detection only
- calibration measures, historical time for achieving temp y from x (external thermistor might become handy to measure ambient room/hotpress temperature)

## Device Setup
In initial device setup user will only set desired temperature for "sink" mode.
Possible settings will use fuzzy values such as: mountain stream cold, cold, lukewarm, warm, hot, boiling.

Other optional setup would include: wifi setup, automatic updates, on-line/external control panel activation.

## Calibration
During first few days(weeks) and on ongoing basis thermostat will also calibrate itself.
Calibration will cover following:
 - how long will it take to heat water from temperature x to temperature y
 - (ver 2) what pwm settings will be most efficient to heat the water
 - determine and detect external heating devices (such as gas boiler during heating period)
 - determine high water usage, with no bath indication (for ui graph only probably)

## Bath Mode
User will be able either through mobile or through touch button, switch on Bath mode.
In Bath mode water will heat to highest achievable temperature and will keep the heaters on until bath is filled (through use sensor). Other samples will be gathered normally.

## Away mode
If water is not used for a longer period of time (TODO: define "longer period of time") device will go into Away mode. In this mode data samples will be discarded/marked since they should not be used in probability calculation. 
It will be possible to trigger Away mode through mobile.

## Normal "Sink" Operation
In version 1 device will determine probability of water need in the future. 
Future distance will be determined on the basis of Calibration process and it will be equal to the value of how much time will it take to achive desired (user configured) temperature.
Example: if current water temperature is 10C and desired temperature is 30C, let's say it takes 20 minutes to achive 30 from 10, then we would need to calculate how probable is that the water will be used in next 20 minutes.
Probability calculation will be based on following historical data points clustered by following:
 - day of week
 - hour of day
 - part of day (morning, afternoon, night...)
 - time since last use
 - and various combinations of above, such as DoW and hour, DoW and part of day
 - more TBD
this way we can calculate probability based on binary data, which simplifies and abstracts away the actual sensor types - we can just add other sensors in future w/o changing this logics.

*We need to establish following maths:
 - Sensor/cluster correlation/meaningfulness factor in order to determine the weight of it - since we operate on binary data this should be achievable by calculating the % of repeatable readings in comparison to other sample repeatability, taking all possible points into equation.
 - Actual probability calculation equation would be then weighted accordingly and combined.

TODO: Manufacture example.

## Potential issues
Is it possible to heat whole boiler of water to low temperature given that hot water goes to the top of it - but i think using PWM or on/off/wait method it is achievable, it might be slow process thou.
