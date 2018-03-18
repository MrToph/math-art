import Visualization from './Visualization';
// import Stepper from './Stepper';

// on Dom load
window.stepper = {};
jQuery(function () {
  // window.stepper = new Stepper();
  let vis = new Visualization(jQuery('#svgContainer').get(0));
  // window.stepper.registerCallback(1, vis.onStep.bind(vis)); // layer 1
});
