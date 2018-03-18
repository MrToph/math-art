import ISteppable from './ISteppable';
import PeanoCurve from './PeanoCurve';
require('../css/app.css');

export default class Visualization extends ISteppable {
  constructor (element) {
    super();
    this.svg = null;
    this.margin = {top: -0, right: -0, bottom: -0, left: -0};
    this.width = 1000;
    this.height = 1000;

    this.currentStep = 0;
    this.maxStep = 4;

    let realWidth = this.width + this.margin.left + this.margin.right;
    let realHeight = this.height + this.margin.top + this.margin.bottom;
    // Constants
    this.eleSize = 1000;
    this.translate = [0, 0];
    this.scale = 1;

    let svg = d3.select(element).append('svg')
      .attr('viewBox', '0 0 ' + realWidth + ' ' + realHeight)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.right + ')');

    this.svg = svg;

    svg.append('rect')
      .attr('class', 'svgOuterRect')
      .attr('x', -this.margin.left)
      .attr('y', -this.margin.top)
      .attr('width', realWidth)
      .attr('height', realHeight);
    let container = svg.append('g').attr('class', 'container')
      .attr('transform', 'translate(' + this.translate[0] + ',' + this.translate[1] + '),scale(' + this.scale + ')');
    this.container = container;
    this.elements = this.container.append('g');

    // init
    this.previousCurve = new PeanoCurve();
    this.currentCurve = new PeanoCurve();
    this.currentCurve.createData(0);
    this.redraw(0);
  }

  createData (step, forward = true) {
    if (forward) {
      this.previousCurve = this.currentCurve;
      this.currentCurve = new PeanoCurve();
      this.currentCurve.createData(step + 1); // recursion level is one more
    } else {
      this.currentCurve = this.previousCurve;
      this.previousCurve = new PeanoCurve();
      this.previousCurve.createData(step); // '-1'
    }
    let scale = Math.pow(2, step + 1); // this scale make the previous curve look like a blue print for the current curve
    scale = (scale - 1) / scale;
    let curvesData = [{id: step, type: 1, scale: scale, strokeWidth: this.maxStep - step + 2, points: this.previousCurve.getPoints()},
      {id: step + 1, type: 0, scale: 1, strokeWidth: this.maxStep - step + 1, points: this.currentCurve.getPoints()}];
    this.curvesData = curvesData;
  }

  redraw (step = this.currentStep , forward) {
    this.currentStep = step;
    this.createData(step, forward);
    this.elements.selectAll('.groupContainer').remove();
    this.createElements(step);
    this.createAnimations(step);
  }

  createElements () {
    let groups = this.elements.selectAll('.groupContainer').data(this.curvesData);
    groups.enter().append('g').attr('class', 'groupContainer');
    // lineFunctionCreator(scale) returns a d3.svg.line() which is a function itself that takes an array of points
    let lineFunctionCreator = scale => d3.svg.line()
      .x(d => (d[0] * scale + 0.5 * (1 - scale)) * this.eleSize) // rescale and center
      .y(d => (d[1] * scale + 0.5 * (1 - scale)) * this.eleSize) // rescale and center
      .interpolate('linear');

    this.elements.selectAll('.groupContainer').append('path').attr('class', 'element')
      .attr('d', d => lineFunctionCreator(d.scale)(d.points))
      .attr('stroke-width', d => d.strokeWidth)
      .classed('type0', d => d.type === 0)
      .classed('type1', d => d.type === 1);
  }

  createAnimations (step) {
    let path = this.elements.selectAll('.element').filter(d => d.id === step + 1);
    let totalLength = path.node().getTotalLength();

    path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration((step + 1) * 3000)
      .ease('linear')
      .attr('stroke-dashoffset', 0);
  }

  onStep (forward) {
    this.elements.selectAll('.element').interrupt().transition();
    return super.onStep(forward); // calls redraw
  }

};
