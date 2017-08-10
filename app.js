#!/usr/bin/env node

const express = require('express');
const path = require('path');
const knex = require("knex")(require("./knexfile.js"))
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

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



//Routes
app.get("/", function (req,res,next) {
	console.log(req.params)
	next()
})

app.get("/map", function (req,res) {
	console.log(`GET map with`, req.params)
	res.sendFile(__dirname+"/public/map.html")
	//next()
})
app.post("/submit", function (req,res) {
	var ipArr = req.body.iplist.split(/[\r\n\,\ ]/).filter(function(n){ 
		if (n==="") return false
		return n != undefined
	});
	if (validIPArr(ipArr)) {
		console.log(ipArr)
	}


	res.sendFile(__dirname+"/public/map.html")
	//next()
})

app.use("/",express.static("public"));


//This MUST be the last route
// app.use(errorHandler);
app.listen(PORT, ()=> {
	console.log(`Server is live at port ${PORT}`)
});


