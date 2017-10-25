var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose');

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
app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});

