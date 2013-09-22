
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
	var maxPrice = req.param("max_price");
	var minPrice = req.param("min_price");

	var recipient = "";

	if (typeof gender !== "undefined" && typeof ageRange !== "undefined")
	{
		ageRange.split("-");

		switch (gender)
		{
			case "boy":
			{
			} break;

			case "girl":
			{

			} break;
		}
	}

	var etsyPath = "https://openapi.etsy.com/v2/listings/active?" +
				   "method=GET&" + 
                   "includes=Images,Shop&" + 
                   "category=Toys&" + 
                   (typeof maxPrice !== "undefined" ? "max_price=" + maxPrice + "&" : "") +
                   (typeof minPrice !== "undefined" ? "min_price=" + minPrice + "&" : "") + 
                   "limit=100&" + 
                   "sort_on=created&" + 
                   "sort_order=down&" + 
                   "geo_level=country&" + 
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