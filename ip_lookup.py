#!/usr/bin/python3

from urllib.request import urlopen
from contextlib import closing
from pprint import pprint
import json

# Automatically geolocate the connecting IP
url = 'http://freegeoip.net/json/218.65.30.122'
# try:

# with closing(urlopen(url)) as response:
#    location = json.loads(response.read())
#    pprint(location)
#    location_city = location['city']
#    location_state = location['region_name']
#    location_country = location['country_name']

#    location_zip = location['zipcode']
# except:
#     print("Location could not be determined automatically")

ip_file = open("ips.txt", "r")
for line in ip_file:
	print("IP: " + line, end="")

