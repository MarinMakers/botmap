#!/usr/bin/python3

from urllib.request import urlopen
from contextlib import closing
from pprint import pprint
import json
import math
import sys


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


def validIPv4(ip):
	ip = ip.split(".")
	if len(ip) != 4: 
		return False
	for i in ip:
		try:
			i = int(i)
		except ValueError:
			return False
		if not 0<=i<=255:
			return False 
	return True

# Automatically geolocate the connecting IP
source_url = 'http://freegeoip.net/json/'

try:
	source_filename = sys.argv[1]
except IndexError:
	source_filename = "ips.txt"

destination_filename = "ip_coordinates.csv"

try:
	ip_file = open(source_filename, "r")
except:
	raise ValueError("Invalid source file name {0}. Exiting..".format(source_filename))

coordinate_file = open(destination_filename, "w")

ip_list = []
for i, ip in enumerate(ip_file):
	if validIPv4(ip):
		url = source_url + ip
		with closing(urlopen(url)) as response:
			location = json.loads(response.read().decode("UTF-8"))	
			location_latitude = location['latitude']
			location_longitude = location['longitude']
			location_city = location['city']
			output_string = str(location_latitude) + "," + str(location_longitude) + "," + location_city + "," + ip + "\n"

			### Something is wrong with the Loading bar feature. Revisit. For now, printing iterator on line below.
			# print("\r" + loadingBar(i + 1, len(ip_list)), end="")
			print(i)
			coordinate_file.write(output_string)
	else:
		print("Invalid IP: {0}".format(ip))
print("\nComplete!")

