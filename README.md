___  

#                 **Welcome to MyOctopus**

<img src="http://4.bp.blogspot.com/-7fqLH4KRemk/VaDQPEalsoI/AAAAAAAAAIw/6yRAhHkeEkw/s1600/myOctupus002-08logoonly.png">


***  

#####[Current Project Status](https://github.com/wawrow/myoctopus/wiki/PROJECT-STATUS:)
#####[Wiki](https://github.com/wawrow/myoctopus/wiki)  
**[Issue Tracker](https://github.com/wawrow/myoctopus/issues)**   
  
  
  ---
 
   
>**TO CONTRIBUTE:** All contributions welcome, please join us in **[SLACK](https://myoctopus.slack.com)** for discussions or questions.  We are especially looking for input into the areas of **mobile app dev**, **electronics**, **pcb boards**, **digital to analog conversion**, and **AI algorithms**.  Please [fork](https://guides.github.com/activities/contributing-to-open-source/index.html).

>If the hardware side of things is relevant to your interests, or you would like to contribute to hardware development please email joinus@myoctopus.io.  
>>We are also on **[hackster](https://www.hackster.io/myoctopus1)** - you can follow us and contribute here too.

  
 
Please visit us on **[myoctopus.io](http://www.myoctopus.io)**  
Keep up to date with news on our **[BLOG](http://blog.myoctopus.io/)**   
Follow on Twitter <a href="https://twitter.com/MyOctopus_io" class="twitter-follow-button" data-show-count="false" data-dnt="true">@MyOctopus_io</a>  

  
  ---

##**The Smart Home that is actually Smart.**  
  
    
>###### *MyOctopus*: less a smart home hub, more a smart home muti-tool limited only by the imagination of it's users.  
 


**MyOctopus** is an open source smart home system running on open source hardware.  It is not just a smart home hub, 
we are designing it to be a **smart** smart home system - it will learn from your daily patterns 
(using AI Algorithms), utilize parallel distributed computing, connecting **MyOctopus** devices together, and it will be both an app-hosting and a development platform.  
  
  
  
  
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
##**LICENSES**    
  
<img src="http://4.bp.blogspot.com/-7fqLH4KRemk/VaDQPEalsoI/AAAAAAAAAIw/6yRAhHkeEkw/s1600/myOctupus002-08logoonly.png">
  
---    
  
  
######MyOctopus is completely open source, free to swim anywhere in the data ocean.  
#####Please feel free to breed your own Octopii, or evolve MyOctopus into whatever creature you wish
######But, remember, MyOctopus is licensed under [Creative Commons Attribution-ShareAlike 4.0 International Public License (CC BY-SA 4.0)](http://creativecommons.org/licenses/by-sa/4.0/legalcode) and these [terms](https://github.com/wawrow/myoctopus/blob/master/hostsoft/LICENSE).  
  
---  
  
###**[TEAM OCTOPUS](https://github.com/wawrow/myoctopus/wiki/Team-Octopus)**  
  
---  
