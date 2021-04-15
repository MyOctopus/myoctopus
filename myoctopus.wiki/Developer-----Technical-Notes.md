 
***


##Developer / Technical Notes 

<img src="http://4.bp.blogspot.com/-7fqLH4KRemk/VaDQPEalsoI/AAAAAAAAAIw/6yRAhHkeEkw/s1600/myOctupus002-08logoonly.png">  

---  
 
  
###Hardware:  
  
  Each device in the system is a fully fledged Linux OS running on an Intel Edison platform, using the small dev breakout.  But, given the open nature of the project, we do not plan to prevent developers from running the node software on any other hardware that is capable of such – and I’d guess anything with Python support will be able to run it.  
  

####With each *MyOctopus* device the following components will be available:

    *  On/Off switch  
    *  Dimmer switch (for light and servo control)  
    *  4 IR Surface temperature sensors  
    *  4 Light Sensors  
    *  Ambient temperature sensors  
    *  Humidity Sensors  
    *  Barometer  
    *  Accelerometer  
    *  Air Quality sensor (including Smoke and CO sensor)  
    *  2 Microphones (L/R)  
    *  Directional Motion Detection (based on data from Light and IR Sensors)  
  
  

In addition to the above, **add-on hardware extensions** will be available that can be attached to the switch through an expansion port – such as a temperature sensor tape for immersion tanks (adhesive tape that is attached to the tank) or temperature/humidity/barometer/light sensors that can be put outside to read external weather conditions.  
  
---  
  

###Software:  

Applications can be developed in a language of your choice – initially we will support Python and JavaScript, 
but I can see no reason why we wouldn’t add support further down the line for Java, .NET, PHP or any other languages – whatever you can get to run on Edison.  
  
---  
  
###High Level Platform Overview  
 
  
![](http://i.imgur.com/pjcOEA0.png)  
  
  
  
---
  
  
###A few main points on the implementation below:  
  
  
-  Each device in the system will become a Node in the grid once configured with the current infrastructure 
during the set-up.  

-  Nodes will organize themselves into a \ DHT (Distributed Hash Table) that will provide the underlying 
foundation for the Key/Value Data Store, as well as an Execution Platform.  

-  API will be very similar to Linda Tuple Space guidelines as per David Gelertner, providing easy to use 
interfaces for storage and execution.  

-  All sensor data, events as well as application code, will be stored and accessed through the Key/Value 
stored through the API.  

-  Processes will neither know or care which node they run on and all communication will be done 
through the API.  
  
---  
  

  

