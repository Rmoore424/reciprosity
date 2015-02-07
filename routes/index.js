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
	res.render("index"); // check to see if the user is authenticated
});

router.get("/home/", function(req, res, next) {
	//var name = req.params.user;
	if (typeof req.session.passport.user == "undefined") {
		res.redirect("/");
	}

	else {
		Recipe.find(function(err, recipes) {
			res.render("home", {recipes: recipes});
		});
	}
});

router.get("/add", function(req, res, next) {
		if (typeof req.session.passport.user == "undefined") {
		res.redirect("/");
	}

	else {
	res.render("add");
	}
});

router.get("/recipes/:title", function(req, res, next) {
	var title = req.params.title;
	if (typeof req.session.passport.user == "undefined") {
		res.redirect("/");
	}
	else {
		Recipe.findOne({title: title}, function(err, recipe) {
			res.render("recipe_page", {recipe: recipe});
		});
	}
});

router.get("/my_recipes", function(req, res, next) {
	var userId = req.session.passport.user;
	User.findById(userId, function(err, user) {
		var recipes = user.user_recipes;
		res.render("my_recipes_page", {recipes: recipes})
	})
})

router.post("/add/submit", function(req, res, next) {
	var userId = req.session.passport.user;
	Recipe.create(req.body, function(err, recipe) {
		if (err) return next(err);
		User.findById(userId, function(err, user) {
			if (err) return next(err);
			user.user_recipes.push(recipe);
			user.save(function(){
				res.redirect("/home");
			})
		});
	});
});

router.get("/recipes/:title/edit", function(req, res, next) {
	if (typeof req.session.passport.user == "undefined") {
		res.redirect("/");
	}
	else {
		Recipe.findOne({title: req.params.title}, function(err, recipe) {
			if (err) return next(err);
				res.render("edit", {recipe: recipe});
		});
	}
});

router.post("/recipes/:title/edit", function(req, res, next) {
	Recipe.findOneAndUpdate({title: req.params.title}, req.body, function(err, recipe) {
		if (err) return next(err);
		res.redirect("/recipes/"+req.params.title);
	});
});

router.get("/recipes/:title/remove", function(req, res, next) {
	if (typeof req.session.passport.user == "undefined") {
		res.redirect("/");
	}
	else {
		Recipe.findOneAndRemove({title: req.params.title}, function(err, recipe) {
			res.redirect("/home");
		});
	}
});

router.get("/signup", function(req, res, next) {
	res.render("signup");
});

router.post("/signup/submit", function(req, res, next) {
	User.create(req.body, function(err, user) {
		if (err) return next(err);
		res.redirect("/");
	});
});

router.post("/login", 
	passport.authenticate('local', {
		successRedirect: "/home",
		failureRedirect: "/"}))
//,
// 	function(req, res) {
// 		res.redirect("/home");
// 	}
// );

router.get("/logout", function(req, res, next) {
	req.session.destroy(function(err) {
		req.logout();
		res.redirect("/");
	});
});


module.exports = router;