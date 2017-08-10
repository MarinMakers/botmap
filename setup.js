#!/usr/bin/env node
const knex = require("knex")(require("./knexfile.js"));
const fs = require("fs");
const rl = require("readline");
var ipReader;
var locationReader;


new Promise((resolve, reject)=> {
	locationReader = rl.createInterface({
		input: fs.createReadStream('./csv/GeoLite2-Country-Locations-en.csv')
	});

	//On Line
	locationReader.on('line', function (line) {
		//Ignore first line
		if (line.startsWith("geoname")) return;

		var data = line.split(",")

		//Digest CSV in reliable, JS-proof way.
		var geoname_id = data.shift()
		var locale_code = data.shift()
		var continent_code = data.shift()
		var continent_name = data.shift()
		var country_iso_code = data.shift()
		var country_name = data.shift()
		// Create table insert data
		var obj = {
			geoname_id,
			locale_code,
			continent_code,
			continent_name,
			country_iso_code,
			country_name
		}

		//Hacky upsert. I will fight a PSQL dev if I ever see one IRL. It's 2017 ffs; where's our upsert, guy.
		knex("locations").del().where("geoname_id", geoname_id).then(
			knex("locations").insert(obj).returning("*").then(data => console.log(data))
		);
	});

	//On Close
	locationReader.on("close", function() {
		console.log("Location reader finished.")
		resolve()
	})
}).then((resolve, reject)=> {
	console.log("Firing IP table generator")
	// ipReader = rl.createInterface({
	// 	input: fs.createReadStream('./csv/GeoLite2-City-Blocks-IPv4.csv')
	// });
	// ipReader.on('line', function (line) {
	// 	if (line.startsWith("network")) return
	// 	var dataArr = line.split(",")
	// 	var network,geoname_id,registered_country_geoname_id,represented_country_geoname_id,is_anonymous_proxy,is_satellite_provider,postal_code,latitude,longitude,accuracy_radius
		
	// 	var octets = dataArr[0].split("/")[0].split(".")
	// 	var ipInt = (octets[0] * 16777216) + (octets[1] * 65536) + (octets[2] * 256) + (octets[3])

	// 	var data = {
	// 		ipaddr: dataArr[0].split("/")[0]
	// 	}

	// 	console.log(ipInt);
	// });
})


//knex()