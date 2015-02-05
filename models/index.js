var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/recipes")
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

var Recipe;
var Schema = mongoose.Schema;

// var getIngredients = function(ings) {
// 	return ings.split("\n");
// }

var hashPassword = function(password) {
	
}

var RecipeSchema = new Schema({
	title: { type: String, required: true }, //RecipeSchema.path("title").validate(function(v) {return })
	ingredients: { type: [String], required: true },//, get: getIngredients 
	instructions: { type: String, required: true },
	user_id: Object
});

Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports = Recipe;