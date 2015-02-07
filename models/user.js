var mongoose = require("mongoose");
var Recipe = require("../models");

var User;
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true }, // hash this password -this.isModified-
	user_recipes: [Recipe.Schema]
});

User = mongoose.model("User", UserSchema);

UserSchema.statics.findById = function(id, cb) {
	this.findOne({_id: id}, cb);
}

module.exports = User;