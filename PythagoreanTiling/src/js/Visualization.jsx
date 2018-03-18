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
    this.layer = 3;
    this.ratio = 0.618; // golden ratio approx
    this.dragRectPos = [realWidth / 2, realHeight / 2];
    this.eleSize = this.width / this.layer;
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
    this.outer = this.container.append('g');
    this.dragRect = this.container.append('g');

    this.redraw(0);
  }

  createData (step) {
    let elementData = [];
    let ratio = this.ratio;
    let ratioInv = 1 - ratio;
    let a = (ratio * this.eleSize); // side length of type 0 square
    let b = (ratioInv * this.eleSize); // side length of type 1 square
    let layer = this.layer;
    let x = 0;
    let y = 0; // top left y
    let isVisible = (x, y, size) => {
      if (x + size < 0 || y + size < 0 || x > this.width || y > this.height) return false;
      return true;
    };
    for (let c = Math.floor(-1.5 * layer); c < 1.5 * layer; c++) {
      x = c * a; // starting x position for column
      y = 0 - c * b; // starting y position for column
      for (let r = -1 * layer; r < 1 * layer; r++) {
        if (isVisible(x, y, a)) elementData.push({id: [r, c, 0], x: x, y: y, size: a, type: 0});
        if (isVisible(x, y + a, b)) elementData.push({id: [r, c, 0], x: x, y: y + a, size: b, type: 1});
        x += b;
        y += a;
      }
    }
    this.elementData = elementData;

    // drag and drop point + bar
    let outerData = [];
    let cornerSizeHalf = 5;
    let barSize = 200;
    let marginTopRight = 50;
    x = this.width - marginTopRight - barSize;
    y = marginTopRight;
    outerData.push({leftTopCorner: [x, y - cornerSizeHalf], leftBotCorner: [x, y + cornerSizeHalf], middleStart: [x, y],
      middleEnd: [x + barSize, y], rightTopCorner: [x + barSize, y - cornerSizeHalf], rightBotCorner: [x + barSize, y + cornerSizeHalf],
      radius: 15, x: x + this.ratio * barSize, y: y});
    this.outerData = outerData;

    // drag rectangle
    this.createDragRectData();
  }

  createDragRectData () { // own function, because we don't want to call redraw() -> createData() on every mousemove
    let a = (this.ratio * this.eleSize); // side length of type 0 square
    let b = ((1 - this.ratio) * this.eleSize); // side length of type 1 square
    let p4 = this.dragRectPos;
    let p1 = [p4[0] - b, p4[1] - a];
    let p2 = [p1[0] + a, p1[1] - b];
    let p3 = [p2[0] + b, p2[1] + a];
    let obj = {a: p1, b: p2, c: p3, d: p4}; // a = top left b = top right c = bot right d = bot left
    this.dragRectData = [obj];
  }

  redraw (step = this.currentStep) {
    this.currentStep = step;
    this.createData(step);
    this.elements.selectAll('.element').remove();
    this.createElements(step);
  }

  createElements (step) {
    let groups = this.elements.selectAll('.element').data(this.elementData);
    groups.enter().append('rect').attr('class', 'element')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.size)
      .attr('height', d => d.size)
      .classed('type0', d => d.type === 0)
      .classed('type1', d => d.type === 1);

    // drag and drop point + bnar
    var drag = d3.behavior.drag()
      .origin(d => d) // d needs to have .x, .y attributes
      .on('drag', (d, i) => {
        let ratio = Math.max(d.middleStart[0], Math.min(d.middleEnd[0], d3.event.x)); // number between middleStart[0] and middleStart[1]
        this.ratio = (ratio - d.middleStart[0]) / (d.middleEnd[0] - d.middleStart[0]); // normalize it
        this.redraw();
      });

    let outer = this.outer.selectAll('.outerGroup').data(this.outerData).enter().append('g').attr('class', 'outerGroup');
    outer.append('polyline').attr('class', 'axis')
      .attr('points', d => `${d.leftTopCorner[0]},${d.leftTopCorner[1]} ${d.leftBotCorner[0]},${d.leftBotCorner[1]} ${d.middleStart[0]},${d.middleStart[1]} 
        ${d.middleEnd[0]},${d.middleEnd[1]} ${d.rightTopCorner[0]},${d.rightTopCorner[1]} ${d.rightBotCorner[0]},${d.rightBotCorner[1]}`);
    outer.append('circle').attr('class', 'dragPoint')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.radius)
      .style('cursor', 'w-resize')
      .call(drag);
    // update already existing dragPoint's x
    this.outer.selectAll('.outerGroup').select('.dragPoint').attr('cx', d => d.x); // selectAll -> select propagates outerGroup's data to the selected child

    // drag rectangle
    let dragRectSel = this.dragRect.selectAll('.dragRect').data(this.dragRectData).enter().append('polyline').attr('class', 'dragRect')
      .attr('points', d => `${d.a[0]},${d.a[1]} ${d.b[0]},${d.b[1]} ${d.c[0]},${d.c[1]} ${d.d[0]},${d.d[1]} ${d.a[0]},${d.a[1]}`);
    if (!dragRectSel.empty()) {
      let _this = this;
      this.svg.on('mousemove', function () {
        let m = d3.mouse(this);
        _this.dragRectPos = [m[0], m[1]];
        _this.createDragRectData();
        dragRectSel.data(_this.dragRectData).attr('points', d => `${d.a[0]},${d.a[1]} ${d.b[0]},${d.b[1]} ${d.c[0]},${d.c[1]} ${d.d[0]},${d.d[1]} ${d.a[0]},${d.a[1]}`);
      });
    }
  }

  onStep (forward) {
    return super.onStep(forward); // calls redraw
  }

};
