import ISteppable from './ISteppable';
export default class Visualization extends ISteppable {
  constructor (element) {
    super();
    this.svg = null;
    this.margin = {top: -0, right: -0, bottom: -0, left: -0};
    this.width = 1000;
    this.height = 500;

    this.currentStep = 0;
    this.maxStep = 3;

    let realWidth = this.width + this.margin.left + this.margin.right;
    let realHeight = this.height + this.margin.top + this.margin.bottom;
    // Constants
    this.trSize = 60;
    this.numLayers = 7;
    this.translate = [(realWidth - this.numLayers * this.trSize) * 0.5, 0];
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
    this.groups = this.container.append('g');
    this.texts = this.container.append('g');
    this.redraw(0);
  }

  createData (step) {
    let groupData = [];
    let xOffset = this.trSize;
    let yOffset = this.trSize;
    let fontSize = '12pt';
    let newFontSize = '90pt';
    if (step <= 1) {
      let a = [xOffset, yOffset];
      let b = [xOffset + this.trSize, yOffset];
      let c = [xOffset, yOffset + this.trSize];
      let obj = {id: [0, 0], a: a, b: b, c: c, text: '\u0394', fontSize: fontSize, type: 0};
      if (step === 1) {
        let b2 = [xOffset + this.trSize * this.numLayers, yOffset];
        let c2 = [xOffset, yOffset + this.trSize * this.numLayers];
        obj.b2 = b2;
        obj.c2 = c2;
        obj.newFontSize = newFontSize;
      }
      groupData.push(obj);
    } else if (step === 2) {
      let a = [xOffset, yOffset];
      let b = [xOffset + this.trSize * this.numLayers, yOffset];
      let c = [xOffset, yOffset + this.trSize * this.numLayers];
      let obj = {id: [0, 0], a: a, b: b, c: c, text: 'n\u00b2\u0394', fontSize: newFontSize, type: 1};
      groupData.push(obj);
    } else if (step === 3) {
      for (let r = 0; r < this.numLayers; r++) {
        for (let c = 0; c < this.numLayers - r; c++) {
          let p1 = [xOffset + c * this.trSize, yOffset + r * this.trSize];
          let p2 = [xOffset + c * this.trSize, yOffset + (r + 1) * this.trSize];
          let p3 = [xOffset + (c + 1) * this.trSize, yOffset + r * this.trSize];
          let p4 = [xOffset + (c + 1) * this.trSize, yOffset + (r + 1) * this.trSize];
          let obj = {id: [r, c, 0], a: p1, b: p2, c: p3, text: '\u0394', fontSize: fontSize, type: 0};
          groupData.push(obj);
          if (c < this.numLayers - r - 1) {
            obj = {id: [r, c, 1], a: p2, b: p3, c: p4, text: '\u0394', fontSize: fontSize, type: 0};
            groupData.push(obj);
          }
        }
      }
    }
    this.groupData = groupData;

    let txtArr = [];
    if (step > 0) {
      for (let i = 0; i < this.numLayers; i++) {
        let caption = '';
        switch (i) {
          case 0:
          case 1:
          case 2:
            caption = i + 1;
            break;
          case 4:
            caption = '\u2026';
            break;
          case this.numLayers - 1:
            caption = 'n';
            break;
        }

        let obj = {id: i, x: (i + 1 + 0.5) * this.trSize, y: 0.6 * this.trSize, caption: caption};
        txtArr.push(obj);
      }
      if (step === 3) {
        for (let i = 0; i < this.numLayers; i++) {
          let caption = '';
          switch (i) {
            case 0:
            case 1:
            case 2:
              caption = (2 * i + 1);
              break;
            case 4:
              caption = '\u22f0';
              break;
            case this.numLayers - 1:
              caption = '2n-1';
              break;
          }

          let obj = {x: (i + 2.5) * this.trSize, y: (this.numLayers - i + 0.6) * this.trSize, caption: caption};
          txtArr.push(obj);
        }
      }
    }
    this.textData = txtArr;
  }

  redraw (step = this.currentStep) {
    this.currentStep = step;
    this.createData(step);
    this.groups.selectAll('.groupContainer').remove();
    this.texts.selectAll('.outerTxt').remove();
    this.createElements();
    this.createAnimations(step);
  }

  createElements () {
    let groups = this.groups.selectAll('.groupContainer').data(this.groupData);
    groups.enter().append('g').attr('class', 'groupContainer');
    this.groups.selectAll('.groupContainer').append('polygon').attr('class', 'triangle')
      .attr('points', d => `${d.a[0]},${d.a[1]} ${d.b[0]},${d.b[1]} ${d.c[0]},${d.c[1]} `)
      .classed('firstColor', d => d.type === 0)
      .classed('secondColor', d => d.type === 1);

    this.groups.selectAll('.groupContainer').append('text').attr('class', 'txt')
      .text(d => d.text)
      .attr('text-anchor', 'middle') // horizontal alignment
      .attr('dominant-baseline', 'middle') // vertical alignment
      .attr('font-size', d => d.fontSize) // vertical alignment
      .attr('transform', d => {
        let middle = [(1.0 / 3) * (d.a[0] + d.b[0] + d.c[0]), (1.0 / 3) * (d.a[1] + d.b[1] + d.c[1])];
        return 'translate(' + middle[0] + ',' + middle[1] + ')';
      });

    this.texts.selectAll('.outerTxt').data(this.textData).enter().append('text').attr('class', 'outerTxt');
    this.texts.selectAll('.outerTxt')
      .text(d => d.caption)
      .attr('text-anchor', 'middle') // horizontal alignment
      .attr('dominant-baseline', 'middle') // vertical alignment
      .attr('transform', d => 'translate(' + (d.x) + ',' + d.y + ')');
  }

  createAnimations (step) {
    if (step !== 1) return;
    let translationDuration = 2000;
    this.groups.selectAll('.triangle').transition().ease('linear')
      .duration(translationDuration).attr('points', d => `${d.a[0]},${d.a[1]} ${d.b2[0]},${d.b2[1]} ${d.c2[0]},${d.c2[1]} `);

    this.groups.selectAll('.txt').transition().ease('linear')
      .duration(translationDuration).attr('transform', d => {
      let middle = [(1.0 / 3) * (d.a[0] + d.b2[0] + d.c2[0]), (1.0 / 3) * (d.a[1] + d.b2[1] + d.c2[1])];
      return 'translate(' + middle[0] + ',' + middle[1] + ')';
    })
      .attr('font-size', d => d.newFontSize)
      .each('end', () => window.stepper.onForward());

    this.texts.selectAll('.outerTxt').style('opacity', 0.0).transition().ease('linear')
      .duration(translationDuration / this.numLayers).style('opacity', 1.0).delay(d => d.id * (translationDuration / this.numLayers));
  }

  onStep (forward) {
    // always stop all transitions
    this.groups.selectAll('.triangle').interrupt().transition();
    this.groups.selectAll('.txt').interrupt().transition();
    return super.onStep(forward); // calls redraw
  }

};
