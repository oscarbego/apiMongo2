var express = require('express');
var app = express();
var server = require('http').Server(app);
var io   = require('socket.io')(server);
var schedule = require('node-schedule');
var fs = require('fs');
var writable = fs.createWriteStream('file-buff.json');
var mongo = require('mongodb');


let net = require('net');

net.createServer(function(s){
  s.on('data', function(data){
	console.log("> " + data);  
    broadcast("> " + data);
  })
  function broadcast(message){
    process.stdout.write(message);
  }
}).listen(1338);



app.use(express.static('public'));

function sumarDias(fecha, dias){
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}


/*

//------------ Mongo -------------
// -- https://www.w3schools.com/nodejs/nodejs_mongodb_query.asp

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  	/ *
	db.createCollection("eventosGps", function(err, res) {
    		if (err) throw err;

  		console.log("Collection created!");
  		db.close();
	});
	* /

		
	var myobj = { name: "Company Inc", address: "Highway 37", "fecha": new Date() };
  	console.log(new Date());

	var d = new Date();
	console.log("-------- Resta -----");
	console.log(sumarDias(d, -1));

	/ *
	db.collection("eventosGps").insertOne(myobj, function(err, res) {
    		if (err) throw err;
    
		console.log("1 document inserted");
    		db.close();
  	});
	* /	

	/ *
	db.collection("eventosGps").findOne({}, function(err, result) {
    		if (err) throw err;
    		console.log(result.name);
    		db.close();
  	});
	* /


	/ *	
	var query = { address: "Highway 37" }; // var query = { address: /^S/ }; los q inician con "s"
  	db.collection("eventosGps").find(query).toArray(function(err, result) {
    		if (err) throw err;
		console.log("query: ");
    		console.log(result);
    		db.close();
  	});
	* /


	var queryF = { fecha : {$gt : new Date("2017-10-14")} }; // var query = { address: /^S/ }; los q inician con "s"
        db.collection("eventosGps").find(queryF).toArray(function(err, result) {
                if (err) throw err;
                console.log("queryF: ");
                console.log(result);
		console.log("if de fecha");
		if(result.length > 0)
			console.log("fecha: " + result[0].fecha);

		console.log("fecha: " + result[0].fecha + " -- " + result.length);
                db.close();
        });

	
	/ *
	var myquery = { address: 'Highway 37' };
  	db.collection("eventosGps").deleteOne(myquery, function(err, obj) {
    		if (err) throw err;
    			console.log("1 document deleted");
    		db.close();
  	});
	* /

});

//--------------------------------

*/

app.get('/json', function (req, res) {

        var nombre = req.query.nombre || '';
        var saludo = '';

        if (nombre != '')
                saludo = "Hola " + nombre;


	MongoClient.connect(url, function(err, db) {
  		if (err) throw err;
	

	    var queryF = { fecha : {$gt : new Date("2017-10-14")} }; // var query = { address: /^S/ }; los q inic$
            db.collection("eventosGps").find(queryF).toArray(function(err, result) {
                if (err) throw err;
                console.log("queryF: ");
                console.log(result);
                console.log("if de fecha");
                if(result.length > 0)
                        console.log("fecha: " + result[0].fecha);

                console.log("fecha: " + result[0].fecha + " -- " + result.length);
                db.close();
		res.send(result);
            });

	});
	var obj = {nombre:"Oso"}
        res.send(obj);

});


app.get('/saludo', function (req, res) {
 
	var nombre = req.query.nombre || '';
	var saludo = '';
 
	if (nombre != '')
		saludo = "Hola " + nombre;
 
	res.send('<html><body>'
		      + '<h1>Saludo</h1>'
		      + '<p>' + saludo + '</p>'
		      + '<form method="get" action="/saludo">'
		      + '<label for="nombre">¿Cómo te llamas?</label>'
		      + '<input type="text" name="nombre" id="nombre">'	
		      + '<input type="submit" value="Enviar"/>'
		      + '</form>'
		      + '</body></html>');
 
});


var eventos = [];


var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, new schedule.Range(0, 6)];
  rule.hour = 9;
  rule.minute = 0;

var j = schedule.scheduleJob(rule, function () {
  console.log('Alarma ');
  eventos = [];
});



var Retranslator = require('./wialon-re');
var retranslator = new Retranslator({ port: 20163 });

retranslator.emitter.on('message', (msg) => 
  {

    //console.log(JSON.stringify(msg, null, 2), { encoding: 'utf8' });
    
    //863835024736063, 862462035861144
    if(msg.controllerId == 862462035861144){	
    
    //if(eventos.length > 10)
    //  eventos.shift();

    eventos.push(msg);
    io.sockets.emit('msg', msg);
    //io.sockets.emit('msg', eventos);
    //writable.write(JSON.stringify(msg, null, 2), { encoding: 'utf8' });
  }
});

retranslator.start();



io.on('connection', function(socket) {

  socket.emit('msgs', eventos);
  

  socket.on('new-msg', function(data) {
    
    eventos.push(data);
    console.log(data);
    io.sockets.emit('msg', data);
  });

});


server.listen(1337, function() {
  console.log("Servidor corriendo en puerto 1337");
});

