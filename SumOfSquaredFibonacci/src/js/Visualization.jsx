import ISteppable from './ISteppable';
export default class Visualization extends ISteppable {
  constructor (element) {
    super();
    this.svg = null;
    this.margin = {top: -0, right: -0, bottom: -0, left: -0};
    this.width = 1000;
    this.height = 500;

    this.currentStep = 0;
    this.maxStep = 7;

    let realWidth = this.width + this.margin.left + this.margin.right;
    let realHeight = this.height + this.margin.top + this.margin.bottom;
    // Constants
    this.init(); // init fibonacci numbers
    this.eleSize = (this.height - this.borderSize) / (this.fib[this.fib.length - 1]);
    this.translate = [0.5 * (realWidth - this.borderSize - this.eleSize * (this.fib[this.fib.length - 1] + this.fib[this.fib.length - 2])), 0];
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
    this.outer = this.container.append('g');
    this.redraw(0);
  }

  init () {
    this.fib = [1, 1];
    for (let i = 2; i <= this.maxStep; i++) {
      this.fib[i] = this.fib[i - 1] + this.fib[i - 2];
    }
    this.borderSize = 50;
  }

  createData (step) {
    let groupData = [];
    for (let i = 0; i <= step; i++) {
      let obj = this.createPoly(i);
      groupData.push(obj);
    }
    this.groupData = groupData;

    // Outer stuff, like axis + text
    let cornerSize = 10; // size of 'corner' of a bar
    let outerData = [];
    // horizontal bar
    let size = this.fib.reduce((a, x, index) => a + (index <= step && index % 2 === 1 ? x : 0), this.fib[0]);
    let a = [this.borderSize, cornerSize];
    let b = [this.borderSize, 0];
    let c = [this.borderSize + size * this.eleSize, 0];
    let d = [this.borderSize + size * this.eleSize, cornerSize];
    let horizontal = {a: a, b: b, c: c, d: d, text: size, textOffset: [0, 0.5 * this.borderSize], type: step % 2};
    outerData.push(horizontal);
    // same for vertical bar
    size = this.fib.reduce((a, x, index) => a + (index <= step && index % 2 === 0 ? x : 0), 0);
    a = [cornerSize, this.borderSize];
    b = [0, this.borderSize];
    c = [0, this.borderSize + size * this.eleSize];
    d = [cornerSize, this.borderSize + size * this.eleSize];
    let vertical = {a: a, b: b, c: c, d: d, text: size, textOffset: [0.5 * this.borderSize, 0], type: 1 - step % 2};
    outerData.push(vertical);
    this.outerData = outerData;
  }

  createPoly (i) {
    let fontSize = 12;
    if (i > 1) fontSize += Math.pow(this.fib[i], 1.5);
    fontSize = fontSize + 'pt';
    let x = 0; // top left x
    let y = 0; // top left y
    if (i % 2 === 0) {
      y = this.fib.reduce((a, x, index) => a + (index < i && index % 2 === 0 ? x : 0), 0);
    } else {
      x = this.fib.reduce((a, x, index) => a + (index < i && index % 2 === 1 ? x : 0), this.fib[0]);
    }
    x *= this.eleSize; y *= this.eleSize;
    let size = this.eleSize * this.fib[i];
    let topLeft = [x, y];
    let topRight = [x + size, y];
    let botRight = [x + size, y + size];
    let botLeft = [x, y + size];
    let obj = {id: i, a: topLeft, b: topRight, c: botRight, d: botLeft, text: this.fib[i], fontSize: fontSize};
    return obj;
  }

  redraw (step = this.currentStep) {
    this.currentStep = step;
    this.createData(step);
    this.elements.selectAll('.groupContainer').remove();
    this.outer.selectAll('.outerGroup').remove();
    this.createElements();
    this.createAnimations(step);
  }

  createElements () {
    this.elements.attr('transform', `translate(${this.borderSize}, ${this.borderSize})`);
    let groups = this.elements.selectAll('.groupContainer').data(this.groupData);
    groups.enter().append('g').attr('class', 'groupContainer');

    let lineFunction = d3.svg.line()
      .x(d => d[0])
      .y(d => d[1])
      .interpolate('linear');
    this.elements.selectAll('.groupContainer').append('path').attr('class', 'element')
      .attr('d', d => lineFunction([d.a, d.b, d.c, d.d, d.a]));

    // this.elements.selectAll('.groupContainer').append('polygon').attr('class', 'element')
      //   .attr('points', d => `${d.a[0]},${d.a[1]} ${d.b[0]},${d.b[1]} ${d.c[0]},${d.c[1]} ${d.d[0]},${d.d[1]}`)

    this.elements.selectAll('.groupContainer').append('text').attr('class', 'txt')
      .text(d => d.text)
      .attr('text-anchor', 'middle') // horizontal alignment
      .attr('dominant-baseline', 'middle') // vertical alignment
      .attr('font-size', d => d.fontSize) // vertical alignment
      .attr('transform', d => {
        let middle = [0.5 * (d.a[0] + d.b[0]), 0.55 * (d.a[1] + d.c[1])];
        return 'translate(' + middle[0] + ',' + middle[1] + ')';
      });

    let outer = this.outer.selectAll('.outerGroup').data(this.outerData).enter().append('g').attr('class', 'outerGroup');
    outer.append('polyline').attr('class', 'axis')
      .attr('points', d => `${d.a[0]},${d.a[1]} ${d.b[0]},${d.b[1]} ${d.c[0]},${d.c[1]} ${d.d[0]},${d.d[1]}`);
    outer.append('text').attr('class', 'outerTxt')
      .text(d => d.text)
      .attr('text-anchor', 'middle') // horizontal alignment
      .attr('dominant-baseline', 'middle') // vertical alignment
      .attr('transform', d => {
        let middle = [0.5 * (d.b[0] + d.c[0]), 0.5 * (d.b[1] + d.c[1])];
        return 'translate(' + (middle[0] + d.textOffset[0]) + ',' + (middle[1] + d.textOffset[1]) + ')';
      })
      .classed('firstColor', d => d.type === 0)
      .classed('secondColor', d => d.type === 1);
  }

  createAnimations (step) {
    let path = this.elements.selectAll('.element').filter(d => d.id === step);
    let totalLength = path.node().getTotalLength();

    path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1000)
      .ease('linear')
      .attr('stroke-dashoffset', 0);
  }

  onStep (forward) {
    // always stop all transitions
    // this.elements.selectAll('.triangle').interrupt().transition();
    // this.elements.selectAll('.txt').interrupt().transition();
    return super.onStep(forward); // calls redraw
  }

};
