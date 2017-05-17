# BotMap
###### A map of the 🤖net attacking our server

![latest map](http://i.imgur.com/478C0NJ.png)

## Premise

So my friends and I have been managing CentOS for the past couple of years in an effort to save money and have autonomy from private hosting services. After being port-forwarded, our most recent server quickly caught the attention of a scraper. Brute-force attacks soon followed, and `su -` reports like this were a **daily** occurance: 

![too many attacks](https://cdn.discordapp.com/attachments/210674878297145344/292148277456011264/image.jpg)

I implemented fail2ban ASAP (as everyone should), and before long the daily attacks began to diminish, flooring at ~10 a week. I concluded that this botnet must be astronomical, and I wanted to see just where these attacks were being distributed from. 

Sean and I began to whip up a means to find this out.

## Pythonic Approach

#### Our first model used MatPlotLib, a Python 2.x data plotting library, to create our map.

Pipng the list of banned IPs from `fail2ban-client status sshd`, we wrote a [simple script](https://github.com/MarinMakers/botmap/blob/master/ip_lookup.py) to convert these IPv4 addresses to geolocation using the [freegeoip API](freegeoip.net). This data was then parsed by [mapdraw](https://github.com/MarinMakers/botmap/blob/master/mapdraw.py) to populate a navigatible map.

![first map](http://i.imgur.com/NmBSpyH.png)

Then again with a month and a half worth of data and fresh coat of paint. . .

![second map](http://i.imgur.com/c5YulOD.png)

## HTML
#### Python is well and good for afternoon-sprint projects, but having to install huge dependencies on everyone's machine is a hastle. Better to move towards a Web stack. 

![third map](http://i.imgur.com/BGB4Eb1.png)

This employed a FrontEnd D3js library, [DataMaps](http://datamaps.github.io/). Its cross-platform accessability, high resolution SVG map and plot labels(!!!) were significant improvements over the previous implementation. This also featured a cleaner, low-light color scheme.


## Conclusion

### Of the 1,430 different attack sites, the top two highest-concentrated cities were:
# Buenos Aires

![BA](http://i.imgur.com/fy6nUyz.png)

# Shanghai

![CHI](http://i.imgur.com/VHz18Ir.png)

Will continue to post more information as it comes.
