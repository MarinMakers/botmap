#!/usr/bin/env node

var express = require('express');
var path = require('path');

var app = express()
app.set("title","Botmap");
app.use(express.static("public"));


app.use((req, res, next)=> {
	console.log(req)
	//express.static(path.join(__dirname,'/'))
});



app.get('/', function (req, res) {
	var filename = "/index.html"
	console.log(`Loading ${filename}`)
	res.sendFile(__dirname+filename)
})

app.listen(3000, ()=> {
	console.log("Server is live.")
});
