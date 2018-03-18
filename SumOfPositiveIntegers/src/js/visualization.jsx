class Visualization extends ISteppable{
  constructor(element) {
    super();
    this.svg = null;
    this.margin = {top: -0, right: -0, bottom: -0, left: -0};
    this.width = 1000;
    this.height = 500;

    this.currentStep = 0;
    this.maxStep = 2;

    this.translate = [0,0];
    this.scale = 1;

    let realWidth = this.width + this.margin.left + this.margin.right;
    let realHeight = this.height + this.margin.top + this.margin.bottom;
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
    this.triangles = [this.container.append('g'), this.container.append('g')]

    // Constants
    this.colors = ["#ff3232", "#3232ff", "#32CD32", "#ffa500", "#8A2BE2"];
    this.trWidth = 100;
    this.trHeight = this.trWidth;
    this.margin = 2 * this.trWidth;
    this.numCells = 5;

    this.redraw(0);
  }
  
// http://www.fileformat.info/info/unicode/category/Sm/list.htm
// \dots = \u2026   \vdots = \u22ee \ddots = \u22f0 (/) \u22f1 (\)
createData(step) {
    switch(step){
        default:{
            this.triangleDrawData = [];
            this.triangleDrawData.push(this.createTriangleData(false));
            this.triangleDrawData.push(this.createTriangleData(true));
        break;
        }
    }
}

// idToText is a function that maps (row, column) to (text, layer) where layer is from 0 .. this.numCells [-1]
// layer represents the structural layout of the triangle (layer 0: is where the 1's are, layer 1: where the 2's ... layer numCells - 1: where text = n)
createTriangleData(upwards){
    let arr = [];
    for(let i = 0; i < this.numCells; i++){
        for(let j = 0; j <= i; j++){
            let jj = upwards ? (this.numCells - 1 - j) : j;
            let ii = upwards ? (this.numCells - 1 - i) : i;
            let xOffset = upwards ? this.numCells * this.trWidth : 0;
            let xPos = jj * this.trWidth + xOffset;
            let yPos = ii * this.trHeight;
            let layer = i;
            arr.push({id: [i,j], width: this.trWidth, height: this.trHeight, layer: layer,
                        x: xPos, y: yPos});
        }
    }
    return arr;
}

redraw(step = this.currentStep){
    this.currentStep = step;

    this.createData(step);
    for(let i = 0; i < 2; i++){
        this.createTriangle(step, i);
    }
    if(step === 1){
        let translationDuration = 3000;
        let xOffset = (this.numCells - 1)/2 * this.trWidth;
        this.triangles[0].selectAll('.square').transition().ease('linear')
          .duration(translationDuration).attr("x", d => d.x + xOffset);

        xOffset = -xOffset;
        this.triangles[1].selectAll('.square').transition().ease('linear')
          .duration(translationDuration).attr("x", d => d.x + xOffset)
          .call(endAll, () => { stepper.onForward() });
    }
}

  createTriangle(step, index){
    let triangleWidth = this.numCells * this.trWidth;
    this.triangles[index].selectAll(".square").remove();
    let squares = this.triangles[index].selectAll(".square").data(this.triangleDrawData[index]);
    squares.enter().append('rect').attr('class', 'square');

    // update
    let xOffset = (step === 2) ? (this.numCells - 1)/2 * this.trWidth : 0;
    xOffset = index === 0 ? xOffset : -xOffset;
    squares = this.triangles[index].selectAll(".square")
                .attr('width', d => d.width)
                .attr('height', d => d.height)
                .attr('x', d => d.x + xOffset)
                .attr('y', d => d.y)
                .attr("fill", (d,i) => {
                    if(step === 0)
                        return this.colors[d.layer];
                    else
                        return this.colors[index];
                });
  }

  onStep(forward){
    // always stop all transitions
    this.container.selectAll('.square').transition();
    return super.onStep(forward);
  }
}

function endAll (transition, callback) {
    var n;

    if (transition.empty()) {
        callback();
    }
    else {
        n = transition.size();
        transition.each("end", () => {
            n--;
            if (n === 0) {
                callback();
            }
        });
    }
}