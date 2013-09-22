
/**
 * Module dependencies.
 */

var express = require('express');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var http = require('http');
var https = require('https');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');

// Other
app.configure(function(){
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.post('/email/', function (req, res) {
	var email = req.param('email');

	var doc = {email: email};
	var uri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/teddylabs';
	MongoClient.connect(uri, function (err, db) {
		if (err) {
			throw err;
		}
		var collection = db.collection('emails');
		collection.count(doc, function(err, count) {
			if (!count) {
				collection.insert(doc, function(err, docs) {
					console.log('inserted');
				});
			} else {
				console.log('already inserted');
			}
		});
	});
});

app.get('/api/toys', function (req, res) {
	var gender = req.param("gender");
	var ageRange = req.param("age_range");
	var priceRange = req.param("price_range");

	var description = [];

	var minPrice;
	var maxPrice;

	if (typeof priceRange !== "undefined") {
		switch (priceRange) {
			case "price25": {
				minPrice = 0;
				maxPrice = 25;
			} break;

			case "price50": {
				minPrice = 25;
				maxPrice = 50;
			} break;

			case "price75": {
				minPrice = 50;
				maxPrice = 75;
			} break;

			case "pricealot": {
				minPrice = 75;
			} break;
		}
	}

	if (typeof ageRange !== "undefined") {
		switch (ageRange) {
			case "babies":
			case "baby": {
				description.push("baby", "babies");
			} break;

			case "toddlers":
			case "toddler": {
				description.push("toddler", "toddlers");
			} break;

			case "kids":
			case "kid": {
				description.push("kid", "kids", "child", "children");
			} break;
		}
	}

	if (typeof gender !== "undefined") {
		switch(gender) {
			case "boys":
			case "boy": {
				description.push("boy", "male");
			} break;

			case "girls":
			case "girl": {
				description.push("girl", "female");
			} break;
		}
	}

	description = description.toString();

	var etsyPath = "https://openapi.etsy.com/v2/listings/active?" +
				   "method=GET&" +
				   "includes=Images(url_570xN)&" +
				   "category=Toys&" +
				   (typeof maxPrice !== "undefined" ? "max_price=" + maxPrice + "&" : "") +
				   (typeof minPrice !== "undefined" ? "min_price=" + minPrice + "&" : "") +
				   (typeof description !== "undefined" && description !== "" ? "description=" + description + "&" : "") +
				   "limit=30&" +
				   "api_key=ouavs6p1ors6wt2e9uz9s4j1";

	console.log("Path: " + etsyPath);
	https.get(etsyPath, function(etsyRes) {
		var etsyJson = "";
		console.log("StatusCode: " + etsyRes.statusCode);

		etsyRes.on('data', function(chunk) {
			etsyJson += chunk;
		});

		etsyRes.on('end', function() {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(etsyJson);
			res.end();
		});
	}).on("error", function(error) {
		console.log("Error!");
		res.writeHead(400, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify({ error: error }));
		res.end();
	});

});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});