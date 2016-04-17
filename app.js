var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var multiparty = require('connect-multiparty');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var orm = require('orm');
var config = require('config');
var ormConfig = config.get('ormConfig');
var secret = config.get('cryptoSecret');

var crypto = require('crypto');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(multiparty());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(orm.express(ormConfig, {
//app.use(orm.express("mysql://nodejsatsigma:nodejsatsigma@localhost/NodejsAtSigma", {
	define: function (db, models, next) {
		db.load("./model/models", function (err) {
			models.USERS = db.models.USERS;
			models.HOMEWORKS = db.models.HOMEWORKS;
			models.HOMEWORK_PROBLEMS = db.models.HOMEWORK_PROBLEMS;
			models.HOMEWORK_HISTORIES = db.models.HOMEWORK_HISTORIES;
			models.HOMEWORK_FILES = db.models.HOMEWORK_FILES;

			db.sync(function (err) {
				if (err) console.log(err);
				next();
			});
		});
	}
}));
app.use(session({
	secret: 'NodejsAtSigma',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// passport config
passport.use(new LocalStrategy({ passReqToCallback: true }, function (req, username, password, done) {
	console.log("hey!");
	req.models.USERS.find({ USER_ID: username }, function (err, users) {
		console.log(password);
		var hash = crypto.createHash('sha256');
		hash.update(password);
		password = hash.digest('hex');
		console.log(password);
		
		if (err) console.log(err);

		console.log("users length: ",users.length);
		if (users.length > 0 && users[0].USER_PASSWORD == password) {
			users[0].USER_PASSWORD = "";
			done(null, users[0]);
		} else {
			done(null, false, {message: "no such user."});
		}
	});
//	done(null, false, {message : "AAAAA"});
}));
passport.serializeUser(function (user, done) {
	console.log("ser");
	done(null, user.CID);
});
passport.deserializeUser(function (req, id, done) {
	console.log("deser", id);
	req.models.USERS.find({ CID: id }, function (err, users) {
		if (err) console.log(err);

		console.log("users length: ",users.length);
		if (users.length > 0) {
			users[0].USER_PASSWORD = "";
			done(null, users[0]);
		} else {
			done(null, false, {message: "bad ass"});
		}
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
