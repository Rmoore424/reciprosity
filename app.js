var express = require("express");
var logger = require("morgan");
var swig = require("swig");
require("./filters")(swig);
var bodyParser = require("body-parser");
var path = require("path");
var passport = require("passport");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var uuid = require("uuid");

var routes = require("./routes/index");

var app = express();
app.engine("html", swig.renderFile);

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "html");

app.use(function noCachePlease(req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store");
  res.header("Expires", 300000);
  res.header("Pragma", "no-cache");
	next();
});

app.use(cookieParser());

app.use(session({
	genid: function(req) {
		return uuid.v4();
	},
	secret: 'monkeypants',
	resave: false,
	saveUninitialized: false,
	// cookie: {
	// 	maxAge: 1200
	// }
}))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use("/", routes);

app.use(express.static(path.join(__dirname, "public")));


app.use(function(req, res, next) {
	var err = new Error("Your session has expired");
	err.status = 404;
	next(err);
});

if(app.get("env") === "development") {
	swig.setDefaults({ cache: false });
	app.use(function(req, res, next) {
		res.status(err.status || 500);
		res.render("error", {
			message: err.message,
			error: err
		});
	});
}

// app.use(function(err, req, res, next) {
// 	res.status(err.status || 500);
// 	res.render("error", {
// 		message: err.message,
// 		error: {}
// 	});
// });

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port

	console.log("server listening", host, port);
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
  	console.log(user);
    done(err, user);
  });
});

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/');
// }

module.exports = app;