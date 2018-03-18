var stepper = {};
// on Dom load
jQuery(function(){
	var visualization = new Visualization(jQuery("#svgContainer").get(0));
});

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};