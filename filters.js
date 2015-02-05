var marked = require("marked");

module.exports = function(swig) {
	var markInstructions = function(doc) {
		console.log(doc);
		return marked(doc.instructions);
	}

	markInstructions.safe = true;

	swig.setFilter("markInstructions", markInstructions);
}