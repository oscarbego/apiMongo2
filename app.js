var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose');

    
var server = require('http').Server(app);
var io   = require('socket.io')(server);
var schedule = require('node-schedule');
var fs = require('fs');
var writable = fs.createWriteStream('file-buff.json');


function sumarDias(fecha, dias){
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}

app.use(express.static(__dirname + '/public'));

function sumarDias(fecha, dias){
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}



//var CarsKms2  = mongoose.model('CarsKms');

// app procesa ----------------------------

var eventos = [];
var primerEventoDia;


var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, new schedule.Range(0, 6)];
  rule.hour = 9; //rule.hour = 9;
  rule.minute = 0;

var j = schedule.scheduleJob(rule, function () {
  console.log('Alarma ');


  //save in mongodb
  /*
    se recupera el primer evento desde la variable
    se recupera el ultimo evento desde el arreglo de eventos
  */
  var kmsEntry = new CarsKms({
		imei:    862462035861144,
		iniKms:  primerEventoDia.data[11].value,
		finKms:  eventos[eventos.length - 1].data[11].value,
		fecha:   new Date(),
		kmsRecorridos:  primerEventoDia.data[11].value - eventos[eventos.length - 1].data[11].value
	});


	kmsEntry.save(function(err, kmsEntry) {
		if(err) console.log("Error in save");
    console.log("Save OK");
	});


  primerEventoDia == undefined;
  eventos = [];

});


var Retranslator = require('./wialon-re');
var retranslator = new Retranslator({ port: 20163 });

retranslator.emitter.on('message', (msg) => 
  {

    //console.log(JSON.stringify(msg, null, 2), { encoding: 'utf8' });
    
    console.log(msg);
    //863835024736063, 862462035861144
    if(msg.controllerId == 862462035861144){	
    

    if(primerEventoDia == undefined)
      primerEventoDia = msg;
    
    //if(eventos.length > 10)
    //  eventos.shift();

    eventos.push(msg);
    io.sockets.emit('msg', msg);
    //console.log(msg);
    console.log(msg.data[11].value);
    //io.sockets.emit('msg', eventos);
    //writable.write(JSON.stringify(msg, null, 2), { encoding: 'utf8' });
  }
});

retranslator.start();



io.on('connection', function(socket) {

  socket.emit('msgs', eventos);
  
  socket.on('new-msg', function(data) {
    
    eventos.push(data);
    
    io.sockets.emit('msg', data);
  });

});



// ----------------------------------------




// Connection to DB
mongoose.connect('mongodb://localhost/tvshows', function(err, res) {
  if(err) throw err;
  console.log('Connected to Database');
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Import Models and controllers
var models            = require('./models/tvshows')(app, mongoose);
var modelsCarsKms     = require('./models/carsKms')(app, mongoose);

var TVShowCtrl        = require('./controllers/tvshows');
var CarsKmsCtrl        = require('./controllers/carsKms');

// Example Route
var router = express.Router();

router.get('/', function(req, res) {
  res.send("Hello world!");
});
app.use(router);

// API routes
var kms = express.Router();

kms.route('/kms')
  .get(CarsKmsCtrl.getAllKmsEntrys)
  .post(CarsKmsCtrl.addKmsEntry);

kms.route('/kms/:id')
  .get(CarsKmsCtrl.findById)
  .put(CarsKmsCtrl.updateKmsEntry)
  .delete(CarsKmsCtrl.deleteKmsEntry);

app.use('/api', kms);

// Start server


server.listen(3000, function() {
  console.log("Servidor corriendo en puerto 3000");
});

/*
app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});

*/

