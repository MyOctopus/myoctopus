___  

#                 **Welcome to MyOctopus**

<img src="http://4.bp.blogspot.com/-7fqLH4KRemk/VaDQPEalsoI/AAAAAAAAAIw/6yRAhHkeEkw/s1600/myOctupus002-08logoonly.png">


***  

#####[Current Project Status](https://github.com/wawrow/myoctopus/wiki/PROJECT-STATUS:)
#####[Wiki](https://github.com/wawrow/myoctopus/wiki)  
**[Issue Tracker](https://github.com/wawrow/myoctopus/issues)**   
  
  
  ---
 
#####**TO CONTRIBUTE:**  
######All contributions welcome, please join us in **[SLACK](https://myoctopus.slack.com)** for discussions or questions.  
>We are especially looking for input into the areas of **mobile app dev**, **electronics**, **pcb boards**, **digital to analog conversion**, 
and **AI algorithms**.  So, if this is relevant to your interests, please email sylwi@myoctopus.io.  

  
 
Please visit us on **[myoctopus.io](http://www.myoctopus.io)**  
Keep up to date with news on our **[BLOG](http://blog.myoctopus.io/)**   
Follow <a href="https://twitter.com/MyOctopus_io" class="twitter-follow-button" data-show-count="false" data-dnt="true">@MyOctopus_io</a>  

  
  ---

##**The Smart Home that is actually Smart.**  
  
    
>###### *MyOctopus*   is less a smart home hub, more a smart home muti-tool limited only by the imagination of it's users.  
 


**MyOctopus** is an open source smart home system running on open source hardware.  It is not just a smart home hub, 
we are designing it to be a **smart** smart home system with multiple devices - it will learn from your daily patterns 
(using AI Algorithms), utilize parallel distributed computing, connecting **MyOctopus** devices together and connecting 
all your other smart devices into a grid, and it will be both an app-hosting and a development platform.   
  
  
  
  ---

##**PROJECT ROADMAP**

>####**Initial Phase**  
  
> In the initial phase,  as we build MyOctopus,  universal [sensor boards](g.myoctopus.io/2015/07/sensor-boards.html) 
 and level shifter boards will be available, along with Intel Edison [breakout](http://ark.intel.com/products/84573/Intel-Edison-Breakout-Board-Kit)
 board kits.   Basically, the [sensors](https://github.com/wawrow/myoctopus/wiki/Developer-----Technical-Notes#with-each-myoctopus-device-the-following-components-will-be-available) 
 and level shifters together are 'plug and play' in relation to the I2C BUS.  These will be for sale on the website 
 and through the usual channels (eBay,, Amazon etc.).  They have the same small dimensions as similar sensor boards 
 on the market and will have custom addressing for I2C and wire interrupt lines.   Users of these sensors can purchase 
 them from us preflashed with [Yocta](https://www.yoctoproject.org/) Linux, or they can work with the code here on 
 [github](https://github.com/wawrow/myoctopus/tree/master/edison-cordova-bt/plugins/com.megster.cordova.bluetoothserial/examples), 
 or use them in any I2C BUS system. 
 
>####**MyOctopus**  
  
> MyOctopus will be the all-in one **smart** smart home solution; in each MyOctopus device will be using the above 
level shifters and sensors, and the same libraries and software, but these will be connected into the MyOctopus board 
inside the device (running MyOctopusLinux).  
  
  
  
  ---  
  
 
##**ARCHITECTURE OVERVIEW**  
  
  
*  Each MyOctopus device in the system is a fully fledged Linux OS running on an Intel Edison platform.   
*  Each device will become a node in the grid once it is configured into the system.   
*  Nodes will organize themselves into a Distributed Hash Table, which will support a Key / Value data 
store, with an API modelled on Linda Tuple Space.   
*  You can run the node software on any other hardware that is capable of such – and I’d guess anything with Python 
support will be able to run it.  

  
---   
  
  
####**[TEAM OCTOPUS](https://github.com/wawrow/myoctopus/wiki/Team-Octopus)**  
  
---
