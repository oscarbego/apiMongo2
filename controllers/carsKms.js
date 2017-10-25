//File: controllers/carsKms.js
var mongoose = require('mongoose');
var CarsKms  = mongoose.model('CarsKms');

//GET - Return all tvshows in the DB
exports.getAllKmsEntrys = function(req, res) {
	CarsKms.find(function(err, kmsEntrys) {
    if(err) res.send(500, err.message);

    console.log('GET /carsKms')
		res.status(200).jsonp(kmsEntrys);
	});
};

//GET - Return a TVShow with specified ID
exports.findById = function(req, res) {
	CarsKms.findById(req.params.id, function(err, kmsEntry) {
    if(err) return res.send(500, err.message);

    console.log('GET /carsKms/' + req.params.id);
		res.status(200).jsonp(kmsEntry);
	});
};

//POST - Insert a new TVShow in the DB
exports.addKmsEntry = function(req, res) {
	console.log('POST');
	console.log(req.body);

	var kmsEntry = new CarsKms({
		title:    req.body.title,
		year: 	  req.body.year,
		country:  req.body.country,
		poster:   req.body.poster,
		seasons:  req.body.seasons,
		genre:    req.body.genre,
		summary:  req.body.summary
	});

	kmsEntry.save(function(err, kmsEntry) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(kmsEntry);
	});
};

//PUT - Update a register already exists
exports.updateKmsEntry = function(req, res) {
	TVShow.findById(req.params.id, function(err, tvshow) {
		tvshow.title   = req.body.petId;
		tvshow.year    = req.body.year;
		tvshow.country = req.body.country;
		tvshow.poster  = req.body.poster;
		tvshow.seasons = req.body.seasons;
		tvshow.genre   = req.body.genre;
		tvshow.summary = req.body.summary;

		tvshow.save(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200).jsonp(tvshow);
		});
	});
};

//DELETE - Delete a TVShow with specified ID
exports.deleteKmsEntry = function(req, res) {
	CarsKms.findById(req.params.id, function(err, kmsEntry) {
		kmsEntry.remove(function(err) {
			if(err) return res.send(500, err.message);
      res.status(200);
		})
	});
};