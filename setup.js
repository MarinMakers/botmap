#!/usr/bin/env node
const knex = require("knex")(require("./knexfile.js"));
const fs = require("fs");
const LineByLineReader = require("line-by-line");


function getIPRange(ipaddr) {
    var bitCount = parseInt(ipaddr.split("/").pop())
    var octets = ipaddr.split("/")[0].split(".").map(function(x){
      return parseInt(x)
    })

    var min = (octets[0] * 16777216) + (octets[1] * 65536) + (octets[2] * 256) + (octets[3]);
    var max  = min + Math.pow(2, 32-bitCount) - 1;
    return {min,max};
}

function intToIP(int) {
    var part1 = int & 255;
    var part2 = ((int >> 8) & 255);
    var part3 = ((int >> 16) & 255);
    var part4 = ((int >> 24) & 255);

    return part4 + "." + part3 + "." + part2 + "." + part1;
}


new Promise((resolve, reject)=> {
	var lr = new LineByLineReader('./csv/GeoLite2-Country-Locations-en.csv'),
		promiseArr = [];

	//On Line
	lr.on('line', function (line) {
		//Ignore first line
		if (line.startsWith("geoname")) return;

		var data = line.split(",")

		//Digest CSV in reliable, JS-proof way.
		var geoname_id = data.shift(),
			locale_code = data.shift(),
			continent_code = data.shift(),
			continent_name = data.shift(),
			country_iso_code = data.shift(),
			country_name = data.shift()
		// Create table insert data
		var obj = {
			geoname_id,
			locale_code,
			continent_code,
			continent_name,
			country_iso_code,
			country_name
		}

		//Populate array of promises.
		promiseArr.push(
			//Hacky upsert. I will fight a PSQL dev if I ever see one IRL. It's 2017 ffs; where's our upsert, guy.
			
			new Promise ((resolve, reject) => 
				knex("locations").del().where("geoname_id", geoname_id)
				.then(
					knex("locations").insert(obj).returning("*").then(data => {
						//console.log(data);
						resolve();
					})
				)
			)
		);
	});

	//On Close
	lr.on("close", function() {
		//Resolve all database inserts, then move on to next step.
		Promise.all(promiseArr).then(()=>{
			console.log("Location reader finished.")
			resolve()
		})
	})
})
.then(new Promise ((resolve, reject)=> {
	console.log("Firing IP table generator");
	
	var db = knex("ip_ranges"),
		lr = new LineByLineReader("./csv/GeoLite2-City-Blocks-IPv4.csv"),
		i = 0;
	

	db.truncate();

	lr.on('line', function (line) {
		if (line.startsWith("network")) return;


		console.log(i);
		i++;
		lr.pause();


		var line = line.split(",");
		var backup = line;

		// Object is defined in the following way to prevent JS from freaking out.
		var d = {};
		d.network = 						line.shift();
		d.geoname_id = 						line.shift();
		d.registered_country_geoname_id = 	line.shift();
		d.represented_country_geoname_id = 	line.shift();
		d.is_anonymous_proxy = 				(parseInt(line.shift()) === 1);
		d.is_satellite_provider = 			(parseInt(line.shift()) === 1);
		d.postal_code = 					line.shift();
		d.latitude = 						parseFloat(line.shift());
		d.longitude = 						parseFloat(line.shift());
		d.accuracy_radius = 				parseInt(line.shift());

		var ranges = getIPRange(d.network);
		d.start_ip_int = ranges.min;
		d.end_ip_int = ranges.max;



		if (isNaN(d.latitude) || isNaN(d.longitude) || isNaN(d.accuracy_radius)) {
			return lr.resume();
		}  else {
			knex.transaction(function(t) {
				return db.transacting(t).insert({
						"network": d.network,
						"start_ip_int": d.start_ip_int,
						"end_ip_int": d.end_ip_int,
						"geoname_id": d.geoname_id,
						"registered_country_geoname_id": d.registered_country_geoname_id,
						"represented_country_geoname_id": d.represented_country_geoname_id,
						"is_anonymous_proxy": d.is_anonymous_proxy,
						"is_satellite_provider": d.is_satellite_provider,
						"postal_code": d.postal_code,
						"latitude": d.latitude,
						"longitude": d.longitude,
						"accuracy_radius": d.accuracy_radius
					})
					.then(()=>{
						lr.resume()
						t.commit;
						d = null
					})
					.catch(function(e) {
						//t.rollback();
						console.log(e,d);
						throw e;
					})
			}).then().catch((e)=>{
				console.log(e)
			})

		}
	});

})).then(()=>{
	console.log(ipdata);
	console.log("Setup complete.");
	process.exit(0);
});
