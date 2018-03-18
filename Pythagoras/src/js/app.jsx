var stepper = {};
// on Dom load
jQuery(function(){
	stepper = new Stepper();

	var pythagoras = new Pythagoras();
	pythagoras.init(d3.select("#svgContainer").node());
	stepper.registerCallback(1, pythagoras.onStep.bind(pythagoras)); // layer 1

	var mathContainer = new MathContainer(d3.select("#mathContainer").node());
	stepper.registerCallback(1, mathContainer.onStep.bind(mathContainer)); // layer 1
});

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};