import ISteppable from './ISteppable';
require('../css/app.css');

export default class Visualization extends ISteppable {
  constructor (element) {
    super();
    this.svg = null;
    this.margin = {top: -0, right: -0, bottom: -0, left: -0};
    this.width = 1000;
    this.height = 1000;

    this.currentStep = 0;
    this.maxStep = 1;

    let realWidth = this.width + this.margin.left + this.margin.right;
    let realHeight = this.height + this.margin.top + this.margin.bottom;

    let svg = d3.select(element).append('svg')
      .attr('viewBox', '0 0 ' + realWidth + ' ' + realHeight)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.right + ')');

    this.svg = svg;

    // Constants
    this.upTo = 25;
    this.zoomStartLayer = 1;
    this.eleSize = 75;
    this.translate = [0, 0];
    this.scale = this.width / ((this.zoomStartLayer + 3.5) * this.eleSize);

    svg.append('rect')
      .attr('class', 'svgOuterRect')
      .attr('x', -this.margin.left)
      .attr('y', -this.margin.top)
      .attr('width', realWidth)
      .attr('height', realHeight);
    let container = svg.append('g').attr('class', 'container')
      .attr('transform', `translate(${this.translate[0]},${this.translate[1]}), scale(${this.scale})`);
    this.container = container;
    this.curve = this.container.append('g');
    this.elements = this.container.append('g');
    this.redraw(0);
  }

  createData (step, forward = true) {
    let gcd = (a, b) => {
      return b === 0 ? a : gcd(b, a % b);
    };
    let elementData = [];
    this.curveData = [{points: new Array(this.upTo * this.upTo)}]; // path (curve) that goes through all points
    let curvePoints = this.curveData[0].points;
    for (let r = 0; r < this.upTo; r++) {
      for (let c = 0; c < this.upTo; c++) {
        let x = (c + 1) * this.eleSize;
        let y = (r + 1) * this.eleSize;
        let type = gcd(r + 1, c + 1) > 1 ? 1 : 0; // is it reduced fraction?
        // let id = (r + c - 1)*(r + c - 2)/2 + r // diagonal enumeration
        // L shaped build up, // reverse direction for even layers, i.e. Math.max(r,c) % 2 === 0
        var id = Math.pow(Math.max(r, c), 2) + Math.max(r, c) + (Math.max(r, c) % 2 ? 1 : -1) * (r - c);
        let s = Math.floor(Math.sqrt(id));
        let t = id - s * (s + 1);
        let r2 = s + Math.min(t, 0);
        let c2 = s - Math.max(t, 0);
        if (s % 2 == 0) {
          var tmp = r2;
          r2 = c2;
          c2 = tmp;
        }
        let text = `(${r2},${c2})`;
        elementData.push({id, type, x, y, text});
        curvePoints[id] = [x, y];
      }
    }
    this.elementData = elementData;
  }

  redraw (step = this.currentStep , forward) {
    this.currentStep = step;
    this.createData(step, forward);
    this.elements.selectAll('.txt').remove();
    this.createElements();
    this.createAnimations();
  }

  createElements () {
    this.elements.selectAll('.txt').data(this.elementData).enter().append('text').attr('class', 'txt')
      .text(d => d.text)
      .attr('text-anchor', 'middle') // horizontal alignment
      .attr('dominant-baseline', 'middle') // vertical alignment
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .classed('type0', d => d.type === 0)
      .classed('type1', d => d.type === 1);

    let lineFunction = d3.svg.line()
      .x(d => d[0])
      .y(d => d[1])
      .interpolate('linear');
    this.curve.selectAll('.curve').data(this.curveData).enter().append('path').attr('class', 'curve')
      .attr('d', d => lineFunction(d.points));
  }

  createAnimations () {
    let path = this.curve.selectAll('.curve');
    let totalLength = path.node().getTotalLength();
    let curveAnimDuration = 5 * totalLength;
    path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(curveAnimDuration)
      .ease('linear')
      .attr('stroke-dashoffset', 0);

    let layer = this.zoomStartLayer; // layer of the grid. A layer is a L shaped ring
    let curveDurPerGridElement = curveAnimDuration / (this.upTo * this.upTo - 1);
    let zoomDuration = 350;
    let runAnimation = () => {
      if (layer > this.upTo) return;
      let delayLayer = (2 * layer + 1) * curveDurPerGridElement; // difference of elements of two layers = bigger square - smaller square
      if (layer === this.zoomStartLayer) { // start layer
        delayLayer = Math.pow(this.zoomStartLayer + 1, 2) * curveDurPerGridElement;
      }
      delayLayer -= zoomDuration;
      let scale = this.width / ((layer + 3.5) * this.eleSize); // 1 in advance, 1 because first element is at (1,1) instead of (0,0), 1 because of math, 0.5 padding
      this.container.transition().delay(delayLayer).duration(zoomDuration).ease('linear')
        .attr('transform', `translate(${this.translate[0]},${this.translate[1]}), scale(${scale})`)
        .each('end', () => {
          layer++;
          runAnimation();
        });
    };
    runAnimation();
  // let zoom = d3.behavior.zoom().scaleExtent([0.1, 1]).on('zoom', zoomed)
  // let zoomed = () => {
  //   this.container.attr('transform', `translate(${this.translate[0]},${this.translate[1]}), scale(${zoom.scale()})`)
  // }
  // this.container.call(zoom)
  // d3.transition().ease('linear').delay(4000).duration(750).tween('zoom', () => {
  //   var scale = d3.interpolate(1, 0.9)
  //   return t => {
  //     zoom.scale(scale(t))
  //     zoomed()
  //   }
  // })
  }

  onStep (forward) {
    this.elements.selectAll('.element').interrupt().transition();
    return super.onStep(forward); // calls redraw
  }

};
