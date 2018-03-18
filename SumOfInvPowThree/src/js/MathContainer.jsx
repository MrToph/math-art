/* global MathJax */
import ISteppable from './ISteppable';

export default class MathContainer extends ISteppable {
  constructor (element) {
    super();
    this.width = 1200;
    this.height = 500;

    this.currentStep = 0;
    // this.colors = ["#ff3232", "#008000", "#3232ff", "#ffa500", "#8A2BE2"]
    this.element = element;

    this.maxStep = 3;
    this.oldInnerHTML = '';

    MathJax.Hub.Queue(() => {
      this.jax = MathJax.Hub.getAllJax('mathContainer')[0];
    },
      () => {
        this.redraw(0);
      });
  }

  redraw (step = this.currentStep) {
    let innerHTML = this.getTextForCurrentStep();
    if (innerHTML !== this.oldInnerHTML) {
      this.oldInnerHTML = innerHTML;
      MathJax.Hub.queue.Push(['Text', this.jax, innerHTML]);
    }
  }

  getTextForCurrentStep () {
    let colorDefs = String.raw`\definecolor{colorRed}{RGB}{255,50,50}\definecolor{colorGreen}{RGB}{50,205,50}
                                    \definecolor{colorBlue}{RGB}{50,50,255}\definecolor{colorYellow}{RGB}{255,165,0}\definecolor{colorPurple}{RGB}{138,43,226}`;
    let text = '';
    switch (this.currentStep) {
      case 0:
      case 1:
        text = String.raw`\textcolor{colorRed}{\Delta}`;
        break;
      case 2:
        text = String.raw`\textcolor{colorBlue}{n^2\Delta}`;
        break;
      case 3:
        text = String.raw`\textcolor{colorBlue}{n^2\Delta} = \textcolor{colorRed}{1\Delta + 3\Delta + 5\Delta + \ldots + (2n-1)\Delta}`;
        break;
    }
    return `${colorDefs} \\smash{${text}}`;
  }
};
