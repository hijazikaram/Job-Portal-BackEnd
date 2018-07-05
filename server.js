const express = require('express');
const path = require('path');
const logger = require('morgan');
const compression = require('compression');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.set('port', 5000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true , limit: '5mb' }));
app.use(bodyParser.json({limit: '5mb'}));
app.use(expressValidator());
app.use(methodOverride('_method'));
//todo: not safe change secret to something secret
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://admin:admin@ds123259.mlab.com:23259/jobportal');

var gfs;
mongoose.connection.once('open', function() {
  var db = mongoose.connection.db;
  var mongoDriver = mongoose.mongo;
  gfs = new Grid(db, mongoDriver);
  global.gfs = gfs;
  console.log('Connected');
});
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

require('./routes/user.js')(app);
require('./routes/resume.js')(app);
require('./routes/institution.js')(app);
require('./routes/job.js')(app);

app.get('/', function (req, res, next) {
  res.send("hello");
});

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
