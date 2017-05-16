#!/usr/bin/python3
# CSV => JSON
# Welcome to the hodgiest podgiest parse
import json

if __name__ == "__main__":
	sourcefile = open("ip_coordinates.csv","r")
	outfile = open("ip_coordinates.json","w")
	outfile.truncate()
	string = "["
	for i, data in enumerate(sourcefile):
		[lat,lng,city,ip] = data.split(',')
		ip = "".join(ip.split("\n"))
		string+= '{"latitude":'+lat+',"longitude":'+lng+',"city":"'+city+'","ip":"'+ip+'"},\n'
	string=string[:-2]+"]"
	outfile.write(string)
