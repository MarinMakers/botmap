#!/usr/bin/python3

from urllib.request import urlopen
from contextlib import closing
from pprint import pprint
import json

# Automatically geolocate the connecting IP
url = 'http://freegeoip.net/json/'




source_filename = "test_ip.txt"
destination_filename = "ip_coordinates.txt"

ip_file = open(source_filename, "r")
coordinate_file = open(destination_filename, "w")

for ip in ip_file:
	ip = ip[:-1]
	url = url + ip
	with closing(urlopen(url)) as response:
		location = json.loads(response.reads())	
		location_latitude = location['latitude']
		location_longitude = location['longitude']
		output_string = location_latitude + "," + location_longitude
		print(output_string)

