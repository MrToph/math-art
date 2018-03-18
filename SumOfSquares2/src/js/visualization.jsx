class Visualization extends ISteppable{
  constructor(element) {
    super();
    this.svg = null;
    this.margin = {top: -0, right: -0, bottom: -0, left: -0};
    this.width = 2600;
    this.height = 500;

    this.currentStep = 0;
    this.maxStep = 1;

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
    this.triangles = container.append('svg:g');
    this.texts = container.append('svg:g');

    // Constants
    this.colors = ["#ff3232", "#32CD32", "#3232ff", "#000000", "#ffa500", "#8A2BE2"];
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
            this.triangleDrawData.push(this.createTriangleData(([i,j]) => {
                let layer = i;
                let text = i+1;
                if(i === this.numCells - 2){
                    text = j < 3 ? "\u22ee" : "\u22f1";
                }
                else if(i === this.numCells - 1)
                    text = "n";
                return [text, layer];
            }));
            this.triangleDrawData.push(this.createTriangleData(([i,j]) => {
                let layer = this.numCells - 1 - (i-j);
                let text = this.numCells - (i-j);
                if(text == this.numCells - 1){
                    switch(j){
                        case 0:
                            text = "\u22ee";
                            break;
                        case 3:
                            text = "\u2026";
                            break;
                        default:
                            text = "\u22f0";
                    }
                }
                else if (text == this.numCells)
                    text = "n";
                return [text, layer];
            }));
            this.triangleDrawData.push(this.createTriangleData(([i,j]) => {
                let layer = this.numCells - 1 - j;
                let text = this.numCells - j;
                if(text == this.numCells - 1){
                    switch(i){
                        case 1:
                            text = "\u22f1";
                            break;
                        default:
                            text = "\u2026";
                    }
                }
                else if (text == this.numCells)
                    text = "n";
                return [text, layer];
            }));
            this.triangleDrawData.push(this.createTriangleData(([i,j]) => ["2n+1", this.numCells]));

            // +, +, = between the triangles
            let triangleWidth = this.numCells * this.trWidth;
            this.operandData = [{x: triangleWidth + 0.5* this.margin, y: 0.5* triangleWidth, caption: "+", fontSize: "96pt"},
                                {x: 2 * triangleWidth + 1.5 * this.margin, y: 0.5* triangleWidth, caption: "+", fontSize: "96pt"},
                                {x: 3 * triangleWidth + 2.5* this.margin, y: 0.5* triangleWidth, caption: "=", fontSize: "96pt"}];
        break;
        }
    }
}

// idToText is a function that maps (row, column) to (text, layer) where layer is from 0 .. this.numCells [-1]
// layer represents the structural layout of the triangle (layer 0: is where the 1's are, layer 1: where the 2's ... layer numCells - 1: where text = n)
createTriangleData(idToText){
    let arr = [];
    for(let i = 0; i < this.numCells; i++){
        for(let j = 0; j <= i; j++){
            let xPos = j * this.trWidth;
            let yPos = i * this.trHeight;
            let [text, layer] = idToText([i,j]);
            arr.push({id: [i,j], width: this.trWidth, height: this.trHeight, caption: text, layer: layer,
                        x: xPos, y: yPos});
        }
    }
    return arr;
}

redraw(step = this.currentStep){
    this.currentStep = step;

    this.createData(step);
    this.triangles.selectAll('.squareContainer0, .squareContainer1, .squareContainer2, .squareContainer3').remove();
    for(let i = 0; i < 4; i++){
        this.createTriangle(i);
    }
    this.createOperands();
    if(step === 0){
        let opacityDuration = 2250;
        let triangles = this.triangles.selectAll('.squareContainer0, .squareContainer1, .squareContainer2, .squareContainer3').select('.squareText');
        triangles.style("opacity", 0.0).transition().ease('linear')
          .duration(opacityDuration).delay(d => d.layer * opacityDuration).style("opacity", 1.0)
          .call(endAll, () => { stepper.onForward() });
    }
}

createOperands(){
    let texts = this.texts.selectAll(".operand").data(this.operandData).enter().append('text').attr('class', 'operand');
    texts = this.texts.selectAll(".operand")
                        .text( d => d.caption)
                        .attr('text-anchor', "middle")  // horizontal alignment
                        .attr('dominant-baseline', "middle")  // vertical alignment
                        .attr('transform', d => "translate(" + (d.x) + "," + (1.1 * d.y) + ")")
                        .attr("font-size", d => d.fontSize);
}

  createTriangle(index){
    let triangleWidth = this.numCells * this.trWidth;
    let squares = this.triangles.selectAll(".squareContainer" + index).data(this.triangleDrawData[index]);
    let squaresContainer = squares.enter().append('g').attr('class', 'squareContainer' + index);
    squaresContainer.append('rect').attr('class', 'square');
    squaresContainer.append('text').attr('class', 'squareText');
    // update
    squares = this.triangles.selectAll(".squareContainer" + index);
    squares.attr('transform', 'translate(' + (index * (triangleWidth + this.margin)) + ', 0)')
    squares.selectAll(".square").data(d => [d]) // descend parent data into children, d comes from parent selection (need to select .squareContainer because of that)
                .attr('width', d => d.width)
                .attr('height', d => d.height)
                .attr('x', d => d.x )
                .attr('y', d => d.y);

    let fontSize = index === 3 ? "23pt" : "36pt";
    squares.selectAll('.squareText').data(d => [d]) // descend parent data into children
                        .text( d => d.caption)
                        .attr('text-anchor', "middle")  // horizontal alignment
                        .attr('dominant-baseline', "middle")  // vertical alignment
                        .attr('transform', d => "translate(" + (d.x + 0.5 * d.width) + "," + (d.y + 0.55 * d.height) + ")")
                        .attr("font-size", fontSize)
                        .style("opacity", 1.0)
                        .attr("fill", d => this.colors[d.layer]);
  }

  onStep(forward){
    // always stop all transitions
    this.container.selectAll('.squareText').transition();
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