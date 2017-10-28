var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose');

//var moment = require('moment-timezone');
    
var server = require('http').Server(app);
var io   = require('socket.io')(server);
var schedule = require('node-schedule');
var fs = require('fs');
var writable = fs.createWriteStream('file-buff.json');


//moment().tz("America/Chihuahua").format();


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



var primerEventoDia = undefined;


var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, new schedule.Range(0, 6)];
  rule.hour = 14; //rule.hour = 9;
  rule.minute = 0;

var j = schedule.scheduleJob(rule, function () {
  console.log('Alarma ');


  //save in mongodb
  /*
    se recupera el primer evento desde la variable
    se recupera el ultimo evento desde el arreglo de eventos
    parseInt ((ev.odometer / 1000) + 142068)
  */

  console.log(eventos[eventos.length - 1].data[11].value);
  console.log(eventos[eventos.length - 1]);

  console.log("primerEventoDia");
  console.log(primerEventoDia);
  console.log(".-.-.-.-.-.-.-.");
  

  var d = new Date();
  d.setHours(d.getHours() + 2);
  
  
  var iniKms = primerEventoDia.data[11].value;
  var finKms = eventos[eventos.length - 1].data[11].value;

  iniKms = parseInt ((iniKms / 1000) + 142068);

  finKms = parseInt ((finKms / 1000) + 142068);
  

  var entry = {
		imei:    862462035861144,
		iniKms:  iniKms, //primerEventoDia.data[11].value,
		finKms:  finKms,
		fecha:   d,
		kmsRecorridos: finKms - iniKms
	};


  console.log("entry");
  console.log(entry);
  CarsKmsCtrl.addKmsLocalEntry(entry);

  primerEventoDia == eventos[eventos.length - 1];
  eventos = [];
  eventos.push(primerEventoDia);

});

/*


{ controllerId: '862462035861144',
  time: 2017-10-26T18:38:47.000Z,
  posInfo: true,
  digInputInfo: true,
  digOutInfo: false,
  alarm: false,
  driversIdInfo: false,
  data: 
   [ { name: 'posinfo', value: [Object] },
     { name: 'hdop', value: 0.8 },
     { name: 'io_caused', value: '7' },
     { name: 'io_1_176', value: '0' },
     { name: 'io_1_88', value: '0' },
     { name: 'gsm_signal', value: '14' },
     { name: 'modem_temp', value: '40' },
     { name: 'modem_temp', value: '40' },
     { name: 'battery', value: '3982' },
     { name: 'power', value: '13084' },
     { name: 'din4_hours', value: '0' },
     { name: 'odometer', value: '10873488' },
     { name: 'io_4_77', value: '0' },
     { name: 'avl_inputs', value: '0' } ] }

 */

var Retranslator = require('./wialon-re');
var retranslator = new Retranslator({ port: 20163 });

retranslator.emitter.on('message', (msg) => 
  {

    //console.log(JSON.stringify(msg, null, 2), { encoding: 'utf8' });
    
    
    //863835024736063, 862462035861144
    if(msg.controllerId == 862462035861144){	
    

    if(primerEventoDia == undefined)
      primerEventoDia = msg;
    
    //if(eventos.length > 10)
    //  eventos.shift();

    eventos.push(msg);
    io.sockets.emit('msg', msg);
    console.log(msg);
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


primerEventoDia = CarsKmsCtrl.findLast();

console.log("primerEventoDia");
console.log(primerEventoDia);
/*

app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});

*/
