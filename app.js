#!/usr/bin/env node

const express = require('express');
const path = require('path');
const knex = require("knex")(require("./knexfile.js"))
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const uuid = require('uuid');

const PORT = 1337;

var app = express()

app.set("title","Botmap");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(methodOverride())

var ipFormat = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/


//Error handler
function errorHandler(req, res, next) {
	var err = new Error('Not Found');
    err.status = 404;
    res.send("File Not Found")
    next(err);
}


function validIPArr(arr) {
	for (i in arr) {
		if (!arr[i].match(ipFormat)) return false
	}
	return true
}
function intToIP(int) {
    var part1 = int & 255;
    var part2 = ((int >> 8) & 255);
    var part3 = ((int >> 16) & 255);
    var part4 = ((int >> 24) & 255);

    return part4 + "." + part3 + "." + part2 + "." + part1;
}

function iPToInt(ipaddr) {
	var octets = ipaddr.split("/")[0].split(".").map(function(x){
      return parseInt(x)
    })

	return (octets[0] * 16777216) + (octets[1] * 65536) + (octets[2] * 256) + (octets[3]) -2147483648;
}

function getIPRange(ipaddr) {
    var bitCount = parseInt(ipaddr.split("/").pop())

    var min = iPToInt(ipaddr);
    var max  = min + Math.pow(2, 32-bitCount) - 1;
    return {min,max};
}


//Routes
app.get("/", function (req,res,next) {
	console.log(req.query)
	next()
})

app.get("/map", function (req,res) {
	console.log(`GET map with`, req.query)
	if (req.query.id) {
		res.sendFile(__dirname+"/public/map.html")
	}
	//next()
})
app.post("/submit", function (req,res) {
	var ipArr = req.body.iplist.split(/[\r\n\,\ \|_-]/).filter(function(n){ 
		if (n==="") return false
		return n != undefined
	});
	if (validIPArr(ipArr)) {
		var userID = uuid.v1();
		(function() {
			while(ipArr.length>0){
				
				ipInt = iPToInt(ipArr.pop())
				knex("ip_ranges").select("id").where('start_ip_int', '<', ipInt).andWhere('end_ip_int', '>',ipInt).then((data)=>{
					locationID = data[0].id
					knex("identifiers").insert({
						"user_id": userID,
						"loc_id": locationID
					}).then()
				}).catch(e=>console.log(e))
			}
		})()



		res.redirect("/map?id="+userID)
	}  else {
		res.send("Bad POST request")
	}


	//next()
})

app.get("/lookup", function(req,res) {
	if (req.query.id.match(/([a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}?)/i)){
		// TODO: Trim this up to the essentials.
		knex("identifiers")
		.select("*")
		.join("ip_ranges",function(){
			this.on("identifiers.loc_id","=","ip_ranges.id")
		}).join("locations",function(){
			this.on("ip_ranges.geoname_id", "=", "locations.geoname_id")
		})
		.where("user_id",req.query.id).then((data)=>{
			res.json(data)
		})
	} else {
		res.send("Nope")
	}
})

app.use("/",express.static("public"));


//This MUST be the last route
// app.use(errorHandler);
app.listen(PORT, ()=> {
	console.log(`Server is live at port ${PORT}`)
});


