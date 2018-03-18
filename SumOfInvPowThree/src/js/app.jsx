import Visualization from './Visualization';
// import MathContainer from './MathContainer';
// import Stepper from './Stepper';

// window.stepper = {};
jQuery(function () {
  // window.stepper = new Stepper();
  let vis = new Visualization(jQuery('#svgContainer').get(0));
  // window.stepper.registerCallback(1, vis.onStep.bind(vis)); // layer 1
  // let mathContainer = new MathContainer(jQuery('#mathContainer').get(0));
  // window.stepper.registerCallback(1, mathContainer.onStep.bind(mathContainer)); // layer 1
});
