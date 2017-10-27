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


//GET - Return a TVShow with specified ID
exports.findLast = function() {


	CarsKms.find({}, {limit: 1}, function(err, docs){

		console.log("findLast");
  		console.log(docs[0]);
  		if(docs.length > 0)
    		return docs[0];
	});
};




//POST - Insert a new TVShow in the DB
exports.addKmsEntry = function(req, res) {
	console.log('POST');
	console.log(req.body);

	var kmsEntry = new CarsKms({
		imei:    req.body.imei,
		iniKms:  req.body.iniKms,
		finKms:  req.body.finKms,
		fecha:   new Date(), //req.body.fecha,
		kmsRecorridos:  req.body.kmsRecorridos
	});


	kmsEntry.save(function(err, kmsEntry) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(kmsEntry);
	});
};


exports.addKmsLocalEntry = function(entry) {
	
	var kmsEntry = new CarsKms({
		imei:    entry.imei,
		iniKms:  entry.iniKms,
		finKms:  entry.finKms,
		fecha:   new Date(), //req.body.fecha,
		kmsRecorridos:  entry.kmsRecorridos
	});


	kmsEntry.save(function(err, kmsEntry) {
		if(err) return err.message;
    
		return kmsEntry;
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

//DELETE - Delete a TVShow with specified ID deleteKmsEntry
/* DELETE /todos/:id  
router.delete('/:id', function(req, res, next) {
  Todo.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
*/
exports.deleteKmsEntry = function(req, res) {
	
	CarsKms.findByIdAndRemove(req.params.id, req.body, function (err, kmsEntry) {
    	if (err) return next(err);
    		res.json(kmsEntry);
  	});
	/*CarsKms.findById(req.params.id, function(err, kmsEntry) {
		console.log(kmsEntry);
		kmsEntry.remove(function(err) {
			console.log("in delete");
			if(err) return res.send(500, err.message);
      		res.status(200);
		})
	});
	*/
};

