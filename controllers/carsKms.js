//File: controllers/carsKms.js
var mongoose = require('mongoose');
var CarsKms  = mongoose.model('CarsKms');

//GET - Return all CarsKms in the DB
exports.getAllKmsEntrys = function(req, res) {
	CarsKms.find(function(err, kmsEntrys) {
    if(err) res.send(500, err.message);

    console.log('GET /carsKms')
		res.status(200).jsonp(kmsEntrys);
	});
};

//GET - Return a CarsKms with specified ID
exports.findById = function(req, res) {
	CarsKms.findById(req.params.id, function(err, kmsEntry) {
    if(err) return res.send(500, err.message);

    console.log('GET /carsKms/' + req.params.id);
		res.status(200).jsonp(kmsEntry);
	});
};




//GET - Return a CarsKms with specified ID
exports.testFechas = function(req, res) {
	
	//$gte (“greater than equals” en inglés)
	//$lte (“lower than equals”).
	/*
	var kmsEntry = new CarsKms({
		imei:    req.body.imei,
		iniKms:  req.body.iniKms,
		finKms:  req.body.finKms,
		fecha:   req.body.fecha, //new Date(),
		kmsRecorridos:  req.body.kmsRecorridos
	});
	*/ 
	var f1 = req.body.f1;
	var f2 = req.body.f2;
	

	CarsKms.
		find({
			_id: req.params._id,
    fecha: {
        $gte:  f1,
        $lte:  f2
    }
		}).
		exec(function(err, kmsEntry){
			res.status(200).jsonp(kmsEntry);
		});

};





//GET - Return a CarsKms with specified ID
exports.test = function(req, res) {
	
	CarsKms.
		find({}).
		limit(1).
		sort({ fecha: -1 }).
		exec(function(err, kmsEntry){
			res.status(200).jsonp(kmsEntry);
		});

};


//GET - Return a CarsKms with specified ID
exports.test2 = function(req, res) {
	
	CarsKms.
		find({}).
		limit(1).
		sort({ fecha: -1 }).
		exec(function(err, kmsEntry){
			res.status(200).jsonp(kmsEntry);
		});

};


//GET - Return a CarsKms with specified ID
exports.findLast = function(fun) {

	/*
	CarsKms.find({}, {limit: 1}, function(err, docs){

		console.log("findLast");
  		console.log(docs[0]);
  		if(docs.length > 0)
    		return docs[0];
	});
	*/

//db.ciudades.find().sort({ciudad:1});
/*
Person.
  find({
    occupation: /host/,
    'name.last': 'Ghost',
    age: { $gt: 17, $lt: 66 },
    likes: { $in: ['vaporizing', 'talking'] }
  }).
  limit(10).
  sort({ occupation: -1 }).
  select({ name: 1, occupation: 1 }).
  exec(callback);
  
 */
 	CarsKms.
		find({}).
		limit(1).
		sort({ fecha: -1 }).
		exec(function(err, kmsEntry){
			fun(kmsEntry);
			return kmsEntry;
		});

/*
	CarsKms.
			find(function(err, kmsEntrys) {
		if(err) console.log("Error");
		console.log("findLast");
		console.log(kmsEntrys);
		fun(kmsEntrys[0]);
		return kmsEntrys[0];
	});

	*/
};




//POST - Insert a new CarsKms in the DB
exports.addKmsEntry = function(req, res) {
	console.log('POST');
	console.log(req.body);

	var kmsEntry = new CarsKms({
		imei:    req.body.imei,
		iniKms:  req.body.iniKms,
		finKms:  req.body.finKms,
		fecha:   req.body.fecha, //new Date(),
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
		fecha:   entry.fecha,
		kmsRecorridos:  entry.kmsRecorridos
	});


	kmsEntry.save(function(err, kmsEntry) {
		if(err) return err.message;
    
		return kmsEntry;
	});
};

//PUT - Update a register already exists
exports.updateKmsEntry = function(req, res) {
	CarsKms.findById(req.params.id, function(err, entry) {
		
		entry.imei =    req.body.imei,
		entry.iniKms =  req.body.iniKms,
		entry.finKms =  req.body.finKms,
		entry.fecha =   req.body.fecha, 
		entry.kmsRecorridos =  req.body.kmsRecorridos
	
		entry.save(function(err) {
			if(err) return res.send(500, err.message);
      		res.status(200).jsonp(entry);
		});
	});
};

//DELETE - Delete a CarsKms with specified ID deleteKmsEntry
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
    	if (err) return res.send(500, err.message); //next(err);
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

