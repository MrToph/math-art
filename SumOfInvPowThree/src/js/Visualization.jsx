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
    this.polys = this.container.append('g');
    this.rects = this.container.append('g');
    this.redraw(0);
  }

  createData (step) {
    let rectData = [];
    let polyData = [];
    this.numLayers = 10;
    for (let i = 0; i < this.numLayers; i++) {
      if (i % 2 === 0) {
        let rect1 = this.createRectData(i, 0);
        let rect2 = this.createRectData(i, 1);
        let rect3 = this.createRectData(i, 2);
        rectData.push(rect1);
        rectData.push(rect2);
        rectData.push(rect3);
      }
      let polys = this.createPolyData(i);
      polyData.push(...polys);
    }
    this.rectData = rectData.reverse(); // reverse for highlight edges not behind rectangles
    this.polyData = polyData;
  }

  createRectData (i, whichOne) {
    const onethird = 0.3333;
    let depth = Math.ceil(i / 2);
    let rectLong = Math.pow(onethird, depth) * this.eleSize;
    let rectShort = onethird * rectLong;
    let rect = {layer: i};
    if (i % 2 === 0) {
      let xPos = new Array(depth).fill(onethird).reduce((acc, x) => acc * onethird + x, 0); // 1/3 + 1/9 + 1/27 + ... 1/3^depth
      xPos *= this.eleSize;
      rect.width = rectShort;
      rect.height = rectLong;
      rect.x = xPos + whichOne * rectShort;
      rect.y = xPos;
    }
    return rect;
  }

  createPolyData (i) {
    const onethird = 0.3333;
    let depth = Math.floor(i / 2);
    let rectLong = Math.pow(onethird, depth) * this.eleSize;
    let rectShort = onethird * rectLong;
    let polys = [];
    let xPos = new Array(depth).fill(onethird).reduce((acc, x) => acc * onethird + x, 0) * this.eleSize; // 1/3 + 1/9 + 1/27 + ... 1/3^depth
    if (i % 2 === 0) {
      let poly1 = {layer: depth, type: 0};
      let poly2 = {layer: depth, type: 1};
      let poly3 = {layer: depth, type: 2};
      let a = [xPos, xPos];
      let b = [xPos + rectShort, xPos];
      let c = [xPos + rectShort, xPos + rectShort];
      let d = [xPos + rectShort, xPos + rectLong];
      let e = [xPos, xPos + rectLong];
      poly1.points = this.pointsToString([a, c, d, e]);
      poly2.points = this.pointsToString([a, b, c]);

      // last triangle in bottom right
      xPos += 2 * rectShort;
      a = [xPos, xPos];
      b = [xPos + rectShort, xPos + rectShort];
      c = [xPos, xPos + rectShort];
      poly3.points = this.pointsToString([a, b, c]);
      polys.push(poly1);
      polys.push(poly2);
      polys.push(poly3);
    } else { // easy part only one needed (will always be below diagonal)
      let poly1 = {layer: depth, type: 0};
      xPos += rectShort;
      let yPos = xPos + rectShort;
      let a = [xPos, yPos];
      let b = [xPos + rectShort, yPos];
      let c = [xPos + rectShort, yPos + rectShort];
      let d = [xPos, yPos + rectShort];
      poly1.points = this.pointsToString([a, b, c, d]);
      polys.push(poly1);
    }
    return polys;
  }

  pointsToString (arr) {
    return arr.map(x => x.join(',')).join(' ');
  }

  redraw (step = this.currentStep) {
    this.currentStep = step;
    this.createData(step);
    this.createElements();
    this.createContainerMouseOver();
  }

  createElements () {
    let eles = this.polys.selectAll('.poly').data(this.polyData);
    eles.enter().append('polygon').attr('class', 'poly')
      .attr('points', d => d.points)
      .classed('firstColor', d => d.type === 0)
      .classed('secondColor', d => d.type === 1)
      .classed('thirdColor', d => d.type === 2);

    eles = this.rects.selectAll('.square').data(this.rectData);
    eles.enter().append('rect').attr('class', 'square')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width)
      .attr('height', d => d.height);
  }

  createContainerMouseOver () {
    this.container.on('mouseover', () => {
      console.log(this.polys.selectAll('.poly'));
      this.polys.selectAll('.poly')
        .classed('light0', d => d.layer === 0 && d.type === 1)
        .classed('dark0', d => d.layer === 0 && d.type === 2)
        .classed('light1', d => d.layer === 1 && d.type === 1)
        .classed('dark1', d => d.layer === 1 && d.type === 2)
        .classed('light2', d => d.layer === 2 && d.type === 1)
        .classed('dark2', d => d.layer === 2 && d.type === 2)
        .classed('light3', d => d.layer === 3 && d.type === 1)
        .classed('dark3', d => d.layer === 3 && d.type === 2);
    })
      .on('mouseout', d => {
        this.polys.selectAll('.poly')
          .classed('light0', false)
          .classed('dark0', false)
          .classed('light1', d => false)
          .classed('dark1', d => false)
          .classed('light2', d => false)
          .classed('dark2', d => false)
          .classed('light3', d => false)
          .classed('dark3', d => false);
      });
  }

};
