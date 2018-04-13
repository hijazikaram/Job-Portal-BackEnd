var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');

var app = express();

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
mongoose.connection.once('open', function() {
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
