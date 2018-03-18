class Visualization {
  constructor(element) {
    this.svg = null;
    this.margin = {top: -0, right: -0, bottom: -0, left: -0};
    this.width = 1000;
    this.height = 500;

    this.currentStep = 0;
    this.maxStep = 0;

    let realWidth = this.width + this.margin.left + this.margin.right;
    let realHeight = this.height + this.margin.top + this.margin.bottom;
    this.translate = [realWidth * 0.33,0];
    this.scale = 1;

    let svg = d3.select(element).append("svg")
        .attr("viewBox", "0 0 " + realWidth + " " + realHeight)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.right + ")")

    this.svg = svg;

    let rect = svg.append("rect")
                .attr("class", "svgOuterRect")
                .attr("x", -this.margin.left)
                .attr("y", -this.margin.top)
                .attr("width", realWidth)
                .attr("height", realHeight);

    let container = svg.append("g")
                      .attr("transform", "translate(" + this.translate[0] + "," + this.translate[1] + "),scale(" + this.scale + ")");
    this.container = container;
    this.squares = this.container.append('g');
    this.triangles = this.container.append('g');
    this.links = [];

    // Constants
    this.colors = ["#ff3232", "#32CD32", "#3232ff", "#ffa500", "#8A2BE2"];
    this.sqrSize = 100;
    this.numLayers = 5;

    this.redraw(0);
  }

createData() {
    let sqrArr = [];
    let trArr = [];
    for(let i = 0; i < this.numLayers; i++){
        for(let j = 0; j < i; j++){
            let xPos = j * this.sqrSize;
            let yPos = i * this.sqrSize;
            let obj = {id: [i,j], x: xPos, y: yPos};
            sqrArr.push(obj);
        }
        for(let j = 0; j < 2; j++){
            let a = [i * this.sqrSize, i * this.sqrSize];   // topleft
            let b = j == 0 ? [i * this.sqrSize, (i+1) * this.sqrSize] : [(i+1) * this.sqrSize, (i) * this.sqrSize];   // botleft // topRight
            let c = [(i+1) * this.sqrSize, (i+1) * this.sqrSize];   // botRight
            let obj = {a: a, b: b, c: c, type: j};
            trArr.push(obj);
        }
    }
    this.squareData = sqrArr;
    this.triangleData = trArr;
}

redraw(step = this.currentStep){
    this.currentStep = step;
    this.createData();
    this.createPolygons();
}

  createPolygons(){
    let squares = this.squares.selectAll(".square").data(this.squareData);
    squares.enter().append('rect').attr('class', 'square');
    this.squares.selectAll(".square")
                .attr('width', this.sqrSize)
                .attr('height', this.sqrSize)
                .attr('x', d => d.x)
                .attr('y', d => d.y);

    let triangles = this.triangles.selectAll(".triangle").data(this.triangleData);
    triangles.enter().append('polygon').attr('class', 'triangle');
    this.triangles.selectAll(".triangle")
                .attr('points', d => `${d.a[0]},${d.a[1]} ${d.b[0]},${d.b[1]} ${d.c[0]},${d.c[1]} `)
                .classed('lowerTriangle', d => d.type == 0)
                .classed('upperTriangle', d => d.type == 1);
  }
}