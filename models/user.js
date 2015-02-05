var mongoose = require("mongoose");

var User;
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true } // hash this password -this.isModified-
});

User = mongoose.model("User", UserSchema);

module.exports = User;