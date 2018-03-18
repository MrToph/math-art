"use strict";

var stepper = {};
// on Dom load
jQuery(function () {
	stepper = new Stepper();

	var visualization = new Visualization(jQuery("#canvasContainer").get(0));
	stepper.registerCallback(1, visualization.onStep.bind(visualization)); // layer 1
	var mathContainer = new MathContainer(jQuery("#mathContainer").get(0));
	stepper.registerCallback(1, mathContainer.onStep.bind(mathContainer)); // layer 1
});

Number.prototype.clamp = function (min, max) {
	return Math.min(Math.max(this, min), max);
};
//# sourceMappingURL=app-compiled.js.map
