var express = require('express');
var app = express();
var server = require('http').Server(app);
var io   = require('socket.io')(server);
var schedule = require('node-schedule');
var fs = require('fs');
var writable = fs.createWriteStream('file-buff.json');


app.use(express.static('mox'));



var eventos = [];


var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, new schedule.Range(0, 6)];
  rule.hour = 9;
  rule.minute = 0;

var j = schedule.scheduleJob(rule, () => {
  console.log('Alarma ;) ');
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
    writable.write(JSON.stringify(msg, null, 2), { encoding: 'utf8' });
  }
});

retranslator.start();



io.on('connection', function(socket) {

  socket.emit('msgs', eventos);
  
  socket.on('new-msg', function(data) {
    
    eventos.push(data);
    //console.log(data);
    io.sockets.emit('msg', data);
  });

});


server.listen(1337, function() {
  console.log("Servidor corriendo en puerto 1337");
});

