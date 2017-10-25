exports = module.exports = function(app, mongoose) {

	var carsKmSchema = new mongoose.Schema({
		imei: 		{ type: Number },
        iniKms:		{ type: Number },
        finKms:		{ type: Number },
        fecha:      {type: Date},
		kmsRecorridos: { type: Number }
        
	});

	mongoose.model('CarsKms', carsKmSchema);

};