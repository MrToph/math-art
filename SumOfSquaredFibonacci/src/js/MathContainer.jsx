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

    this.maxStep = 7;
    this.oldInnerHTML = '';

    MathJax.Hub.Queue(() => {
      this.jax = MathJax.Hub.getAllJax('mathContainer')[0];
    },
      () => {
        this.redraw(0);
      });
  }

  redraw (step = this.currentStep) {
    let innerHTML = this.getTextForCurrentStep(step);
    if (innerHTML !== this.oldInnerHTML) {
      this.oldInnerHTML = innerHTML;
      MathJax.Hub.queue.Push(['Text', this.jax, innerHTML]);
    }
  }

  getTextForCurrentStep (step) {
    if(this.fib == undefined){
      this.fib = [1, 1];
      for (let i = 2; i <= this.maxStep + 1; i++) {
        this.fib[i] = this.fib[i - 1] + this.fib[i - 2];
      }
    }

    let colorDefs = String.raw`\definecolor{colorRed}{RGB}{255,50,50}\definecolor{colorGreen}{RGB}{50,205,50}
                                    \definecolor{colorBlue}{RGB}{50,50,255}\definecolor{colorYellow}{RGB}{255,165,0}\definecolor{colorPurple}{RGB}{138,43,226}`;
    let text = `${this.fib[0]}^2`;
    for(let i = 1; i <= step; i++){
      text += ` + ${this.fib[i]}^2`;
    }
    text += " = ";
    text += String.raw`\textcolor{colorRed}{${this.fib[step]}} \cdot \textcolor{colorBlue}{${this.fib[step+1]}}`;
    return `${colorDefs} \\smash{${text}}`;
  }
};
