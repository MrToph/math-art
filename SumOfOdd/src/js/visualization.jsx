class Visualization {
  constructor(element) {
    this.svg = null;
    this.margin = {top: -0, right: -0, bottom: -0, left: -0};
    this.width = 1800;
    this.height = 900;

    this.currentStep = 0;
    this.maxStep = 0;

    let realWidth = this.width + this.margin.left + this.margin.right;
    let realHeight = this.height + this.margin.top + this.margin.bottom;
    // Constants
    this.sqrSize = 100;
    this.numLayers = 8;
    this.translate = [(realWidth - this.numLayers * this.sqrSize) * 0.5,0];
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
    this.texts = this.container.append('g');

    this.redraw(0);
  }

createData() {
    let sqrArr = [];
    for(let i = 0; i < this.numLayers; i++){
        for(let j = 0; j < this.numLayers; j++){
            let xPos = j * this.sqrSize;
            let yPos = i * this.sqrSize;
            let type = Math.max(this.numLayers -1 - i,j);
            type = type % 2;
            let obj = {id: [i,j], x: xPos, y: yPos, type: type};
            sqrArr.push(obj);
        }
    }
    this.squareData = sqrArr;

    let txtArr = [];
    for(let i = 0; i < this.numLayers; i++){
        let caption = 2*(i+1) - 1;
        if(i === this.numLayers - 2)
            caption = "\u22f0";
        else if(i === this.numLayers - 1)
            caption = "2n-1";
        let obj = {x: (i + 0.5) * this.sqrSize, y: (this.numLayers - 0.4 - i) * this.sqrSize, caption: caption, type: i % 2};
        txtArr.push(obj);
    }
    for(let i = 0; i < this.numLayers; i++){
        let caption = i + 1;
        if(i === this.numLayers - 2)
            caption = "\u2026";
        else if(i === this.numLayers - 1)
            caption = "n";
        let obj = {x: (i + 0.5) * this.sqrSize, y: (this.numLayers + 0.6 ) * this.sqrSize, caption: caption, type: 2};
        txtArr.push(obj);
    }
    this.textData = txtArr;
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
                .attr('y', d => d.y)
                .classed('firstColor', d => d.type == 0)
                .classed('secondColor', d => d.type == 1);

    let texts = this.texts.selectAll(".txt").data(this.textData).enter().append('text').attr('class', 'txt');
    texts = this.texts.selectAll(".txt")
                        .text( d => d.caption)
                        .attr('text-anchor', "middle")  // horizontal alignment
                        .attr('dominant-baseline', "middle")  // vertical alignment
                        .attr('transform', d => "translate(" + (d.x) + "," + d.y + ")")
                        .classed('firstColor', d => d.type == 1)
                        .classed('secondColor', d => d.type == 0);
  }
}