import ISteppable from './ISteppable';
export default class Visualization extends ISteppable {
  constructor (element) {
    super();
    this.svg = null;
    this.margin = {top: -0, right: -0, bottom: -0, left: -0};
    this.width = 1000;
    this.height = 500;

    this.currentStep = 0;
    this.maxStep = 0;

    let realWidth = this.width + this.margin.left + this.margin.right;
    let realHeight = this.height + this.margin.top + this.margin.bottom;
    // Constants
    this.eleSize = 500;
    this.numLayers = 10;
    this.translate = [(realWidth - this.eleSize) * 0.5, 0];
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
    let container = svg.append('g')
      .attr('transform', 'translate(' + this.translate[0] + ',' + this.translate[1] + '),scale(' + this.scale + ')');
    this.container = container;
    this.rects = this.container.append('g');
    this.redraw(0);
  }

  createData (step) {
    let rectData = [];
    let pos = [0, 0];
    let sidelength = 1.0;
    // this.numLayers = 1
    for (let i = 0; i < this.numLayers; i++) {
      let rectSize = 0.5 * sidelength * this.eleSize;
      let obj = {layer: i, x: pos[0], y: pos[1] + rectSize, width: rectSize, height: rectSize, type: 1};
      rectData.push(obj);
      obj = {layer: i, x: pos[0], y: pos[1], width: rectSize, height: rectSize, type: 0};
      rectData.push(obj);
      obj = {layer: i, x: pos[0] + rectSize, y: pos[1] + rectSize, width: rectSize, height: rectSize, type: 0};
      rectData.push(obj);
      pos[0] += rectSize;
      sidelength *= 0.5;
    }
    this.rectData = rectData.reverse(); // reverse for highlight edges not behind rectangles
  }

  redraw (step = this.currentStep) {
    this.currentStep = step;
    this.createData(step);
    this.createElements();
  }

  createElements () {
    let eles = this.rects.selectAll('.square').data(this.rectData);
    eles.enter().append('rect').attr('class', 'square')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .classed('firstColor', d => d.type === 0)
      .classed('secondColor', d => d.type === 1)
      .on('mouseover', d => {
        this.rects.selectAll('.square').classed('highlighted', d2 => d2.layer === d.layer)
        .classed('unhighlighted', d2 => d2.layer !== d.layer);
      })
      .on('mouseout', d => {
        this.rects.selectAll('.square').classed('highlighted', false)
        .classed('unhighlighted', false);
      })
      ;
  }

};
