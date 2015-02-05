var express = require("express");
var logger = require("morgan");
var swig = require("swig");
require("./filters")(swig);
var bodyParser = require("body-parser");
var path = require("path");
var passport = require("passport");

var routes = require("./routes/index");

var app = express();
app.engine("html", swig.renderFile);

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "html");

app.use(express.static(path.join(__dirname, "public")));
//app.use(express.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use("/", routes);

app.use(function(req, res, next) {
	var err = new Error("Not Found");
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
    done(err, user);
  });
});

module.exports = app;