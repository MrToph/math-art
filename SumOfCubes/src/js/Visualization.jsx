import ISteppable from './ISteppable';
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
    // Constants
    this.layer = 6;
    this.offsetFactor = 2;
    this.eleSize = 40;
    let trans = 0.5 * (realWidth - this.layer * (this.layer + 1) / 2 * this.eleSize - this.offsetFactor * this.eleSize);
    this.translate = [trans, trans];
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

  createData (step) {
    let elementData = [];
    // outer border of squares
    let x = this.offsetFactor * this.eleSize;
    let y = 0; // top left y
    for (let i = 0; i < this.layer; i++) {
      x += i * this.eleSize; // top left x
      let width = i + 1;
      let height = 1;
      let obj = this.createEle(i, x, y, width, height, '');
      elementData.push(...obj);
      obj = this.createEle(i, y, x, height, width, '');
      elementData.push(...obj);
    }

    // inner square
    let offset = this.offsetFactor * this.eleSize;
    x = 0;
    y = 0;
    for (let i = 0; i < this.layer; i++) {
      // if odd or even everyone has a rect along the diagonal
      let objArr = []; // we want to reverse this list at the end
      x += i * this.eleSize; // top left x
      let rectSize = i + 1;
      let obj = this.createEle(i, x + offset, x + offset, rectSize, rectSize, (i + 1) + '\u00b2');
      objArr.push(...obj);

      if (i % 2) { // odd numbers have a split rect on the border
        obj = this.createEle(i, x + offset, offset, rectSize, rectSize / 2, (i + 1) + '\u00b2/2');
        objArr.push(...obj);
        obj = this.createEle(i, offset, x + offset, rectSize / 2, rectSize, (i + 1) + '\u00b2/2');
        objArr.push(...obj);
      }

      // fill in the rest of the triangles
      y = (i % 2) * (rectSize / 2) * this.eleSize; // if i % 2 == 0 then newX = x, otherwise newX = x + rectSize / 2
      for (let j = 0; j < Math.floor(i / 2); j++) {
        obj = this.createEle(i, x + offset, y + offset, rectSize, rectSize, (i + 1) + '\u00b2');
        objArr.push(...obj);
        obj = this.createEle(i, y + offset, x + offset, rectSize, rectSize, (i + 1) + '\u00b2');
        objArr.push(...obj);
        y += rectSize * this.eleSize;
      }
      objArr.reverse();
      elementData.push(...objArr);
    }
    this.elementData = elementData;
  }

  createEle (id, x, y, width, height, text) {
    let fontSize = 16;
    if (id > 1) fontSize = fontSize * 2;
    fontSize = fontSize + 'pt';

    let objArr = [];
    // create one outer rect with a thick border
    objArr.push({id: id, x: x, y: y, width: width * this.eleSize, height: height * this.eleSize, type: 0, text: text, fontSize: fontSize});
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let xx = x + i * this.eleSize;
        let yy = y + j * this.eleSize;
        let obj = {id: [id, i, j], x: xx, y: yy, width: this.eleSize, height: this.eleSize, type: id + 1};
        objArr.push(obj);
      }
    }

    return objArr;
  }

  redraw (step = this.currentStep) {
    this.currentStep = step;
    this.createData(step);
    this.elements.selectAll('.groupContainer').remove();
    this.outer.selectAll('.outerGroup').remove();
    this.createElements(step);
  }

  createElements (step) {
    let groups = this.elements.selectAll('.groupContainer').data(this.elementData);
    groups.enter().append('g').attr('class', 'groupContainer').classed('holdsText', d => d.type === 0);

    this.elements.selectAll('.groupContainer').append('rect').attr('class', 'element')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .classed('thickBorder', d => d.type === 0)
      .classed('color1', d => d.type === 1)
      .classed('color2', d => d.type === 2)
      .classed('color3', d => d.type === 3)
      .classed('color4', d => d.type === 4)
      .classed('color5', d => d.type === 5)
      .classed('color6', d => d.type === 6);

    if (step > 0) {
      this.elements.selectAll('.holdsText').append('text').attr('class', 'txt')
        .text(d => d.text)
        .attr('text-anchor', 'middle') // horizontal alignment
        .attr('dominant-baseline', 'middle') // vertical alignment
        .attr('font-size', d => d.fontSize) // vertical alignment
        .attr('transform', d => {
          let middle = [d.x + 0.5 * d.width, d.y + 0.5 * d.height];
          return 'translate(' + middle[0] + ',' + middle[1] + ')';
        });
    }
  }

  onStep (forward) {
    return super.onStep(forward); // calls redraw
  }

};
