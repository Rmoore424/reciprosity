var express = require("express");
var router = express.Router();
var Recipe = require("../models");
var User = require("../models/user.js");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err)  return done(err);
			if(!user) {
				return done(null, false, { message: "Incorrect username or password" });
			}
			if(user.password != password) {
				return done(null, false, { message: "Incorrect username or password" });
			}
			return done(null, user);
		});
	}
));

router.get("/", function(req, res, next) {
	res.render("index");
});

router.get("/home/:user", function(req, res, next) {
	var name = req.params.user;
	User.findOne({username: name}, function(err, user) {
		console.log(typeof user._id);
		console.log(user._id);
		res.end();
	})
	// Recipe.find(function(err, recipes) {
	// 	res.render("home", {recipes: recipes, name: name});
	// });
});

router.get("/add", function(req, res, next) {
	res.render("add");
});

router.get("/recipes/:title", function(req, res, next) {
	title = req.params.title;
	Recipe.findOne({title: title}, function(err, recipe) {
		res.render("recipe_page", {recipe: recipe});
	});
});

router.post("/add/submit", function(req, res, next) {
	Recipe.create(req.body, function(err, recipe) {
		if (err) return next(err);
		res.redirect("/home");
	});
});

router.get("/recipes/:title/edit", function(req, res, next) {
	Recipe.findOne({title: req.params.title}, function(err, recipe) {
		if (err) return next(err);
			res.render("edit", {recipe: recipe});
	});
});

router.post("/recipes/:title/edit", function(req, res, next) {
	Recipe.findOneAndUpdate({title: req.params.title}, req.body, function(err, recipe) {
		if (err) return next(err);
		res.redirect("/recipes/"+req.params.title);
	});
});

router.get("/recipes/:title/remove", function(req, res, next) {
	Recipe.findOneAndRemove({title: req.params.title}, function(err, recipe) {
	res.redirect("/home");
	});
});

router.get("/signup", function(req, res, next) {
	res.render("signup");
});

router.post("/signup/submit", function(req, res, next) {
	console.log(req.body);
	User.create(req.body, function(err, user) {
		if (err) return next(err);
		res.redirect("/");
	});
});

router.post("/login", 
	passport.authenticate('local'),
	function(req, res) {
		res.redirect("/home/"+req.user.username);
	}

);


module.exports = router;