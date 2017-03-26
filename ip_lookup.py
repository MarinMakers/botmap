#!/usr/bin/python3

from urllib.request import urlopen
from contextlib import closing
from pprint import pprint
import json
import math

def loadingBar(current_item, max_items):
	bar_length = 30
	# Fixes spacing of the fraction counter
	space_difference = len(str(max_items)) - len(str(current_item))
	padding = ""
	for i in range(space_difference):
		padding += " "
	output_string = "(" + str(current_item) + padding + "/" + str(max_items) + ") "
	current_place = math.ceil(float(current_item) / float(max_items) * bar_length)
	loading_section = "["
	for i in range (current_place): # Yes this is horrific. Don't judge me please.
		loading_section += "#"
	for i in range (bar_length - current_place):
		loading_section += " "
	loading_section += "]"

	return output_string + loading_section + " "

# Automatically geolocate the connecting IP
source_url = 'http://freegeoip.net/json/'

source_filename = "ips.txt"
destination_filename = "ip_coordinates.txt"

ip_file = open(source_filename, "r")
coordinate_file = open(destination_filename, "w")

ip_list = []
for ip in ip_file:
	ip = ip[:-1]
	url = source_url + ip
	with closing(urlopen(url)) as response:
		location = json.loads(response.read().decode("UTF-8"))	
		location_latitude = location['latitude']
		location_longitude = location['longitude']
		output_string = str(location_latitude) + "," + str(location_longitude) + "\n"
		print("\r" + loadingBar(i + 1, len(ip_list)), end="")
		coordinate_file.write(output_string)
print("\nComplete!")

