#!/usr/bin/python3

from urllib.request import urlopen
from contextlib import closing
from pprint import pprint
import json

# Automatically geolocate the connecting IP
source_url = 'http://freegeoip.net/json/'

source_filename = "ips.txt"
destination_filename = "ip_coordinates.txt"

ip_file = open(source_filename, "r")
coordinate_file = open(destination_filename, "w")

for ip in ip_file:
	ip = ip[:-1]
	url = source_url + ip
	with closing(urlopen(url)) as response:
		location = json.loads(response.read().decode("UTF-8"))	
		location_latitude = location['latitude']
		location_longitude = location['longitude']
		output_string = str(location_latitude) + "," + str(location_longitude) + "\n"
		coordinate_file.write(output_string)

